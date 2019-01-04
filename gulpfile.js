/* eslint-disable */

const gulp = require("gulp");
const ts = require("gulp-typescript");
const nodemon = require("gulp-nodemon");
const mocha = require("gulp-mocha");
const abspath = require("gulp-absolute-path");

const tsProject = ts.createProject("tsconfig.json");
require("ts-node").register(tsProject);

process.env.TS_NODE_PROJECT = "./tsconfig.json";
process.env.TS_CONFIG_PATHS = true;

gulp.task("start", () => {
  return nodemon({
    script: "index.ts",
    watch: ["src/**/*.ts"],
    ext: "ts",
    exec: "ts-node -r tsconfig-paths/register"
  });
});

gulp.task("prod", () => {
  return nodemon({
    script: "index.ts",
    watch: ["src/**/*.ts"],
    ext: "ts",
    exec: "ts-node -r tsconfig-paths/register",
    env: {
      // setup for production build
      // load file?
      PORT: 8080,
      TOKEN_SECRET: "",
      MONGODB_HOST: "",
      MONGODB_PORT: "",
      MONGODB_DATABASE: "",
      MONGODB_USERNAME: "",
      MONGODB_PASSWORD: "",
      MONGODB_OPTION: "",
      MONGODB_URI: ""
    }
  });
});

gulp.task("test", () => {
  process.env.NODE_ENV = "test";
  return gulp
    .src("test/**/*.spec.ts", { base: "." })
    .pipe(tsProject())
    .pipe(gulp.dest("built"))
    .pipe(
      mocha({
        // list of reporter: https://mochajs.org/#reporters
        reporter: "spec",
        require: ["ts-node/register"]
      })
    );
});
