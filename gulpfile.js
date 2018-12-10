var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('built'));
});

gulp.task('start', (cb) => {
    nodemon({
        script: 'built/server.js',
        watch: ["built/**/*.js"],
        ext: "js"
    }).on('restart', () => {
        gulp.src('server.js')
            .pipe(notify('AAAAAA'));
    });
})
