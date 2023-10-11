import Joi from "joi";
import logger from "../../logger";
interface roundTimerInterface {
  eventName: string;
  data: {
    delayTime: number;
  };
}

export function roundTimerValidation(data: roundTimerInterface) {
  const schema = Joi.object().keys({
    eventName: Joi.string().required(),
    data: {
      delayTime: Joi.number().required(),
    },
  });
  const {error,value } = schema.validate(data);
  if(error){
    logger.error(`response validation error in roundTimerValidation : ${error}`);
  }else{
    return value;
  }
}
