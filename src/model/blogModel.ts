import mongoose, { Schema, model } from "mongoose"
import { Document } from "mongoose"

export interface IBlog extends Document {
    title: string
    content: string 
    author: mongoose.Types.ObjectId
    imageURL?: string
    createdAt?: Date
    updatedAt?: Date
}

const BlogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },             
    author: {
        type:Schema.Types.ObjectId,required: true,
        ref: "user_details"
    },
    imageURL: String
},{
    timestamps: true
})

export const BlogModel = mongoose.model<IBlog>("blogs", BlogSchema)  