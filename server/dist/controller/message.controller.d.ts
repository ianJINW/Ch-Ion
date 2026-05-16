import { type Request, type Response } from "express";
import { Types } from "mongoose";
export declare const createMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMessages: (roomId: string) => Promise<(import("mongoose").Document<unknown, {}, {
    msg: string;
    roomId: string;
    senderId: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    msg: string;
    roomId: string;
    senderId: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
})[]>;
//# sourceMappingURL=message.controller.d.ts.map