"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialStateObj = {
  postData: [],
};

export const postSlice = createSlice({
  name: "post",
  initialState: initialStateObj,
  reducers: {
    handlePostData: (state, { payload }) => {
      state.postData = payload;
    }
  },
});

export const { handlePostData } = postSlice.actions;

// it behave like connector (old redux)
export const postSelector = (state) => state.post;

export default postSlice.reducer;
// export { mobileReducer };
