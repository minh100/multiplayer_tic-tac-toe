import React, { useState, useEffect, useContext } from 'react';
import { Square } from './Square.js';
import '../Css/all.css'

import { SocketContext } from '../socket.js';

export const Board = () => {

    const [square, setSquare] = useState(Array(9).fill(''));    // array representing the game
    const [currentTurn, setCurrentTurn] = useState("X");        // current turn 
    const [status, setStatus] = useState(`Current Move: ${currentTurn}`);   // status of the game
    const winner = calculateWinner(square);                     // winner of the game

    // what the current player's piece is 
    // used to make players take turns
    const [playerTurn, setPlayerTurn] = useState("");           

    const socket = useContext(SocketContext);   // socket instance to connect to server

    // rerender when we get a emit from the server
    useEffect(() => {
        socket.on("squareClicked", (data) => {  // update other clients when square is clicked
            setCurrentTurn(data.currentTurn);
            if (data.isTie) {
                setStatus(data.currentTurn);
            } else {
                setStatus("Current Move: " + data.currentTurn);
            }
            const squareCopy = [...square];
            if (squareCopy[data.index] || winner) return;
            squareCopy[data.index] = currentTurn;
            setSquare(squareCopy);
        });

        socket.on("resetClicked", (data) => {   // update other clients to reset
            setCurrentTurn(data.currentTurn);
            setSquare(data.square);
            setStatus(data.status);
            setPlayerTurn("");
        })

        // limits the calling of this socket
        // essentially removes the lag
        return () => {
            socket.off("squareClicked");
            socket.off("resetClicked");
        }
    }, [square, currentTurn, socket, winner])
    
    
    // function that controls what happen when a player clicks on a square
    // @params i index of square
    let handleClick = (i) => {
        // console.log(firstTurn + " " + player.id);
        // console.log(player.turn + " <-turn  current->" + currentTurn);
        if(playerTurn !== currentTurn && playerTurn !== '') return; // allows turn based gameplay and no player taking turns consecutive
        let changeTurn = "";
        const squareCopy = [...square];
        if (squareCopy[i] || winner) return;    // handles clicking in an already clicked square or when game is over
        squareCopy[i] = currentTurn;
        setSquare(squareCopy);

        if (checkIfTie(squareCopy)) {
            changeTurn = "It's a tie";
            setStatus("It's a tie");
        }
        else if (currentTurn === "X") {
            setCurrentTurn("0");
            changeTurn = "0";
            setStatus("Current Move: 0");
        }
        else if (currentTurn === "0") {
            setCurrentTurn("X");
            changeTurn = "X";
            setStatus("Current Move: X");
        }

        setPlayerTurn(currentTurn)

        let data = {
            square: square, // array
            index: i,       // index of array
            playerTurn: playerTurn, // what a player's piece is
            currentTurn: changeTurn,    // current turn for the game
            isTie: checkIfTie(squareCopy)   // tie
        }

        // send emit to server so that server can update to every other client
        socket.emit("squareClicked", data);
    }

    // updates client to represent what happens when square is clicked
    let renderSquare = (i) => {
        return (
            <Square value={square[i]} onClick={() => handleClick(i)} />
        )
    }

    // function that controls what happen when reset button is clicked
    // restarts the game to original state
    let resetButton = () => {
        let resetSquare = Array(9).fill('');
        setSquare(resetSquare);
        setCurrentTurn("X");
        setStatus("Current Move: X");
        setPlayerTurn("");

        let data = {
            square: resetSquare,
            currentTurn: "X",
            status: "Current Move: X",
        }

        socket.emit("resetClicked", data);
    } 

    return (
        <div>
            <div className="status">{winner ? `Winner: ${winner}` : `${status}`}</div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
            <div><button onClick={resetButton}>Reset</button></div>
        </div>
    )
}

// function to determine if there is a winner
// @params square array
// returns the winning letter
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// function to determine if there is a tie
// @param square array
// returns true if there is a tie else false
function checkIfTie(squares) { 
    for(let square of squares) {
        if(square === "") {
            return false;
        }
    }
    return true;
}
