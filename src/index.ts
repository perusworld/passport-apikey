import { Request } from "express";
import * as passport from "passport";

export enum APIKeySource {
  HEADER = "header",
  REQUEST = "request"
}

export class APIKeyStrategyConfig {
  enabled = "true" === process.env.API_KEY_ENABLED || false;
  keySource = process.env.API_KEY_SOURCE || APIKeySource.HEADER;
  keyName = process.env.API_KEY_NAME || "defauktApiKeyName";
  keyValue = process.env.API_KEY_VALUE || "defaultApiKeyValue";
}

export class APIKeyStrategy { // implements passport.Strategy

  protected cfg: APIKeyStrategyConfig;

  constructor(cfg: APIKeyStrategyConfig) {
    this.cfg = cfg;
  }
  public authenticate(callback: passport.StrategyCreatedStatic, req: Request, options?: any): any {
    throw new Error("Override and implement");
  }
}

export class SimpleAPIKeyStrategy extends APIKeyStrategy {

  constructor(cfg: APIKeyStrategyConfig = new APIKeyStrategyConfig()) {
    super(cfg);
  }

  public authenticate(callback: passport.StrategyCreatedStatic, req: Request, options?: any): any {
    let value = null;
    let keyName = this.cfg.keyName;
    switch (this.cfg.keySource) {
      case APIKeySource.REQUEST:
        value = req.body[keyName] || req.query[keyName];
        break;
      default:
        value = req.header(keyName);
        break;
    }
    if (!this.cfg.enabled || value && this.cfg.keyValue === value) {
      callback.success({ apiKey: value }, {});
    } else {
      callback.fail();
    }
  }

}

/**
 * Proxy caller: Temporary fix due to the presence of "this" in the authenticate method below
 */
export class APIKeyStrategyProvider {
  public static getInstance<T>(cfg: APIKeyStrategyConfig = new APIKeyStrategyConfig(), stgDef: typeof APIKeyStrategy = SimpleAPIKeyStrategy): passport.Strategy {
    let stg = new stgDef(cfg);
    let ret = {
      name: "apikey",
      authenticate(this: passport.StrategyCreated<passport.Strategy>, req: Request, options?: any): any {
        stg.authenticate(this, req, options);
      }
    };
    return ret;
  }
}

