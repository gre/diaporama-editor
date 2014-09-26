var GlslTransition = require("glsl-transition");
var GlslTransitions = require("glsl-transitions");
var dragdrop = require("./dragdrop");
var url = require("url").parse(window.location.href, true);

var saveSlideshowServerUrl = process.env.SERVER;

if (url.query.viewer) {
  // HERE is the viewer code
}
else {
  // Here is the editor code
  console.log(dragdrop());
}


