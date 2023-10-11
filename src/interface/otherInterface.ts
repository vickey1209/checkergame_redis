

interface PossibilityInterface {
  eventName: string,
  data: {
    index: number;
    userId: string;
    color: number;
  },
}

interface MoveInterface {
  eventName: string;
  data: {
    id: string;
    moveId: string;
    color: number;
    userId: string;
    kill: number[]
  },
}

interface GameDelayInterface {
  jobId:string;
  attempts:number;
  delayTime:number;
  userId:string;
}
interface SignUpInterface{
  eventName:string,
  data:{
    userId:string |null;
    tableId:string|null;
    userName:string|null;
  }
}

export { PossibilityInterface, MoveInterface ,GameDelayInterface,SignUpInterface}