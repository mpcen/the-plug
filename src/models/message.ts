import mongoose from "mongoose";

export enum FileType {
    file = "file",
    image = "image",
}

export type FileAttachment = {
    type: FileType.file;
    file_id: string;
};

export type ImageAttachment = {
    type: FileType.image;
    url: string;
};

export interface MessageDoc extends mongoose.Document {
    id: string;
    created_at: number;
    name: string;
    text: string;
    user_id: string;
    attachments: (FileAttachment | ImageAttachment)[];
    avatar_url: string;
    group_id: string;
    sender_id: string;
    sender_type: string;
    source_guid: string;
    system: boolean;
}

const messageSchema = new mongoose.Schema<MessageDoc>({
    id: String,
    created_at: Number,
    name: String,
    text: String,
    user_id: String,
    attachments: [
        {
            type: String,
            url: String,
            file_id: String,
        },
    ],
    avatar_url: String,
    group_id: String,
    sender_type: String,
    source_guid: String,
    system: Boolean,
});

const Message = mongoose.model<MessageDoc>("Message", messageSchema);

export { Message };
