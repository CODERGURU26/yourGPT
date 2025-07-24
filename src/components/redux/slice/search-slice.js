// src/redux/searchSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  history: JSON.parse(localStorage.getItem('searchHistory')) || []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addToHistory: (state, action) => {
      state.history.unshift(action.payload)
      localStorage.setItem('searchHistory', JSON.stringify(state.history))
    },
    clearHistory: (state) => {
      state.history = []
      localStorage.removeItem('searchHistory')
    }
  }
})

export const { addToHistory, clearHistory } = searchSlice.actions
export default searchSlice.reducer
