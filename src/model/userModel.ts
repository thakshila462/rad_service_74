import {Document, model, Schema} from 'mongoose';   

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MANAGER = 'manager'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    roles: UserRole[];
    approved: boolean;
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        enum: Object.values(UserRole),
        default: [UserRole.USER] },
    approved: { type: Boolean, default: true }
}, {
    timestamps: true
});

export const User = model<IUser>('User', userSchema);