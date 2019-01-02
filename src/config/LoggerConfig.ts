import {
  LoggerFactoryOptions,
  LogGroupRule,
  LogLevel,
  LoggerFactory,
  LFService
} from "typescript-logging";

const options = new LoggerFactoryOptions();
options.addLogGroupRule(
  new LogGroupRule(new RegExp("database.+"), LogLevel.Info)
);
options.addLogGroupRule(
  new LogGroupRule(new RegExp("request.+"), LogLevel.Info)
);

export const factory: LoggerFactory = LFService.createNamedLoggerFactory(
  "logger1",
  options
);
