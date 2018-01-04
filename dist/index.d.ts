/// <reference types="passport" />
/// <reference types="express" />
import { Request } from "express";
import * as passport from "passport";
export declare enum APIKeySource {
    HEADER = "header",
    REQUEST = "request",
}
export declare class APIKeyStrategyConfig {
    enabled: boolean;
    keySource: string;
    keyName: string;
    keyValue: string;
}
export declare class APIKeyStrategy {
    protected cfg: APIKeyStrategyConfig;
    constructor(cfg: APIKeyStrategyConfig);
    authenticate(callback: passport.StrategyCreatedStatic, req: Request, options?: any): any;
}
export declare class SimpleAPIKeyStrategy extends APIKeyStrategy {
    constructor(cfg?: APIKeyStrategyConfig);
    authenticate(callback: passport.StrategyCreatedStatic, req: Request, options?: any): any;
}
/**
 * Proxy caller: Temporary fix due to the presence of "this" in the authenticate method below
 */
export declare class APIKeyStrategyProvider {
    static getInstance<T>(cfg?: APIKeyStrategyConfig, stgDef?: typeof APIKeyStrategy): passport.Strategy;
}
