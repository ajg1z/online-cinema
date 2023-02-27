import { ObjectId } from 'mongodb';
import { UserModel } from 'src/user/user.model';

export class OutputUser {
  _id: ObjectId;
  email: string;
  isAdmin: boolean;

  constructor(user: UserModel) {
    this._id = user._id;
    this.email = user.email;
    this.isAdmin = user.isAdmin;
  }
}
