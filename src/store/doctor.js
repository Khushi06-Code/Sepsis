import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db, waitForAuth } from "../Auth/firebase";
import {
  cloneVitals,
  normalizeEmail,
  normalizePatientDocument,
} from "./firestoreUtils";

const toNumberOrDefault = (value, fallback = 0) => {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : fallback;
};

const getRequiredDoctorId = async () => {
  await waitForAuth();

  const doctorId = auth.currentUser?.uid;

  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }

  return doctorId;
};

const resolveLinkedUserId = async (email, fallbackUserId = null) => {
  const authUser = auth.currentUser;
  const authEmail = normalizeEmail(authUser?.email || "");

  if (authUser?.uid && authEmail && authEmail === email) {
    return authUser.uid;
  }

  try {
    const usersSnap = await getDocs(
      query(collection(db, "users"), where("email", "==", email), limit(1))
    );

    if (!usersSnap.empty) {
      return usersSnap.docs[0].id;
    }
  } catch (error) {
    if (
      error?.code !== "permission-denied" &&
      error?.code !== "firestore/permission-denied"
    ) {
      throw error;
    }
  }

  return fallbackUserId;
};

const buildPatientPayload = ({ patientData, existingPatientData = {}, linkedUserId }) => {
  const now = new Date().toISOString();
  const patientName =
    patientData.patientName?.trim() || patientData.name?.trim() || "";

  return {
    patientName,
    email: normalizeEmail(patientData.email),
    age: toNumberOrDefault(patientData.age, existingPatientData.age ?? 0),
    gender: patientData.gender || existingPatientData.gender || "",
    vitals: cloneVitals(patientData.vitals ?? existingPatientData.vitals),
    prediction:
      patientData.prediction ?? existingPatientData.prediction ?? null,
    riskLevel: patientData.riskLevel ?? existingPatientData.riskLevel ?? null,
    linkedUserId: linkedUserId ?? existingPatientData.linkedUserId ?? null,
    createdAt:
      existingPatientData.createdAt || patientData.createdAt || now,
    updatedAt: now,
  };
};

const sortPatientsByUpdatedAt = (patients) =>
  [...patients].sort(
    (left, right) =>
      new Date(right.updatedAt || right.createdAt || 0).getTime() -
      new Date(left.updatedAt || left.createdAt || 0).getTime()
  );

const upsertPatient = (patients, nextPatient) =>
  sortPatientsByUpdatedAt([
    nextPatient,
    ...patients.filter((patient) => patient.id !== nextPatient.id),
  ]);

export const addPatient = createAsyncThunk(
  "doctor/addPatient",
  async (patientData, { rejectWithValue }) => {
    try {
      await waitForAuth();

      const doctorId = auth.currentUser?.uid;
      const email = normalizeEmail(patientData?.email);

      console.log("doctorId:", doctorId);
      console.log("authUser:", auth.currentUser);

      if (!doctorId) {
        throw new Error("Doctor ID is required");
      }

      if (!email) {
        throw new Error("Patient email is required");
      }

      const patientName =
        patientData?.patientName?.trim() || patientData?.name?.trim() || "";

      if (!patientName) {
        throw new Error("Patient name is required");
      }

      const patientRef = doc(db, "doctors", doctorId, "patients", email);
      const existingPatientSnap = await getDoc(patientRef);
      const existingPatientData = existingPatientSnap.exists()
        ? existingPatientSnap.data()
        : {};
      const linkedUserId = await resolveLinkedUserId(
        email,
        existingPatientData.linkedUserId ?? null
      );
      const payload = buildPatientPayload({
        patientData: {
          ...patientData,
          patientName,
          email,
        },
        existingPatientData,
        linkedUserId,
      });

      await setDoc(patientRef, payload, { merge: true });

      return normalizePatientDocument(email, payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to save patient");
    }
  }
);

export const getAllPatients = createAsyncThunk(
  "doctor/getAllPatients",
  async (limitCount, { rejectWithValue }) => {
    try {
      const doctorId = await getRequiredDoctorId();
      const constraints = [orderBy("updatedAt", "desc")];

      if (typeof limitCount === "number") {
        constraints.push(limit(limitCount));
      }

      const patientQuery = query(
        collection(db, "doctors", doctorId, "patients"),
        ...constraints
      );
      const snapshot = await getDocs(patientQuery);

      return snapshot.docs.map((patientDoc) =>
        normalizePatientDocument(patientDoc.id, patientDoc.data())
      );
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch patients");
    }
  }
);

export const getPatient = createAsyncThunk(
  "doctor/getPatient",
  async (patientId, { rejectWithValue }) => {
    try {
      const doctorId = await getRequiredDoctorId();
      const normalizedPatientId = normalizeEmail(decodeURIComponent(patientId));
      const docSnap = await getDoc(
        doc(db, "doctors", doctorId, "patients", normalizedPatientId)
      );

      if (!docSnap.exists()) {
        return rejectWithValue("Patient not found");
      }

      return normalizePatientDocument(docSnap.id, docSnap.data());
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch patient");
    }
  }
);

export const getHighRiskPatients = createAsyncThunk(
  "doctor/getHighRiskPatients",
  async (_, { rejectWithValue }) => {
    try {
      const doctorId = await getRequiredDoctorId();
      const snapshot = await getDocs(
        query(
          collection(db, "doctors", doctorId, "patients"),
          orderBy("updatedAt", "desc")
        )
      );

      return snapshot.docs
        .map((patientDoc) =>
          normalizePatientDocument(patientDoc.id, patientDoc.data())
        )
        .filter((patient) => patient.riskLevel === "High");
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch high risk patients");
    }
  }
);

const initialState = {
  patients: [],
  selectedPatient: null,
  highRiskPatients: [],
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearSelectedPatient: (state) => ({
      ...state,
      selectedPatient: null,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPatient.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(addPatient.fulfilled, (state, action) => {
        const nextPatients = upsertPatient(state.patients, action.payload);
        const nextHighRiskPatients =
          action.payload.riskLevel === "High"
            ? upsertPatient(state.highRiskPatients, action.payload)
            : state.highRiskPatients.filter(
                (patient) => patient.id !== action.payload.id
              );

        return {
          ...state,
          loading: false,
          patients: nextPatients,
          highRiskPatients: nextHighRiskPatients,
        };
      })
      .addCase(addPatient.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(getAllPatients.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(getAllPatients.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        patients: sortPatientsByUpdatedAt(action.payload),
      }))
      .addCase(getAllPatients.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(getPatient.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(getPatient.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        selectedPatient: action.payload,
      }))
      .addCase(getPatient.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(getHighRiskPatients.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(getHighRiskPatients.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        highRiskPatients: sortPatientsByUpdatedAt(action.payload),
      }))
      .addCase(getHighRiskPatients.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }));
  },
});

export const { clearSelectedPatient } = doctorSlice.actions;

export default doctorSlice.reducer;
