require("mocha");
var expect = require("expect.js");
var gutil = require("gulp-util");
var funnel = require("../");
var fs = require("fs");
var mustache = require("mustache");

describe("gulp-funnel", function () {
  it("should create files from template", function (done) {
    var stream = funnel({
      attr: "data-et-tag",
      transform: function (template, param) {
        return mustache.render(template.toString(), param);
      },
      template: "template/*.html",
      dest: "dest"
    });

    var fakeSrc = new gutil.File({
      base: "test/fixtures",
      cwd: "test/",
      path: "test/fixtures/src.html",
      contents: fs.readFileSync("test/fixtures/src.html")
    });

    var fakeTemplate = new gutil.File({
      base: "test/fixtures",
      cwd: "test/",
      path: "test/fixtures/template.html",
      contents: fs.readFileSync("test/fixtures/template.html")
    });

    stream.once("data", function (newFile) {
      expect(newFile).to.be.ok();
      expect(newFile.contents).to.be.ok();
      expect(String(newFile.contents)).to.equal(
        fs.readFileSync("test/expected/dest.html", "utf-8")
      );
      done();
    });

    stream.write(fakeSrc);
    stream.end();
  });
});
