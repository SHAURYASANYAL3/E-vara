export class Logger {
  private traceId: string;
  private functionName: string;

  constructor(functionName: string, traceId?: string) {
    this.functionName = functionName;
    this.traceId = traceId || crypto.randomUUID();
  }

  private log(
    level: "info" | "warn" | "error",
    message: string,
    data?: Record<string, unknown>,
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      function: this.functionName,
      traceId: this.traceId,
      message,
      ...data,
    };

    console[level](JSON.stringify(logEntry));
  }

  public info(message: string, data?: Record<string, unknown>) {
    this.log("info", message, data);
  }

  public warn(message: string, data?: Record<string, unknown>) {
    this.log("warn", message, data);
  }

  public error(
    message: string,
    error?: Error | unknown,
    data?: Record<string, unknown>,
  ) {
    let errData: Record<string, unknown> = {};
    if (error instanceof Error) {
      errData = {
        errorMessage: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errData = { error: String(error) };
    }
    this.log("error", message, { ...errData, ...data });
  }

  public getTraceId() {
    return this.traceId;
  }
}
