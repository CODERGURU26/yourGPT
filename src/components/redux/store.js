import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './slice/search-slice'

const store = configureStore({
    reducer:{
        search:searchReducer
    }
})

export default store