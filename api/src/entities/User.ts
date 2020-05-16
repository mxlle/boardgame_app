import { generateId } from '@shared/functions';

export interface IUser {
    id: string;
    name: string;
    color?: string;
}

class User implements IUser {

    public id: string;
    public name: string;
    public color: string;

    constructor(nameOrUser: string | IUser, color?: string, id?: string) {
        if (typeof nameOrUser === 'string') {
            this.name = nameOrUser;
            this.color = color || '';
            this.id = id || '';
        } else {
            this.name = nameOrUser.name;
            this.color = nameOrUser.color || '';
            this.id = nameOrUser.id;
        }

        if (!this.id) this.id = generateId();
    }
}

export default User;
