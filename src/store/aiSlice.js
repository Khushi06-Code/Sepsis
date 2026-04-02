import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const AI_API_URL = "https://ai-api-mhaw.onrender.com/predict";

const parseNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const parseBloodPressure = (bloodPressure = "") => {
  const [systolic = 0, diastolic = 0] = String(bloodPressure).split("/");

  return {
    systolic: parseNumber(systolic),
    diastolic: parseNumber(diastolic),
  };
};

const normalizePredictionValue = (value) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return value ?? null;
  }

  const normalizedValue =
    parsedValue >= 0 && parsedValue <= 1 ? parsedValue * 100 : parsedValue;

  return Number(normalizedValue.toFixed(2));
};

const normalizeRiskLevel = (riskLevel, prediction) => {
  if (typeof riskLevel === "string" && riskLevel.trim()) {
    const normalized = riskLevel.trim().toLowerCase();

    if (normalized === "high") {
      return "High";
    }

    if (normalized === "medium") {
      return "Medium";
    }

    if (normalized === "low" || normalized === "safe") {
      return "Low";
    }

    return riskLevel.trim();
  }

  const numericPrediction = Number(prediction);

  if (!Number.isFinite(numericPrediction)) {
    return "Unknown";
  }

  if (numericPrediction >= 70) {
    return "High";
  }

  if (numericPrediction >= 40) {
    return "Medium";
  }

  return "Low";
};

const extractErrorMessage = async (response) => {
  try {
    const data = await response.json();

    return (
      data?.message ||
      data?.error ||
      data?.detail ||
      `Prediction request failed with status ${response.status}`
    );
  } catch {
    return `Prediction request failed with status ${response.status}`;
  }
};

export const getPrediction = createAsyncThunk(
  "ai/getPrediction",
  async (vitals, { rejectWithValue }) => {
    try {
      const { systolic, diastolic } = parseBloodPressure(vitals?.bloodPressure);
      const payload = {
        hr_mean: parseNumber(vitals?.heartRate),
        temp_celsius_mean: parseNumber(vitals?.temperature),
        spo2_mean: parseNumber(vitals?.oxygen),
        sbp_mean: systolic,
        dbp_mean: diastolic,
        respiratory_rate_mean: parseNumber(vitals?.respiratoryRate),
        wbc: parseNumber(vitals?.wbc),
        glucose: parseNumber(vitals?.glucose),
      };
      const response = await fetch(AI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return rejectWithValue(await extractErrorMessage(response));
      }

      const data = await response.json();
      const prediction = normalizePredictionValue(
        data?.prediction ??
          data?.risk_score ??
          data?.riskScore ??
          data?.probability ??
          data?.score
      );
      const riskLevel = normalizeRiskLevel(
        data?.riskLevel ?? data?.risk_level ?? data?.classification,
        prediction
      );

      if (prediction === null || prediction === undefined || prediction === "") {
        return rejectWithValue("Prediction value missing from AI response");
      }

      return {
        prediction,
        riskLevel,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Prediction failed");
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  result: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearPredictionState: () => ({
      ...initialState,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrediction.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(getPrediction.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        result: action.payload,
      }))
      .addCase(getPrediction.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload || "Prediction failed",
      }));
  },
});

export const { clearPredictionState } = aiSlice.actions;

export default aiSlice.reducer;
