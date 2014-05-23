var gulp = require("gulp");
var extract = require("./index");

gulp.task("extract", function() {
  gulp
    .src("./example/*.html")
    .pipe(extract())
    .pipe(gulp.dest("./dest"));
});

gulp.task("default", ["extract"]);
