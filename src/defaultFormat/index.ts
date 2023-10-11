import { v4 as uuidv4 } from "uuid";

const setUser = (userName: string, socketId: string) => {
  return {
    _id: uuidv4(),
    userName: userName,
    socketId: socketId,
  };
};
const setTable = (userData: any,turnId:string) => {
  return {
    _id: uuidv4(),
    activePlayer: 1,
    maxPlayer: 2,
    board: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
    ],
    player: [userData],
    status: "waiting",
    playerScore:[0,0],
    turnId:turnId
  };
};
export { setUser, setTable };
