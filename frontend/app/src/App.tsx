import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  useEffect(() => {
    const electron = window.require("electron");
    const ipc = electron.ipcRenderer;
  
    ipc.on("newData", (event : any, data : any) => {
      console.log(data);
    })
    
    ipc.send("readyConnection", true);
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
