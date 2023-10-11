import  Joi  from 'joi';
import { EVENT_NAME } from '../../constants';
import logger from '../../logger';
interface winDataInterface  {
    eventName: string,
    data: {
      winnerId: string,
    },
  };
export function winValidation(data:winDataInterface){
    const schema = Joi.object().keys({
        eventName: Joi.string().valid(EVENT_NAME.WIN).required(),
        data: Joi.object().keys({
          winnerId: Joi.string().required(),
        }),
    })
    const {error , value} = schema.validate(data);
    if(error){
        logger.error(`response validation error in winValidation : ${error}`);
    }else{
        return value;
    }
}