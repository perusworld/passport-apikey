import { APIKeyStrategyProvider, APIKeyStrategyConfig } from "../src/index";

describe("check instance", () => {

    it("should say return name", () => {
        let impl = APIKeyStrategyProvider.getInstance();
        expect(impl.name).toEqual("apikey");
    });

    it("should return with defaults", () => {
        let cfg = new APIKeyStrategyConfig();
        expect(cfg.enabled).toEqual(false);
    });

});