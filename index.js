var cheerio = require("cheerio");
var through2 = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;

const PLUGIN_NAME = "gulp-extract-text";

function gulpExtractText(opt) {
  var attr, dest;

  opt = opt || {};
  attr = opt.attr || "data-et-tag";
  dest = (opt.dest) ? opt.dest : [];
  dest = (dest instanceof Array) ? dest : [dest];

  function transform(file, encode, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit("error", new gutil.PluginError("gulp-diff", "Streaming not supported"));
      return callback();
    }

    var content = file.contents.toString();
    var $ = cheerio.load(content);

    //
    //  table
    //
    var table = {};

    //
    //  extract values by tags
    //
    $("*")
      .filter(function () {
        return !!$(this).attr(attr);
      })
      .map(function () {
        var tag = $(this).attr(attr);
        var text = $(this).text();

        table[tag] = text;
      }).get();

    return callback();
  }

  function flush(callback) {
    callback();
  }

  var th2 = through2.obj(transform, flush);

  return th2;
}

module.exports = gulpExtractText;
