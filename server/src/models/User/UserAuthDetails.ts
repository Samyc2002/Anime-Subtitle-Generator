import { Document, model, Model, Schema } from 'mongoose';

interface IUserDetail {
  name: string;
  avatar: string;
  work_mail: string;
  phone: number;
  created_at: string;
  updated_at: string;
}
export type UserDetailDocument = IUserDetail & Document;

const UserDetailSchema: Schema<UserDetailDocument> = new Schema({
  name: { type: String, required: false, default: '' },
  avatar: { type: String, required: false },
  work_mail: { type: String, required: false, default: '' },
  phone: { type: Number, required: false, default: 0 },
  created_at: {
    type: String,
    required: false,
    default: new Date().toISOString()
  },
  updated_at: {
    type: String,
    required: true,
    default: new Date().toISOString()
  }
});

const UserDetail: Model<UserDetailDocument> = model(
  'UserDetail',
  UserDetailSchema
);
export default UserDetail;
