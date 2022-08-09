import { Context, Schema } from 'koishi';
export declare const name = "potato-core";
export interface Config {
    logGroupNumber: string;
}
export declare const schema: Schema<{
    logGroupNumber?: string;
} & import("cosmokit").Dict<any, string>, {
    logGroupNumber: string;
} & import("cosmokit").Dict<any, string>>;
declare module 'koishi' {
    interface User {
        potatoCount: number;
    }
}
export declare function apply(ctx: Context, config: Config): void;
