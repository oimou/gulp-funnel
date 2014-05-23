var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;

const PLUGIN_NAME = "gulp-extract-text";

function gulpExtractText(html) {
  var stream = through.obj(function (file, enc, callback) {
    if (file.isNull()) {
    }

    if (file.isBuffer()) {
    }

    if (file.isStream()) {
    }

    this.push(file);
    return callback();
  });

  return stream;
}

module.exports = gulpExtractText;
