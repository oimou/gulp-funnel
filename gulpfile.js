var gulp = require("gulp");
var funnel = require("./index");
var mustache = require("mustache");

gulp.task("funnel", function() {
  gulp
    .src("./example/*.html")
    .pipe(funnel({
      attr: "data-et-tag",
      transform: function (template, param) {
        return mustache.render(template.toString(), param);
      },
      template: "template/*.html",
      dest: "dest"
    }))
    .pipe(gulp.dest("dest"));
});

gulp.task("default", ["funnel"]);
