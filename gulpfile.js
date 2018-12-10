const gulp = require('gulp');
const ts = require('gulp-typescript');
const notify = require('gulp-notify');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('built'));
});

gulp.task('start', () => {
    nodemon({script: 'built/server.js', watch: ['built/**/*.js'], ext: 'js'})
        .on('restart', () => { gulp.src('server.js').pipe(notify('AAAAAA')); });
});

gulp.task('test', () => {
    return gulp.src('test/**/*.spec.ts')
        .pipe(mocha({reporter: 'nyan', require: ['ts-node/register']}));
});
