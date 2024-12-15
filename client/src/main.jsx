
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import { persistor, store } from './redux/store/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>

      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </PersistGate>
  </Provider>,
)
