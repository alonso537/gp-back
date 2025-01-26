import Joi from "joi";

export class Validation {
    public strings = (value: string) => {
        return Joi.string().required().validate(value);
    }

    public numbers = (value: number) => {
        return Joi.number().required().validate(value);
    }

    public emails = (value: string) => {
        return Joi.string().email().required().validate(value);
    }

    public passwords = (value: string) => {
        return Joi.string().min(6).required().validate(value);
    }

    public dates = (value: string) => {
        return Joi.date().required().validate(value);
    }

    public objects = (value: object) => {
        return Joi.object().required().validate(value);
    }

    public arrays = (value: any[]) => {
        return Joi.array().required().validate(value);
    }

    public booleans = (value: boolean) => {
        return Joi.boolean().required().validate(value);
    }

    public enums = (value: string, values: string[]) => {
        return Joi.string().valid(...values).required().validate(value);
    }
}