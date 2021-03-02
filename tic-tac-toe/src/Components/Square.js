import React from 'react';
import '../Css/all.css'

export const Square = ({value, onClick}) => {
    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    )
};