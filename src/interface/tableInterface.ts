import User from "./userInterface";

interface Table{
    _id:any;
    activePlayer:number;
    maxPlayer:number;
    board:number[][];
    player:User[];
    status:string;
    playerScore:number[];
    turnId:string;
}

export default Table;