export class Logger {
    private static formatMessage(level: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
        return `[${timestamp}] ${level}: ${message}${dataString}`;
    }

    static info(message: string, data?: any) {
        console.log(this.formatMessage('INFO', message, data));
    }

    static error(message: string, error?: any) {
        console.error(this.formatMessage('ERROR', message, error));
    }

    static debug(message: string, data?: any) {
        console.debug(this.formatMessage('DEBUG', message, data));
    }
} 