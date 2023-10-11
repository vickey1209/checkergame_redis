import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";

interface joinGameInterface  {
    eventName: string;
    data: {
      userName: string;
    },
  };
export function joinGameValidation(data:joinGameInterface){
    const sinUpDataSchema = Joi.object().keys({
        eventName:Joi.string().valid(EVENT_NAME.JOIN_GAME,EVENT_NAME.SIGN_UP).required(),
        data:Joi.object().keys({
            userName:Joi.string().required()
        })
    })

    const {error , value} = sinUpDataSchema.validate(data);
    if(error){
        logger.error(`request validation error in joinGameValidation : ${error}`)
    }else{
        return value;
    }
}