import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './components/redux/store.js'
import 'animate.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
         <App />
    </Provider>  
  </StrictMode>,
)
