var fs = require("fs");
var path = require("path");
var glob = require("glob");
var cheerio = require("cheerio");
var through2 = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;

const PLUGIN_NAME = "gulp-funnel";

function gulpFunnel(opt) {
  var attr, template, userTransform, globOption;

  opt = opt || {};
  attr = opt.attr || "data-et-tag";
  template = opt.template;
  dest = opt.dest;
  userTransform = opt.transform;
  globOption = {};

  if (dest == null) {
    throw new Error("Please specify dest");
  }

  function transform(file, encode, callback) {
    var self = this;

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit("error", new gutil.PluginError(PLUGIN_NAME, "Streaming not supported"));
      return callback();
    }

    var content = file.contents.toString();
    var $ = cheerio.load(content);

    //
    //  param
    //
    var param = {};

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

        param[tag] = text;
      }).get();

    //
    //  generate output from templates
    //  [FIXME] make it asynchronous
    //
    glob(template, globOption, function (err, templateFilePaths) {
      var templateFile;
      var templateFilePath;
      var destFile;
      var destFilePath;

      var base;

      //
      //  fill values into templates
      //
      for (var i = 0, len = templateFilePaths.length; i < len; i++) {
        // template
        templateFilePath = path.join(__dirname, templateFilePaths[i]);
        base = path.basename(templateFilePath);

        templateFile = new gutil.File({
          base: base,
          cwd: __dirname,
          path: templateFilePath,
          contents: fs.readFileSync(templateFilePath)
        });

        // dest
        // [FIXME] modify userTransform to be asynchronous
        destFilePath = path.join(__dirname, dest, base);

        destFile = new gutil.File({
          base: base,
          cwd: __dirname,
          path: destFilePath,
          contents: Buffer( userTransform(templateFile.contents, param) )
        });

        // push
        gutil.log(base);
        self.push(destFile);
      }

      callback();
    });
  }

  function flush(callback) {
    callback();
  }

  var th2 = through2.obj(transform, flush);

  return th2;
}

module.exports = gulpFunnel;
