import React, { useEffect, useState } from "react";
import Square from "./components/Square";
import Loader from "./components/Loader";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const Squares = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {
  const [mode, setMode] = useState(false);
  const [gameState, setGameState] = useState(Squares);
  const [current, setCurrent] = useState("circle");
  const [fS, setFS] = useState(null);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [play, setPlay] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [rival, setRival] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);

  const checkWinner = () => {
    for (let row = 0; row < gameState.length; row++) {
      if (
        gameState[row][0] &&
        gameState[row][0] === gameState[row][1] &&
        gameState[row][1] === gameState[row][2]
      ) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0];
      }
    }
    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] &&
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArrayState([col, 3 + col, 6 + col]);
        return gameState[0][col];
      }
    }
    if (
      gameState[0][0] &&
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2]
    ) {
      setFinishedArrayState([0, 4, 8]);
      return gameState[0][0];
    }
    if (
      gameState[0][2] &&
      gameState[0][2] === gameState[1][1] &&
      gameState[1][1] === gameState[2][0]
    ) {
      setFinishedArrayState([2, 4, 6]);
      return gameState[0][2];
    }
    const isDraw = gameState
      .flat()
      .every((e) => e === "circle" || e === "cross");
    return isDraw ? "draw" : null;
  };

  const playOnline = async () => {
    const result = await playerNameFunc();
    if (!result.isConfirmed) return;
    const username = result.value.trim();
    setPlayerName(username);
    const newSocket = io("http://localhost:3000", { autoConnect: true });
    setSocket(newSocket);

    newSocket.on("connect", function () {
      setPlay(true);
    });

    newSocket.on("RivalNotFound", () => {
      setRival(false);
    });

    newSocket.on("RivalFound", (data) => {
      setRival(data.rival);
      setPlayingAs(data.playingAs);
    });

    newSocket.emit("request_to_play", {
      playerName: username,
    });

    newSocket.on("RivalDisconnected", () => {
      setFS("RivalDisconnected");
    });

    newSocket.on("playerMovedFromServer", (data) => {
      const { id, current } = data.state;
      data.state;
      setGameState((prevState) => {
        const newState = [...prevState];
        const rI = Math.floor(id / 3);
        const cI = id % 3;
        newState[rI][cI] = data.state.current;
        return newState;
      });
      data.state;
      setCurrent(current === "circle" ? "cross" : "circle");
    });
  };

  useEffect(() => {
    if (socket) {
      const winner = checkWinner();
      if (winner === "circle" || winner === "cross") {
        setFS(winner === playingAs ? playerName : rival);
      } else if (winner) {
        setFS(winner);
      }
    }
  }, [gameState]);

  const playerNameFunc = async () => {
    return await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "No value found!";
      },
    });
  };

  if (!play) {
    return (
      <div className={mode ? "dark" : "light"}>
        <div className="w-screen h-screen py-10 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100">
          <button
            onClick={playOnline}
            className="w-fit h-fit py-4 px-4 md:px-8 lg:px-16 font-bold md:font-extrabold text-lg md:text-xl lg:text-3xl rounded md:rounded-lg lg:rounded-xl text-zinc-200 dark:text-zinc-800 bg-stone-700 dark:bg-stone-300 hover:scale-x-110 transition duration-150"
          >
            Play Online
          </button>
        </div>
      </div>
    );
  }

  if (play && !rival) {
    return (
      <div className={mode ? "dark" : "light"}>
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100">
          <Loader />
          <div className="select-none text-center text-lg md:text-2xl lg:text-4xl">
            Waiting for opponent
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={mode ? "dark" : "light"}>
      <div className="w-screen h-screen py-10 flex flex-col items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-100">
        <div className="select-none flex justify-between items-center w-1/2 md:px-24">
          <div
            className={`h-fit w-14 md:w-20 lg:w-32 py-2 rounded-tr-3xl rounded-bl-3xl text-sm md:text-lg lg:text-xl font-bold text-zinc-50 dark:text-zinc-800 text-center ${
              playingAs === current && fS === null
                ? playingAs === "circle"
                  ? "bg-fuchsia-800 dark:bg-fuchsia-200"
                  : "bg-cyan-800 dark:bg-cyan-200"
                : "bg-zinc-500 dark:bg-zinc-200"
            }`}
          >
            {playerName}
          </div>
          <div
            className={`h-fit w-14 md:w-20 lg:w-32 py-2 rounded-br-3xl rounded-tl-3xl text-sm md:text-lg lg:text-xl font-bold text-zinc-50 dark:text-zinc-800 text-center ${
              playingAs !== current && fS === null
                ? playingAs === "cross"
                  ? "bg-fuchsia-800 dark:bg-fuchsia-200"
                  : "bg-cyan-800 dark:bg-cyan-200"
                : "bg-zinc-500 dark:bg-zinc-200"
            }`}
          >
            {rival}
          </div>
        </div>
        <h1 className="select-none font-extrabold md:text-lg lg:text-xl px-4 py-2 rounded-xl ring-2 w-fit mt-20 ring-gray-800 dark:ring-gray-300 bg-zinc-600 dark:bg-zinc-200 text-zinc-50 dark:text-zinc-800">
          Cross Toes : Competitive
        </h1>
        <div
          className={
            `grid grid-flow-col grid-cols-3 grid-rows-3 gap-3 mt-10 ` +
            (fS ? "select-none" : "")
          }
        >
          {gameState.map((arr, rI) =>
            arr.map((e, cI) => (
              <Square
                socket={socket}
                gameState={gameState}
                key={3 * rI + cI}
                id={3 * rI + cI}
                setGameState={setGameState}
                current={current}
                setCurrent={setCurrent}
                fS={fS}
                finishedArrayState={finishedArrayState}
                currentElement={e}
                playingAs={playingAs}
              />
            ))
          )}
        </div>
        {fS ? (
          <>
            {fS !== "draw" && fS !== "RivalDisconnected" ? (
              <div className="flex flex-col justify-center items-center w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 h-auto text-zinc-800 dark:text-zinc-100 p-6 sm:p-8 md:p-10 rounded-lg transition-all duration-300">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
                  {fS}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold bg-yellow-300 dark:bg-yellow-500 px-6 py-2 rounded-full ring-2 ring-yellow-500 dark:ring-yellow-300">
                  won the Game!
                </p>

                {fS === playerName ? (
                  <p className="text-amber-500 dark:text-amber-300 font-bold text-xl mt-4">
                    Wo HOooo!! We won!
                  </p>
                ) : (
                  <p className="text-gray-700 dark:text-gray-500 font-bold text-xl mt-4">
                    Hard Luck! We'll get'em next time!
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 h-auto text-zinc-800 dark:text-zinc-100 p-6 sm:p-8 md:p-10 rounded-lg transition-all duration-300">
                <p className="text-lg sm:text-xl md:text-2xl font-semibold bg-yellow-300 dark:bg-yellow-500 px-6 py-2 rounded-full ring-2 ring-yellow-500 dark:ring-yellow-300 animate-pulse">
                  {fS === "draw" ? "Match is a draw" : "Rival Disconnected"}
                </p>
              </div>
            )}
          </>
        ) : (
          rival && (
            <h3 className="my-20 text-2xl text-center">
              Your opponent is{" "}
              <span className="font-semibold italic text-cyan-200">
                {rival}
              </span>
            </h3>
          )
        )}
      </div>
    </div>
  );
};

export default App;
