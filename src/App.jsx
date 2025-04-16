import "./App.css";
import { useDispatch } from "react-redux";
import Game from "./components/Game";
import { handleUp ,handleDown,handleLeft,handleRight} from "./store/slices/game.slice";

function App() {
  const dispatch = useDispatch();
  const handleActon = (e) => {
    if (e.key == "ArrowUp") {
      dispatch(handleUp());
    }
    if (e.key == "ArrowDown") {
      dispatch(handleDown());
    }
    if (e.key == "ArrowLeft") {
      dispatch(handleLeft());
    }
    if (e.key == "ArrowRight") {
      dispatch(handleRight());
    }
  };
  document.addEventListener("keydown", (e) => {
    handleActon(e);
  });
  return (
    <>
      <div className="parent">
        <Game />
      </div>
    </>
  );
}

export default App;
