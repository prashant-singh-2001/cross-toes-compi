import React, { useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Square = ({
  id,
  setGameState,
  current,
  setCurrent,
  fS,
  finishedArrayState,
  socket,
  currentElement,
  playingAs,
}) => {
  const [icon, setIcon] = useState(null);

  const clickOnSquare = () => {
    if (!icon && !finishedArrayState.includes(id) && !fS) {
      socket.emit("playerMovedFromClient", { state: { id, current } });
      if (current === "circle") {
        setIcon(<FaRegCircle className="text-xl md:text-4xl lg:text-8xl" />);
        setCurrent("cross");
      } else {
        setIcon(<RxCross2 className="text-xl md:text-4xl lg:text-8xl" />);
        setCurrent("circle");
      }

      setGameState((prevState) => {
        const newState = [...prevState];
        const rI = Math.floor(id / 3);
        const cI = id % 3;
        newState[rI][cI] = current;
        return newState;
      });
    }
  };

  const isFinishedSquare = finishedArrayState.includes(id);
  return (
    <button
      disabled={playingAs !== current}
      onClick={clickOnSquare}
      className={`w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 flex text-center items-center justify-center rounded md:rounded-lg lg:rounded-2xl   ${
        !icon && !isFinishedSquare && !fS
          ? "cursor-pointer transition duration-200 hover:shadow-lg shadow-zinc-800 dark:shadow-zinc-400 bg-zinc-300 dark:bg-zinc-500"
          : `cursor-not-allowed ${
              isFinishedSquare
                ? fS === "circle"
                  ? "bg-fuchsia-400 dark:bg-fuchsia-700"
                  : "bg-cyan-400 dark:bg-cyan-800"
                : "bg-zinc-300 dark:bg-zinc-500"
            }`
      }`}
    >
      {currentElement === "circle" ? (
        <FaRegCircle className="text-xl md:text-4xl lg:text-8xl" />
      ) : currentElement === "cross" ? (
        <RxCross2 className="text-xl md:text-4xl lg:text-8xl" />
      ) : (
        ""
      )}
    </button>
  );
};

export default Square;
