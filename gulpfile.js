const gulp = require('gulp');
const ts = require("gulp-typescript");
const del = require('del');

gulp.task('clean', async function () {
    del(['dist'])
});

gulp.task('compile', function () {
    const tsProject = ts.createProject("tsconfig.json");
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('copy-html', function () {
    return gulp.src(['src/**/*.{html,png,css}'])
        .pipe(gulp.dest('dist'))
});

gulp.task('copy-vue', function () {
    return gulp.src(['src/**/vue.js'])
        .pipe(gulp.dest('dist'))
});

gulp.task('default', gulp.series('clean', 'compile', 'copy-html', 'copy-vue'));
