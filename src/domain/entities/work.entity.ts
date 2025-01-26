import { CustomError } from "../errors/CustomError";


export class WorkEntity {
    constructor(
        public id: string,
        public title: string,
        public desc: string,
        public project: string,
        public assigningTo: string,
        public status: string,
        public priority: string,
        public limitDate: Date,
        public created_at?: Date,
        public updated_at?: Date
    ){}

    static fromObject(object: {[key:string]:any}) {
        const { id, _id, title, desc, project, assigningTo, status, priority, limitDate, created_at, updated_at,  } = object;

        if(!id && !_id) {
            throw CustomError.badRequest('Missing id');
        }

        if(!title) {
            throw CustomError.badRequest('Missing title');
        }

        if(!desc) {
            throw CustomError.badRequest('Missing desc');
        }

        if(!project) {
            throw CustomError.badRequest('Missing project');
        }

        if(!assigningTo) {
            throw CustomError.badRequest('Missing assigningTo');
        }

        if(!limitDate) {
            throw CustomError.badRequest('Missing limitDate');
        }

        return new WorkEntity(
            id || _id,
            title,
            desc,
            project,
            assigningTo,
            status,
            priority,
            limitDate,
            created_at,
            updated_at
        )
    }
}