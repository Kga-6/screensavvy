import React , {useContext,createContext,useState,useEffect} from 'react';

// styles
import './App.css';

// Components
import { Header} from './components';

// Containers
import { Home } from './containers';

// contexts
import {AppProvider} from "./contexts/AppContext"

function App() {
  return (
    <>
      <AppProvider>
        {/* <Header></Header> */}
        <Home></Home>
      </AppProvider>
    </>
  );
}

export default App;
