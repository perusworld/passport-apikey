"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var APIKeySource;
(function (APIKeySource) {
    APIKeySource["HEADER"] = "header";
    APIKeySource["REQUEST"] = "request";
})(APIKeySource = exports.APIKeySource || (exports.APIKeySource = {}));
class APIKeyStrategyConfig {
    constructor() {
        this.enabled = "true" === process.env.API_KEY_ENABLED || false;
        this.keySource = process.env.API_KEY_SOURCE || APIKeySource.HEADER;
        this.keyName = process.env.API_KEY_NAME || "defauktApiKeyName";
        this.keyValue = process.env.API_KEY_VALUE || "defaultApiKeyValue";
    }
}
exports.APIKeyStrategyConfig = APIKeyStrategyConfig;
class APIKeyStrategy {
    constructor(cfg) {
        this.cfg = cfg;
    }
    authenticate(callback, req, options) {
        throw new Error("Override and implement");
    }
}
exports.APIKeyStrategy = APIKeyStrategy;
class SimpleAPIKeyStrategy extends APIKeyStrategy {
    constructor(cfg = new APIKeyStrategyConfig()) {
        super(cfg);
    }
    authenticate(callback, req, options) {
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
        }
        else {
            callback.fail();
        }
    }
}
exports.SimpleAPIKeyStrategy = SimpleAPIKeyStrategy;
/**
 * Proxy caller: Temporary fix due to the presence of "this" in the authenticate method below
 */
class APIKeyStrategyProvider {
    static getInstance(cfg = new APIKeyStrategyConfig(), stgDef = SimpleAPIKeyStrategy) {
        let stg = new stgDef(cfg);
        let ret = {
            name: "apikey",
            authenticate(req, options) {
                stg.authenticate(this, req, options);
            }
        };
        return ret;
    }
}
exports.APIKeyStrategyProvider = APIKeyStrategyProvider;
//# sourceMappingURL=index.js.map