import * as bunyan from 'bunyan';

export class Logger {
    private static _logger: bunyan;

    public static init (options: bunyan.LoggerOptions) {
        this._logger = bunyan.createLogger(options);
        return this._logger;
    }

    public static getLogger () {
        return this._logger;
    }
}
