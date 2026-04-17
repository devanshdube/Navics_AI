import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    features: null,
    enabledFeatures: [],
};

const featureSlice = createSlice({
    name: "features",
    initialState,
    reducers: {
        setFeatures: (state, action) => {
            state.features = action.payload.data;
            state.enabledFeatures = action.payload.enabled_features;
        },
        clearFeatures: (state) => {
            state.features = null;
            state.enabledFeatures = [];
        },
    },
});

export const { setFeatures, clearFeatures } = featureSlice.actions;
export default featureSlice.reducer;