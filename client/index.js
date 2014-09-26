var GlslTransition = require("glsl-transition");
var GlslTransitions = require("glsl-transitions");
var Q = require("q");
var Qajax = require("qajax");
var dragdrop = require("./dragdrop");
var Viewer = require("./viewer");
var url = require("url").parse(window.location.href, true);

var saveSlideshowServerUrl = process.env.SERVER;

if (url.query.viewer) {
  // HERE is the viewer code
  var id = url.query.viewer;
  // replace with Qajax(...)
  Q(require("../format-example1.json"))
    .then(function (json) {
      return new Viewer(json).init();
    })
    .done();
}
else {
  // Here is the editor code
  console.log(dragdrop());
}


