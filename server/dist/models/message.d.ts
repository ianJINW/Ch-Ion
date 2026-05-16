import { Schema } from "mongoose";
declare const Message: import("mongoose").Model<{
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    msg: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export default Message;
//# sourceMappingURL=message.d.ts.map