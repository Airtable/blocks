var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var listSelectorsPlugin = require('list-selectors').plugin;

gulp.task('default', function() {
    return gulp.src(['../helpers.less'])
        .pipe(less())
        .pipe(postcss([
            listSelectorsPlugin({include: 'classes'}, function(selectors) {
                selectors.classes = selectors.classes.map(function(className) {
                    return className.slice(1); // remove leading period
                });
                fs.writeFile('./classes.json', JSON.stringify(selectors, null, '\t'), function(err) {
                    if (err) throw err;
                    console.log('Successfully built classes.json');
                });
            }),
        ]));
});
