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
      var canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.innerHTML = "";
      document.body.style.padding = "0px";
      document.body.style.margin = "0px";
      document.body.appendChild(canvas);
      return new Viewer(json, canvas).start();
    })
    .done();
}
else {
  // Here is the editor code
  console.log(dragdrop());
}


