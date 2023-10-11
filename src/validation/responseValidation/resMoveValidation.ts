import  Joi  from 'joi';
import { EVENT_NAME } from '../../constants';
import logger from '../../logger';

interface moveDataInterface  {
    eventName: string;
    data: {
      board: number[][];
      score: number[];
    },
  };

export function  ResMoveValidation(data:moveDataInterface){
    const  schema  = Joi.object().keys({
        eventName: Joi.string().valid(EVENT_NAME.MOVE).required(),
        data:Joi.object().keys({
          board:Joi.array().required(),
          score:Joi.array().required()
        }),
    })

    const {error,value} = schema.validate(data);
    if(error){
        logger.error(`response validation error in : ${error}`);
    }else{
        return value;
    }
}