(function (root) {
  'use strict';
  // IEC 60062 resistor color code. Digits: black 0 ... white 9. Multiplier = 10^digit, gold 0.1, silver 0.01.
  var DIGIT = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];
  var MULT_EXTRA = { gold: -1, silver: -2 };
  var TOL = { brown: 1, red: 2, green: 0.5, blue: 0.25, violet: 0.1, grey: 0.05, gold: 5, silver: 10, none: 20 };
  var HEX = { black: '#111', brown: '#7a4a21', red: '#d62d20', orange: '#f28c28', yellow: '#f2d024', green: '#2e9e4f', blue: '#2a64d6', violet: '#8a4fd1', grey: '#9a9a9a', white: '#f4f4f4', gold: '#d4a73a', silver: '#c0c0c0', none: 'transparent' };
  function expOf(c) { var d = DIGIT.indexOf(c); return d >= 0 ? d : MULT_EXTRA[c]; }
  // bands: array of color names, 4 (2 digits, mult, tol), 5 (3 digits, mult, tol) or 3 (2 digits, mult; 20%).
  function decode(bands) {
    var n = bands.length; if (n < 3 || n > 5) return null;
    var nd = n === 5 ? 3 : 2, v = 0, i;
    for (i = 0; i < nd; i++) { var d = DIGIT.indexOf(bands[i]); if (d < 0) return null; v = v * 10 + d; }
    var e = expOf(bands[nd]); if (e == null) return null;
    var tol = n === 3 ? 20 : TOL[bands[nd + 1]]; if (tol == null || (n > 3 && bands[nd + 1] === 'none')) return null;
    var ohms = Math.round(v * Math.pow(10, e) * 1e6) / 1e6;
    return { ohms: ohms, tol: tol, min: ohms * (1 - tol / 100), max: ohms * (1 + tol / 100) };
  }
  // Encode a value. digits = 2 or 3. Returns the band names or null if it cannot be coded exactly.
  function encode(ohms, digits, tolColor) {
    if (!(ohms > 0)) return null;
    var e = Math.floor(Math.log10(ohms + 1e-12)) - (digits - 1), sig = Math.round(ohms / Math.pow(10, e));
    if (sig >= Math.pow(10, digits)) { sig = Math.round(sig / 10); e += 1; }
    if (Math.abs(sig * Math.pow(10, e) - ohms) > ohms * 1e-9) return null;
    if (e < -2 || e > 9) return null;
    var ds = String(sig), out = [], i; if (ds.length < digits) return null;
    for (i = 0; i < digits; i++) out.push(DIGIT[+ds[i]]);
    out.push(e >= 0 ? DIGIT[e] : e === -1 ? 'gold' : 'silver'); out.push(tolColor || 'gold');
    return out;
  }
  function fmt(o) {
    var u = [[1e9, 'GΩ'], [1e6, 'MΩ'], [1e3, 'kΩ'], [1, 'Ω']], k;
    for (k = 0; k < u.length; k++) if (o >= u[k][0] * 0.9999999) { var v = Math.round(o / u[k][0] * 1e6) / 1e6; return v + ' ' + u[k][1]; }
    return (Math.round(o * 1e6) / 1e6) + ' Ω';
  }
  // Parse "4.7k", "2k26", "10 kohm", "330", "1M"
  function parse(s) {
    var t = String(s).trim().toLowerCase().replace(/[ωΩ]|ohms?/g, '').replace(/\s+/g, '');
    var m = t.match(/^(\d+)([rkm])(\d+)$/); if (m) { var mult = { r: 1, k: 1e3, m: 1e6 }[m[2]]; return parseFloat(m[1] + '.' + m[3]) * mult; }
    m = t.match(/^(\d*\.?\d+)([kmg]?)$/); if (!m) return null; return parseFloat(m[1]) * ({ '': 1, k: 1e3, m: 1e6, g: 1e9 }[m[2]]);
  }
  var api = { DIGIT: DIGIT, TOL: TOL, HEX: HEX, decode: decode, encode: encode, fmt: fmt, parse: parse };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Band = api;
})(typeof window !== 'undefined' ? window : this);
