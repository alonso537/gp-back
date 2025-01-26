import { CustomError } from "../errors/CustomError";


export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public role: string,
        public dateRegister: Date
    ){}

    static fromObject(object: {[key:string]: any}) {
        const { id, _id, name, email, password, role, dateRegister } = object;

        if(!id && !_id) {
            throw CustomError.badRequest('Missing id');
        }

        if(!name) {
            throw CustomError.badRequest('Missing name');
        }

        if(!email) {
            throw CustomError.badRequest('Missing email');
        }

        if(!password) {
            throw CustomError.badRequest('Missing password');
        }

        if(!role) {
            throw CustomError.badRequest('Missing role');
        }

        if(!dateRegister) {
            throw CustomError.badRequest('Missing dateRegister');
        }

        return new UserEntity(
            id || _id,
            name,
            email,
            password,
            role,
            dateRegister
        )
    }
        
}