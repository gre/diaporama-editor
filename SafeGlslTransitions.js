var GlslTransitions = require("glsl-transitions");

function filterWithoutCustomSampler2D (transitions, mapFilter) {
  return transitions.filter(function (t) {
    for (var k in t.uniforms)
      if (typeof t.uniforms[k] === "string")
        return false;
    return true;
  });
}

module.exports = filterWithoutCustomSampler2D(GlslTransitions);
