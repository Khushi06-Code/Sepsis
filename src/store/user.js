import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, waitForAuth } from "../Auth/firebase";
import {
  cloneVitals,
  normalizeEmail,
  normalizeRole,
  normalizeUserDocument,
} from "./firestoreUtils";

const buildUserPayload = ({ authUser, existingData = {}, updatedData = {} }) => {
  const normalizedExisting = normalizeUserDocument(authUser.uid, existingData);
  const nextName =
    typeof updatedData.name === "string" && updatedData.name.trim()
      ? updatedData.name.trim()
      : normalizedExisting.name || authUser.displayName || "";
  const nextEmail = normalizeEmail(
    updatedData.email || normalizedExisting.email || authUser.email || ""
  );

  return {
    name: nextName,
    email: nextEmail,
    age: updatedData.age ?? normalizedExisting.age ?? null,
    gender: updatedData.gender ?? normalizedExisting.gender ?? "Male",
    role: normalizeRole(updatedData.role || existingData.role || normalizedExisting.role),
    vitals: cloneVitals(updatedData.vitals ?? normalizedExisting.vitals),
    prediction: updatedData.prediction ?? normalizedExisting.prediction ?? null,
    riskLevel: updatedData.riskLevel ?? normalizedExisting.riskLevel ?? null,
    createdAt: normalizedExisting.createdAt || new Date().toISOString(),
  };
};

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const requestedUserId =
        typeof payload === "string" ? payload : payload?.userId;
      const authUser = auth.currentUser || (await waitForAuth());
      const targetUserId = requestedUserId || auth.currentUser?.uid || authUser?.uid;

      if (!targetUserId) {
        throw new Error("User session not loaded");
      }

      const docRef = doc(db, "users", targetUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return normalizeUserDocument(docSnap.id, docSnap.data());
      }

      const resolvedAuthUser = auth.currentUser || authUser;

      if (!resolvedAuthUser || resolvedAuthUser.uid !== targetUserId) {
        return rejectWithValue("User not found");
      }

      const fallbackPayload = buildUserPayload({
        authUser: resolvedAuthUser,
      });

      await setDoc(docRef, fallbackPayload, { merge: true });

      return normalizeUserDocument(targetUserId, fallbackPayload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch user data");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ updatedData }, { rejectWithValue }) => {
    try {
      const authUser = await waitForAuth();
      const targetUserId = auth.currentUser?.uid;

      if (!targetUserId) {
        throw new Error("User session not loaded");
      }

      const docRef = doc(db, "users", targetUserId);
      const existingSnap = await getDoc(docRef);
      const existingData = existingSnap.exists() ? existingSnap.data() : {};
      const payload = buildUserPayload({
        authUser,
        existingData,
        updatedData: updatedData || {},
      });

      await setDoc(docRef, payload, { merge: true });

      return normalizeUserDocument(targetUserId, payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update user profile");
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: () => ({
      ...initialState,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(getUserData.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        profile: action.payload,
      }))
      .addCase(getUserData.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(updateUserProfile.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(updateUserProfile.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        profile: action.payload,
      }))
      .addCase(updateUserProfile.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }));
  },
});

export const { clearUser } = userSlice.actions;

export const selectUser = (state) => state.user.profile;
export const selectUserRole = (state) => state.user.profile?.role;
export const selectUserLoading = (state) => state.user.loading;

export default userSlice.reducer;
