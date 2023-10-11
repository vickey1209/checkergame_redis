import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";

export function ResJoinGameValidation(data: any) {
  const schema = Joi.object().keys({
    eventName: Joi.string().valid(EVENT_NAME.JOIN_GAME).required(),
    data: Joi.object().keys({
      userData: Joi.array().required(),
      tableId: Joi.string().required(),
      board: Joi.array().required(),
      score: Joi.array().required(),
      status: Joi.string().required(),
    }),
  });
  const {error, value} = schema.validate(data);
  if(error){
    logger.error(`response validation error in ResJoinGameValidation : ${error}`);
  }else{
    return value;
  }
}
