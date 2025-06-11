import { createSlice } from '@reduxjs/toolkit';
const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    pages: [],
    selectedPage: null,
    user: null,
    postsByPage: {},
  },
  reducers: {
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    clearPages: (state) => {
      state.pages = [];
    },
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    clearSelectedPage: (state) => {
      state.selectedPage = null;
    },
    setPostsByPage: (state, action) => {
      const { pageName, posts } = action.payload;
      console.log(`Setting posts for page: ${pageName}`, posts);
      state.postsByPage[pageName] = posts;
    },
    clearPostsByPage: (state) => {
      state.postsByPage = {};
    },
    setUser: (state, action) => {   
          // <-- Add this
      state.user = action.payload;
     
    },
    clearUser: (state) => {              // <-- Add this (optional)
      state.user = {};
    },
  }
});

export const {
  setPages,
  clearPages,
  setSelectedPage,
  clearSelectedPage,
  setPostsByPage,
  clearPostsByPage,
  setUser,         // <-- Export this
  clearUser,       // <-- Export this
} = pagesSlice.actions;

export default pagesSlice.reducer;