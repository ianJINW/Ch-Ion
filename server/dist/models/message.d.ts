import { Schema } from "mongoose";
declare const Message: import("mongoose").Model<{
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    msg: string;
    roomId: string;
    senderId: import("mongoose").Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export default Message;
//# sourceMappingURL=message.d.ts.map