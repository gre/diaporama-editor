var Q = require("q");
var Qimage = require("qimage");
var Qajax = require("qajax");
var GlslTransition = require("glsl-transition");
var GlslTransitions = require("glsl-transitions");

function extend (obj) {
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (source.hasOwnProperty(prop)) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
};

var GLSL_IDENTITY_FROM = "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D from, to;\nuniform float progress;\nuniform vec2 resolution;\nvoid main() {vec2 p = gl_FragCoord.xy / resolution.xy;gl_FragColor = texture2D(from, p);}";

function Viewer (json, canvas) {
  this.data = json;
  this.cursor = 0;
  this.canvas = canvas;
  this.T = GlslTransition(this.canvas);
  this.identity = this.T(GLSL_IDENTITY_FROM);
  this.images = {};
  json.timeline.forEach(function (item) {
    var url = item.image;
    this.images[url] = Qimage.anonymously(url);
  }, this);
  this.transitions = {};
  json.timeline.forEach(function (item) {
    var name = item.transitionNext && item.transitionNext.name;
    if (name && !(name in this.transitions) && (name in GlslTransitions)) {
      this.transitions[name] = this.T(GlslTransitions[name]);
    }
  }, this);
  this._preloadAudio();
  console.log(json);
}

Viewer.prototype = {
  start: function () {
    var self = this;
    var data = this.data;
    var item = data.timeline[0];
    this._startAudio();
    return this.images[item.image]
      .then(function (from) {
        return self.identity({ from: from, to: from }, 100)
      })
      .delay(item.duration)
      .then(function () {
        return self.next();
      });
  },
  end: function () {
    this._stopAudio();
  },
  next: function () {
    var self = this;
    var data = this.data;
    var from = this.cursor;
    var endReached = from+1 === data.timeline.length;
    if (endReached && !data.loop) return this.end();
    var to = endReached ? 0 : from + 1;
    this.cursor = to;

    var itemDuration = data.timeline[from].duration;
    var transitionNext = data.timeline[from].transitionNext;
    var transition = transitionNext && transitionNext.name ?
      this.transitions[transitionNext.name] :
      this.identity;
    console.log(transitionNext, transition);
    var transitionDuration = transitionNext && transitionNext.duration || 0;
    var transitionUniforms = transitionNext && transitionNext.uniforms || {};

    console.log(from, "->", to);

    return Q.all([
      this.images[data.timeline[from].image],
      this.images[data.timeline[to].image]
    ])
    .spread(function (fromImage, toImage) {
      return transition(extend({ from: fromImage, to: toImage }, transitionUniforms), transitionDuration);
    })
    .delay(itemDuration)
    .then(function () {
      return self.next();
    });
  },
  _preloadAudio: function () {

  },
  _startAudio: function () {

  },
  _stopAudio: function () {

  }
};

module.exports = Viewer;
