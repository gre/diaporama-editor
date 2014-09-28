var GlslTransition = require("glsl-transition");
var GlslTransitions = require("./SafeGlslTransitions");
var Q = require("q");
var $ = require("jquery");
var Qajax = require("qajax");
var dragdrop = require("./dragdrop");
var Viewer = require("diaporama");
var url = require("url").parse(window.location.href, true);

var saveSlideshowServerUrl = process.env.SERVER;

if (url.query.viewer) {
  // HERE is the viewer code
  var id = url.query.viewer;

  document.body.innerHTML = "";
  Qajax(saveSlideshowServerUrl + "/json/" + id)
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
  // Q(require("../format-example1.json"))
    .then(function (json) {
      var canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.style.padding = "0px";
      document.body.style.margin = "0px";
      document.body.style.overflow = "hidden";
      document.body.appendChild(canvas);
      return new Viewer(json, canvas, {
        soundcloudClientId: process.env.SOUNDCLOUD
      }).start();
    })
    .done();
}
else {

  var $timeline = $("#timeline");

  function renderTimeline (tl) {
    $timeline.empty();
    $timeline.append(tl.map(function (item) {
      return $('<img src="'+item.image+'" />');
    }));
  }

  Q.fcall(function () {

    if (url.query.edit) {
      return Qajax(saveSlideshowServerUrl + "/json/" + url.query.edit)
        .then(Qajax.filterSuccess)
        .then(Qajax.toJSON);
    }
    else {
      return {
        loop: true,
        music: "https://soundcloud.com/gonegirlsoundtrack/sugar-storm",
        timeline: []
      };
    }

  })
  .then(function (diaporama) {

    if (diaporama.id) {
      $("#view-diaporama").attr("href", location.pathname+"?viewer="+diaporama.id);
      $("#create-diaporama").text("Fork");
    }
    else {
      $("#view-diaporama").remove();
    }

    renderTimeline(diaporama.timeline);

    // Here is the editor code
    function onImageUploaded (url) {
      var item = {
        image: url,
        duration: 3000,
        transitionNext: {
          name: GlslTransitions[Math.floor(Math.random()*GlslTransitions.length)].name,
          duration: 1500
        }
      };
      diaporama.timeline.push(item);
      renderTimeline(diaporama.timeline);
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
          window.location.href = location.pathname+"?edit="+result.id;
        });
    });

  })
  .done();

}


