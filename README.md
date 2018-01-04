# Passport-APIKey Typescript Module #

[![bitHound Overall Score](https://www.bithound.io/github/perusworld/passport-apikey/badges/score.svg)](https://www.bithound.io/github/perusworld/passport-apikey)
[![bitHound Dependencies](https://www.bithound.io/github/perusworld/passport-apikey/badges/dependencies.svg)](https://www.bithound.io/github/perusworld/passport-apikey/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/perusworld/passport-apikey/badges/code.svg)](https://www.bithound.io/github/perusworld/passport-apikey)

Integrate API Key based authentication in your nodejs application using this [Passport](http://passportjs.org/) strategy.

## Install ##
```bash
npm install github:perusworld/passport-apikey --save
```

## Usage ##

Register strategy with default values using 
```javascript
    passport.use(APIKeyStrategyProvider.getInstance());
```

Register for handling the authentication during each request using 
```javascript
    router.use(passport.authenticate('apikey', { session: false }));
```

### Usage Configuration ### 

The default api key strategy using a single api key for all requests from all users. The values for which could either be loaded using code 

```javascript
passport.use(APIKeyStrategyProvider.getInstance({ enabled: true, keyName: 'yourKeyName', keySource: APIKeySource.HEADER, keyValue: 'yourKeyValue' }));
```

or via environment variables
```bash
export API_KEY_ENABLED="true"
export API_KEY_SOURCE="header"
export API_KEY_NAME="yourKeyName"
export API_KEY_VALUE="yourKeyValue"
```

The default values are
```bash
API_KEY_ENABLED="true"
API_KEY_SOURCE="header"
API_KEY_NAME="yourKeyName"
API_KEY_VALUE="yourKeyValue"
```

#### From Header/Query/Form ####
The *API_KEY_SOURCE* determines if the api key is read from the header or query/body
```javascript
API_KEY_SOURCE="header" //read from header
API_KEY_SOURCE="request" //read from body or query in that order
````
### Override Strategy Impl ###
You can override the default api key strategy that uses a single key for all requests by adding your own implementation class as below

```typescript
export class YourAPIKeyStrategy extends APIKeyStrategy {

  constructor(cfg: APIKeyStrategyConfig = new APIKeyStrategyConfig()) {
    super(cfg);
  }

  public authenticate(callback: passport.StrategyCreatedStatic, req: Request, options?: any): any {
    if (/* your implemenation to check api key */) {
      callback.success({ apiKey: value }, {});
    } else {
      callback.fail();
    }
  }

}
```

Once you have done that, you can pass this during config as below
```javascript
passport.use(APIKeyStrategyProvider.getInstance({ enabled: true, keyName: 'yourKeyName', keySource: APIKeySource.HEADER, keyValue: 'yourKeyValue' },YourAPIKeyStrategy));
```
