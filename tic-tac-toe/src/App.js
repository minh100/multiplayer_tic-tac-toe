import React from 'react';
import { Board } from './Components/Board.js';
import './App.css';

import {SocketContext , socket}  from "./socket.js";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    </SocketContext.Provider>

  );
}

export default App;
