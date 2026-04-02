export const toIsoString = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return date ? date.toISOString() : null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return null;
};

export const normalizeEmail = (email = "") => email.trim().toLowerCase();
export const normalizeRole = (role = "User") => (role === "Doctor" ? "Doctor" : "User");
export const cloneVitals = (vitals = {}) => ({ ...(vitals || {}) });

export const normalizeUserDocument = (id, data = {}) => ({
  id,
  name: data.name || "",
  email: normalizeEmail(data.email || ""),
  age: data.age ?? null,
  gender: data.gender || "Not Set",
  role: normalizeRole(data.role),
  vitals: cloneVitals(data.vitals),
  prediction: data.prediction ?? null,
  riskLevel: data.riskLevel ?? null,
  createdAt: toIsoString(data.createdAt),
});

export const normalizePatientDocument = (id, data = {}) => ({
  id,
  patientName: data.patientName || "",
  email: normalizeEmail(data.email || ""),
  age: data.age ?? "",
  gender: data.gender || "",
  vitals: cloneVitals(data.vitals),
  prediction: data.prediction ?? null,
  riskLevel: data.riskLevel ?? null,
  linkedUserId: data.linkedUserId ?? null,
  createdAt: toIsoString(data.createdAt),
  updatedAt: toIsoString(data.updatedAt),
});
