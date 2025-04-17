import { createSlice } from "@reduxjs/toolkit";

const getInitialData = () => {
  let ran = [];
  while (ran.length != 4) {
    let r = Math.floor(Math.random() * 4);
    if (!ran.includes(r)) {
      ran.push(r);
    }
  }
  let data = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      if (ran[0] == i && ran[1] == j) {
        let inp = Math.random() <= 0.9 ? 2 : 4;
        row.push(inp);
      } else if (ran[2] == i && ran[3] == j) {
        let inp = Math.random() <= 0.9 ? 2 : 4;
        row.push(inp);
      } else {
        row.push(0);
      }
    }
    data.push(row);
  }
  return data;
};
const initials = {
  data: getInitialData(),
  score: 0,
  highestScore: +localStorage.getItem("highScore"),
}

//handle move right
const moveRight = (data) => {
  let points = 0;
  const newRight = data.reduce((acc, val, i) => {
    if (val !== 0) {
      acc.push(val);
    } else {
      acc.unshift(0);
    }
    return acc;
  }, []);

  console.log(newRight);
  for (let j = 4; j > 0; j--) {
    if (j !== 0) {
      if (newRight[j] == newRight[j - 1]) {
        console.log(newRight);
        newRight[j] = newRight[j] * 2;
        points += newRight[j];
        newRight.splice(j - 1, 1);
        newRight.unshift(0);
      }
    }
  }
  return { newRow: newRight, points };
};

//handle move left
const moveLeft = (data) => {
  let points = 0;
  const newLeft = data.reverse().reduce((acc, val, i) => {
    if (val !== 0) {
      acc.unshift(val);
    } else {
      acc.push(0);
    }
    return acc;
  }, []);

  newLeft.map((val, valIndex) => {
    if (valIndex !== 3) {
      if (newLeft[valIndex] == newLeft[valIndex + 1]) {
        newLeft[valIndex] = newLeft[valIndex] * 2;
        points += newLeft[valIndex];
        newLeft.splice([valIndex + 1], 1);
        newLeft.push(0);
      }
    }
  });
  return { newRow: newLeft, points };
};

//after moving find the empty places and add value at the random position
const findEmptyAndFill = (all) => {
  const emptyPlaces = all.reduce(
    (emp, row, i) => {
      row.forEach((val) => {
        emp.count++;
        if (val == 0) {
          emp.empty.push(emp.count);
        }
      });
      return emp;
    },
    { count: 0, empty: [] }
  );
  const randomPosition =
    emptyPlaces.empty[Math.floor(Math.random() * emptyPlaces.empty.length)];
  const result = all.reduce((count, row, rowIndex) => {
    row.forEach((val, colIndex) => {
      count = +count + 1;
      if (count == randomPosition) {
        all[rowIndex][colIndex] = Math.random() <= 0.9 ? 2 : 4;
      }
    });
    return count;
  }, 0);
};

//handle move to right,left,up and down
const move = (data, score, side) => {
  if (side == "right") {
    const gameResult = [];
    data.map((row) => {
      const { newRow, points } = moveRight(row);
      gameResult.push(newRow);
      score = score + points;
    });
    return { gameResult, score };
  }
  if (side == "left") {
    const gameResult = [];
    data.map((row) => {
      const { newRow, points } = moveLeft(row);
      gameResult.push(newRow);
      score = score + points;
    });
    return { gameResult, score };
  }
  if (side == "down") {
    const colToRow = data.reduce((acc, row, i) => {
      const result = [data[0][i], data[1][i], data[2][i], data[3][i]];
      acc.push(result);
      return acc;
    }, []);
    const moved = [];
    colToRow.map((row) => {
      const { newRow, points } = moveRight(row);
      moved.push(newRow);
      score = score + points;
    });
    const gameResult = moved.reduce((acc, col, i) => {
      const result = [moved[0][i], moved[1][i], moved[2][i], moved[3][i]];
      acc.push(result);
      return acc;
    }, []);
    return { gameResult, score };
  }
  if (side == "up") {
    const colToRow = data.reduce((acc, row, i) => {
      const result = [data[0][i], data[1][i], data[2][i], data[3][i]];
      acc.push(result);
      return acc;
    }, []);
    const moved = [];
    colToRow.map((row) => {
      const { newRow, points } = moveLeft(row);
      moved.push(newRow);
      score = score + points;
    });
    const gameResult = moved.reduce((acc, col, i) => {
      const result = [moved[0][i], moved[1][i], moved[2][i], moved[3][i]];
      acc.push(result);
      return acc;
    }, []);
    return { gameResult, score };
  }
};

const GameData = createSlice({
  name: "GameData",
  initialState: initials,
  reducers: {
    handleLeft: (state, action) => {
      const { gameResult, score } = move(state.data, state.score, "left");
      const previous = JSON.stringify(state.data);
      state.data = gameResult;
      state.score = score;
      console.log(JSON.stringify(gameResult), previous);
      findEmptyAndFill(state.data);
    },
    handleUp: (state, action) => {
      const { gameResult, score } = move(state.data, state.score, "up");
      state.data = gameResult;
      state.score = score;
      findEmptyAndFill(state.data);
    },
    handleRight: (state, action) => {
      const { gameResult, score } = move(state.data, state.score, "right");
      state.data = gameResult;
      state.score = score;
      findEmptyAndFill(state.data);
    },
    handleDown: (state, action) => {
      const { gameResult, score } = move(state.data, state.score, "down");
      state.data = gameResult;
      state.score = score;
      findEmptyAndFill(state.data);
    },
    handleNewGame: (state, action) => {
      state.data = getInitialData();
      if (state.score > +localStorage.getItem("highScore")) {
        localStorage.setItem("highScore", state.score);
      }
      state.highestScore = localStorage.getItem("highScore");
      state.score = 0;
    },
  },
});

export const { handleDown, handleLeft, handleRight, handleUp, handleNewGame } =
  GameData.actions;

export const selectGameData = (state) => state.GameData;

export default GameData.reducer;
