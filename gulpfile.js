/* eslint-disable */

const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const abspath = require('gulp-absolute-path');
// const sourcemaps = require('gulp-sourcemaps');
// const include = require('gulp-include');
// const notify = require('gulp-notify');

const tsProject = ts.createProject('tsconfig.json');
require('ts-node').register(tsProject);

process.env.TS_NODE_PROJECT = './tsconfig.json';
process.env.TS_CONFIG_PATHS = true;

// gulp.task('build', function() {
//     return tsProject.src()
//         .pipe(abspath({rootDir: './src'}))
//         .pipe(tsProject()).js
//         .pipe(gulp.dest('built'));
// });

gulp.task('start', () => {
    return nodemon(
            {
                script: 'src/server.ts',
                watch: ['src/**/*.ts'],
                ext: 'ts',
                exec: 'ts-node -r tsconfig-paths/register',
            });
        // .on('restart', () => { gulp.src('built/server.js'); });
});

gulp.task('prod', () => {
    return nodemon(
            {
                script: 'src/server.ts',
                watch: ['src/**/*.ts'],
                ext: 'ts',
                exec: 'ts-node -r tsconfig-paths/register',
                env: {
                    // setup for production build
                    "PORT": 8080
                }
            });
        // .on('restart', () => { gulp.src('built/server.js'); });
});

gulp.task('test', () => {
    return gulp.src('test/**/*.spec.ts', {base: '.'})
        .pipe(tsProject())
        .pipe(gulp.dest('built'))
        .pipe(mocha({reporter: 'nyan', require: ['ts-node/register']}));
});

// gulp.task('default', ['build', 'test']);
