import projection from "./index";
import {atan, exp, halfPi, log, pi, tan} from "../math";

export function mercator(lambda, phi) {
  return [lambda, log(tan((halfPi + phi) / 2))];
}

mercator.invert = function(x, y) {
  return [x, 2 * atan(exp(y)) - halfPi];
};

export default function() {
  return mercatorProjection(mercator);
}

export function mercatorProjection(project) {
  var m = projection(project),
      scale = m.scale,
      translate = m.translate,
      clipExtent = m.clipExtent,
      clipAuto;

  m.scale = function(_) {
    return arguments.length ? (scale(_), clipAuto && m.clipExtent(null), m) : scale();
  };

  m.translate = function(_) {
    return arguments.length ? (translate(_), clipAuto && m.clipExtent(null), m) : translate();
  };

  m.clipExtent = function(_) {
    if (!arguments.length) return clipAuto ? null : clipExtent();
    if (clipAuto = _ == null) {
      var k = pi * scale(), t = translate();
      _ = [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]];
    }
    clipExtent(_);
    return m;
  };

  return m.clipExtent(null);
}
