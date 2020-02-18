require('./globals');
/**
 * Auth class, used for login.
 * @private
 */
class Auth {
  constructor(obj) {
    if (!(this instanceof Auth)) return new Auth(obj);
    if(!obj) return this;
    else if(typeof obj === 'string') throw new Error(obj);
    this.aid = obj.aid || undefined; 
    this.lang = obj.lang;
    this.region = obj.region;
    this.gameVersion = obj.gameVersion;
    this.dataCenters = obj.dataCenters;
    this.ipRegion = obj.ipRegion;
    this.token_type = obj.token_type;
    this.expires_in = obj.expires_in;
    this.access_token = obj.access_token;
    this.refresh_token = obj.refresh_token;
  }
  /**
   * Login with email & password. Return new Auth.
   * @param {Client} client 
   * @param {String} email 
   * @param {String} password 
   * @param {String} captcha 
   * @param {String} hwid 
   */
  async login(client, email, password, captcha, hwid) {
      try {
        let md5pass = crypto.createHash('md5').update(password).digest('hex');
        let body = new LoginRequest(email, md5pass, hwid, captcha);
        let url = `https://${LAUNCHER_ENDPOINT}/launcher/login?launcherVersion=${LAUNCHER_VERSION}&branch=live`;
        let res = await this.post_json(client, url, body);
        // Check if response was successful
        res = new LoginResponse(res);

        res = handle_auth_error(res);
        // Return Auth
        if(!res.data) return res;
        return new Auth(res.data);
      } catch (err) {
        console.log('[LOGIN]',new Date(), err.message);
        return err;
      }
  }

  async exchange_access_token(client, access_token, hwid) {
    try {
      let response = await client({
        url: `https://${PROD_ENDPOINT}/launcher/game/start?launcherVersion=${LAUNCHER_VERSION}&branch=live`,
        type: 'post',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `BSG Launcher ${LAUNCHER_VERSION}`,
          'Host': PROD_ENDPOINT,
          'Authorization': access_token,
        },
        gzip: true,
        encoding: null,
        json: { 
          version: {
            major: GAME_VERSION,
            game: "live",
            backend: "6"
          },
          hwCode: hwid
        },
        transform: body => JSON.parse(pako.inflate(body, { to: 'string' }))
      });
      // Check if response was successful
      if(!response.data) console.log(response);
      response = new ExchangeResponse(response);
      // Custom errors
      response = handle_auth_error(response);
      // Return session
      return new Session(response.data);
    } catch (err) {
      console.log('[E_A_T]',new Date(), err.message);
    }
  }

  async activate_hardware(client, email, code, hwid) {
    let url = `https://${LAUNCHER_ENDPOINT}/launcher/hardwareCode/activate?launcherVersion=${LAUNCHER_VERSION}`;
    let body =  {
      email: email,
      hwCode: hwid,
      activateCode: code,
    };
    let res = await this.post_json(client, url, body);
    if(!res.err || res.err == 0) return;
    else if(res.err != 0) throw new Error(res.errmsg);
  }

  async post_json(client, url, req_body) {
    try {
      let response = await client({
        url: url,
        type: 'post',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `BSG Launcher ${LAUNCHER_VERSION}`
        },
        gzip: true,
        encoding: null,
        json: req_body,
        transform: body => JSON.parse(pako.inflate(body, { to: 'string' }))
      });
      return response;
    } catch (err) {
      console.log('[POST_JSON]', new Date(), err.message);
    }
  }

}

//======================

function handle_auth_error(obj) {
  if(!isNaN(obj.err) && !obj.err == 0) {
    switch(obj.err) {
      //case 0: return obj;
      case 201: return 'Not Authorized';
      case 207: return 'Missing parameters';
      case 209: return 'TwoFactorRequired';
      case 211: return 'BadTwoFactorCode';
      case 214: return 'CaptchaRequired';
      default: return `Unknown API Error: ${obj.err}`;
    }
    
  } else return (obj);
}

/**
 * @private
 */
class LoginRequest {
  constructor(email, pass, hwCode, captcha) {
    this.email = email;
    this.pass = pass;
    this.hwCode = hwCode;
    this.captcha = null; // NOT IN USE ATM
  }
  toJSON() {
    return Object.getOwnPropertyNames(this).reduce((a, b) => {
      a[b] = this[b];
      return a;
    }, {});
  }
}

/**
 * @private
 */
class LoginResponse {
  /**
   * Response from exchange token request
   * @param {Object} obj response object
   * @param {Error} obj.error response error
   * @param {Object} obj.data response data 
   */
  constructor({err, data}) {
    this.err = err;
    this.data = data;
  }
  toJSON() {
    return Object.getOwnPropertyNames(this).reduce((a, b) => {
      a[b] = this[b];
      return a;
    }, {});
  }
}

class SecurityLoginRequest {
  constructor(email, hwCode, activate_code) {
    this.email = email;
    this.hwCode = hwCode;
    this.activate_code = activate_code;
  }
}

class ExchangeRequest {
  constructor(version, hwCode) {
    this.version = version;
    this.hwCode = hwCode;
  }
}

class ExchangeVersion {
  constructor(major, game, backend) {
    this.major = major;
    this.game = game;
    this.backend = backend;
  }
}
/**
 * @private
 */
class ExchangeResponse {
  /**
   * Response from exchange token request
   * @param {Object} obj response object
   * @param {Error} obj.error response error
   * @param {Object} obj.data response data 
   */
  constructor({error, data}) {
    this.error = error;
    this.data = new Session(data);
  }
  toJSON() {
    return Object.getOwnPropertyNames(this).reduce((a, b) => {
      a[b] = this[b];
      return a;
    }, {});
  }
}
/**
 * @private
 */
class Session {
  /**
   * Authenticated user session.
   * @param {Object} obj
   * @param {Boolean} obj.queued is the person queued
   * @param {String} obj.session session id 
   */
  constructor({queued, session}) {
    this.queued = queued;
    this.session = session;
  }
  toJSON() {
    return Object.getOwnPropertyNames(this).reduce((a, b) => {
      a[b] = this[b];
      return a;
    }, {});
  }
}

module.exports = Auth;