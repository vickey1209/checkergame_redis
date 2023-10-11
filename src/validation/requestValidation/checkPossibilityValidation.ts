import Joi from "joi";
import { PossibilityInterface } from "../../interface/otherInterface";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";

export function checkPossibilityValidation(data: PossibilityInterface) {
  const possibilitySchema = Joi.object().keys({
    eventName: Joi.string().valid(EVENT_NAME.CHECK_POSSIBILITY).required(),
    data: Joi.object().keys({
      index: Joi.number().required(),
      userId: Joi.string().required(),
      color: Joi.number().required(),
    }),
  });

  const {error , value } = possibilitySchema.validate(data);
  if(error){
    logger.error( `request validation error in checkPossibilityValidation : ${error}`);
  }else{
    return value;
  }
}
