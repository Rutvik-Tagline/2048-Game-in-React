import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleNewGame,
  selectGameData,
} from "../store/slices/game.slice";

const Game = () => {
  const { data, score ,highestScore} = useSelector(selectGameData);
  const dispatch=useDispatch()
  return (
    <>
      <div className="score">
        <div className="high-Score">
           <h1>Highest Score : {highestScore}</h1>
        </div>
        <div className="curr-score">
          <h1>Score : {score}</h1>
        </div>
        <div className="action">
           <button className="new-btn" onClick={()=>{dispatch(handleNewGame())}}>Restart</button>
        </div>
      </div>
      <div className="games-box">
        {data.map((row, rowIndex) => {
          return (
            <div className={"row row-" + (+rowIndex + 1)} key={rowIndex}>
              {row.map((col, colIndex) => {
                return (
                  <div
                    className={`col ${col==0?"empty":col<4?"low":col<8?"medium":col<16?"high":"large"} ${
                      "box-" + (+rowIndex + 1) + "." + (+colIndex + 1)
                    }`}
                    key={colIndex}
                  >
                    <h1>{col == 0 ? null : col}</h1>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Game;
