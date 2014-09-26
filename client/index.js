var GlslTransition = require("glsl-transition");
var GlslTransitions = require("glsl-transitions");
var Q = require("q");
var $ = require("jquery");
var Qajax = require("qajax");
var dragdrop = require("./dragdrop");
var Viewer = require("./viewer");
var url = require("url").parse(window.location.href, true);

var saveSlideshowServerUrl = process.env.SERVER;

if (url.query.viewer) {
  // HERE is the viewer code
  var id = url.query.viewer;

  Qajax({
    url: saveSlideshowServerUrl + "/json/" + id,
    method: "GET"
  })
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
  // Q(require("../format-example1.json"))
    .then(function (json) {
      var canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.innerHTML = "";
      document.body.style.padding = "0px";
      document.body.style.margin = "0px";
      document.body.style.overflow = "hidden";
      document.body.appendChild(canvas);
      return new Viewer(json, canvas).start();
    })
    .done();
}
else {
  var diaporama = {
    loop: true,
    music: "https://soundcloud.com/gonegirlsoundtrack/sugar-storm",
    timeline: []
  };

  // Here is the editor code
  function onImageUploaded (res) {
    var item = {
      image: res.data.link,
      duration: 3000,
      transitionNext: {
        name: GlslTransitions[Math.floor(Math.random()*GlslTransitions.length)].name,
        duration: 1500
      }
    };
    diaporama.timeline.push(item);
  }
  function onImageError (err) {
    console.log(err);
  }
  dragdrop(onImageUploaded, onImageError);

  $("#create-diaporama").click(function () {
    console.log("CLICKED");
    Qajax({
      url: saveSlideshowServerUrl + "/json",
      method: "POST",
      data: diaporama
    })
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then(function (result) {
        window.location.href = "/?viewer="+result.id;
      });
  });
}


