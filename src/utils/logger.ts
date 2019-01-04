import { Logger } from "ts-log-debug";

const logger = new Logger("HouseCareLogger");
logger.appenders
  .set("std-log", {
    type: "stdout",
    levels: ["debug", "info", "trace"]
  })
  .set("error-log", {
    type: "stderr",
    levels: ["fatal", "error", "warn"]
  })
  .set("file-log", {
    type: "file",
    filename: process.env.LOG_FILE,
    maxLogSize: 10485760, // 10MB
    backups: 3,
    compress: true
  });

export default logger;
