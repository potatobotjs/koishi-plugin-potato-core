import { Context, Schema } from 'koishi';
export declare const name = "potato-core";
export interface Config {
    logGroupNumber: string;
    potatoRandomIntMax: number;
}
export declare const schema: Schema<{
    logGroupNumber?: string;
    potatoRandomIntMax?: number;
} & import("cosmokit").Dict<any, string>, {
    logGroupNumber: string;
    potatoRandomIntMax: number;
} & import("cosmokit").Dict<any, string>>;
declare module 'koishi' {
    interface User {
        potatoCount: number;
        potatoEaten: number;
        potatoProtect: boolean;
        potatoBuyLastCall: number;
        potatoEatLastCall: number;
    }
}
export declare function apply(ctx: Context, config: Config): void;
