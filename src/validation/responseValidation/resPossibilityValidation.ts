import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";
interface possibilityInterface {
  eventName: string;
  data: {
    row: number[] | null;
    col: number[] | null;
    killRow: number[] | null;
    killCol: number[] | null;
    kill: number[] | null;
    userId: string;
  };
}

export function resPossibilityValidation(data: possibilityInterface) {
  const schema = Joi.object().keys({
    eventName: Joi.string().valid(EVENT_NAME.CHECK_POSSIBILITY).required(),
    data: {
      row: Joi.array(),
      col: Joi.array(),
      killRow: Joi.array(),
      killCol: Joi.array(),
      kill: Joi.array(),
      userId: Joi.string().required(),
    },
  });
  const {error,value} = schema.validate(data);
  if(error){
    logger.error(`response validation error in resPossibilityValidation : ${error}`);
  }else{
    return value;
  }
}
