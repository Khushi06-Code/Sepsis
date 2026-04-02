import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, waitForAuth } from "../Auth/firebase";
import {
  cloneVitals,
  normalizeEmail,
  normalizeRole,
  normalizeUserDocument,
} from "./firestoreUtils";

const buildUserPayload = ({ authUser, name, email, role, existingData = {} }) => ({
  name: name?.trim() || existingData.name || authUser.displayName || "",
  email: normalizeEmail(email || existingData.email || authUser.email || ""),
  role: normalizeRole(role || existingData.role),
  vitals: cloneVitals(existingData.vitals),
  prediction: existingData.prediction ?? null,
  riskLevel: existingData.riskLevel ?? null,
  createdAt: existingData.createdAt || new Date().toISOString(),
});

export const postSignup = createAsyncThunk(
  "auth/postSignup",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const normalizedRole = normalizeRole(role);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );
      const authUser = userCredential.user;

      await updateProfile(authUser, {
        displayName: name?.trim() || "",
      });

      await waitForAuth();

      const userId = auth.currentUser?.uid || authUser.uid;

      if (!userId) {
        throw new Error("Authentication session not ready");
      }

      const payload = buildUserPayload({
        authUser,
        name,
        email: normalizedEmail,
        role: normalizedRole,
      });

      await setDoc(doc(db, "users", userId), payload, { merge: true });

      return normalizeUserDocument(userId, payload);
    } catch (err) {
      return rejectWithValue(err.message || "Signup failed");
    }
  }
);

export const postLogin = createAsyncThunk(
  "auth/postLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );
      const authUser = userCredential.user;
      const userRef = doc(db, "users", authUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        return normalizeUserDocument(authUser.uid, docSnap.data());
      }

      await waitForAuth();

      const fallbackPayload = buildUserPayload({
        authUser,
        name: authUser.displayName || "",
        email: normalizedEmail,
        role: "User",
      });

      await setDoc(userRef, fallbackPayload, { merge: true });

      return normalizeUserDocument(authUser.uid, fallbackPayload);
    } catch (err) {
      let message = "Login failed";

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-login-credentials" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        message = "Invalid email or password";
      }

      return rejectWithValue(message);
    }
  }
);

export const postLogout = createAsyncThunk(
  "auth/postLogout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (err) {
      return rejectWithValue(err.message || "Logout failed");
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession: (state, action) => ({
      ...state,
      user: action.payload,
      isAuthenticated: Boolean(action.payload),
    }),
    clearAuthError: (state) => ({
      ...state,
      error: null,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(postSignup.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(postSignup.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
      }))
      .addCase(postSignup.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(postLogin.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(postLogin.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
      }))
      .addCase(postLogin.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }))
      .addCase(postLogout.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(postLogout.fulfilled, () => ({
        ...initialState,
      }))
      .addCase(postLogout.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }));
  },
});

export const { setAuthSession, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
