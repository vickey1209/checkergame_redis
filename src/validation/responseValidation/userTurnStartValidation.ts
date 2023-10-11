import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";

interface userTurnStartInterface {
  eventName: string;
  data: {
    userId: string;
  };
}

export function userTurnStartValidation(data: userTurnStartInterface){
  const schema = Joi.object().keys({
    eventName:Joi.string().valid(EVENT_NAME.USER_TURN_START).required(),
    data: {
      userId: Joi.string().required(),
    },
  });
  const {error , value } = schema.validate(data);
  if(error){
    logger.error(`response validation error in userTurnStartValidation : ${error}`);
  }else{
    return value;
  }
}
