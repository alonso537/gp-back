import { CustomError } from "../errors/CustomError";


export class ProjectEntity {
    constructor(
        public id: string,
        public name: string,
        public desc: string,
        public owner: string,
        public members?: string[],
        public tasks?: number,
        public status?: string,
        public limitDate?: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromObject(object: {[key:string]:any}) {
        const { id, _id, name, desc, owner, members, tasks, status, limitDate, created_at, updated_at,  } = object;

        if(!id && !_id) {
            throw CustomError.badRequest('Missing id');
        }

        if(!name) {
            throw CustomError.badRequest('Missing name');
        }

        if(!desc) {
            throw CustomError.badRequest('Missing desc');
        }

        if(!owner) {
            throw CustomError.badRequest('Missing owner');
        }

        if(!limitDate) {
            throw CustomError.badRequest('Missing limitDate');
        }

        return new ProjectEntity(
            id || _id,
            name,
            desc,
            owner,
            members,
            tasks,
            status,
            limitDate,
            created_at,
            updated_at
        )

        
    }
}