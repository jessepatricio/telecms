declare module 'nexmo' {
  interface NexmoOptions {
    apiKey: string;
    apiSecret: string;
  }

  interface SendSmsOptions {
    to: string;
    from: string;
    text: string;
  }

  class Nexmo {
    constructor(options: NexmoOptions);
    message: {
      sendSms: (options: SendSmsOptions, callback: (error: any, response: any) => void) => void;
    };
  }

  export = Nexmo;
}

declare module 'express-handlebars' {
  import { Engine } from 'express-handlebars';
  export = Engine;
}

declare module 'method-override' {
  import { RequestHandler } from 'express';
  function methodOverride(getter?: string | ((req: any, res: any) => string)): RequestHandler;
  export = methodOverride;
}

declare module 'connect-flash' {
  import { RequestHandler } from 'express';
  function flash(): RequestHandler;
  export = flash;
}

declare module 'express-fileupload' {
  import { RequestHandler } from 'express';
  function fileUpload(options?: any): RequestHandler;
  export = fileUpload;
}

declare module 'express-session' {
  import { RequestHandler } from 'express';
  function session(options?: any): RequestHandler;
  export = session;
}

declare module 'passport' {
  import { RequestHandler } from 'express';
  interface PassportStatic {
    initialize(): RequestHandler;
    session(): RequestHandler;
    use(strategy: any): void;
    serializeUser(fn: (user: any, done: (err: any, id?: any) => void) => void): void;
    deserializeUser(fn: (id: any, done: (err: any, user?: any) => void) => void): void;
  }
  const passport: PassportStatic;
  export = passport;
}

declare module 'passport-local' {
  interface StrategyOptions {
    usernameField?: string;
    passwordField?: string;
  }
  
  interface VerifyFunction {
    (username: string, password: string, done: (error: any, user?: any, info?: any) => void): void;
  }
  
  class Strategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
  }
  
  export = Strategy;
}

declare module 'moment' {
  interface Moment {
    format(format?: string): string;
    add(amount: number, unit: string): Moment;
    subtract(amount: number, unit: string): Moment;
    diff(other: Moment, unit?: string): number;
    isBefore(other: Moment): boolean;
    isAfter(other: Moment): boolean;
    isSame(other: Moment, unit?: string): boolean;
    startOf(unit: string): Moment;
    endOf(unit: string): Moment;
    valueOf(): number;
    toDate(): Date;
    toISOString(): string;
  }
  
  function moment(input?: any, format?: string): Moment;
  namespace moment {
    function utc(input?: any, format?: string): Moment;
    function unix(timestamp: number): Moment;
  }
  
  export = moment;
}
