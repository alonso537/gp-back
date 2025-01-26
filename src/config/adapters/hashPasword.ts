import bcrypt from 'bcryptjs';

export const bcryptAdapter = {
    hash: (password: string) => {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    },
    compare: (password: string, hash: string) => {
        const isvalid = bcrypt.compareSync(password, hash);

        return isvalid;
    }
}