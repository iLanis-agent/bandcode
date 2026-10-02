var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, t) { n++; if (!(Math.abs(a - b) <= (t == null ? 1e-9 : t))) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
var D = function (s) { return E.decode(s.split(' ')); };
// Wikipedia "Electronic color code" worked example: 2-2-6-1-1 (red red blue brown brown) = 2.26 kOhm, 1%
var a = D('red red blue brown brown'); eq(a.ohms, 2260, '2.26k'); eq(a.tol, 1, '1%'); eq(a.min, 2237.4, 'min', 1e-6); eq(a.max, 2282.6, 'max', 1e-6);
// Standard values everyone knows
eq(D('yellow violet red gold').ohms, 4700, '4.7k'); eq(D('yellow violet red gold').tol, 5, '5%');
eq(D('brown black orange gold').ohms, 10000, '10k'); eq(D('brown black black red brown').ohms, 10000, '10k 5-band'); eq(D('brown black black red brown').tol, 1, '10k 1%');
eq(D('red red brown silver').ohms, 220, '220'); eq(D('red red brown silver').tol, 10, '10%'); eq(D('orange orange brown gold').ohms, 330, '330');
eq(D('brown black gold gold').ohms, 1, '1 ohm via gold'); eq(D('green blue silver gold').ohms, 0.56, '0.56 via silver'); eq(D('brown black green gold').ohms, 1e6, '1M'); eq(D('brown black black violet brown').ohms, 1e9, '1G 5-band');
eq(D('brown black orange').ohms, 10000, '3-band'); eq(D('brown black orange').tol, 20, '3-band 20%');
// tolerance colors
['brown 1', 'red 2', 'green 0.5', 'blue 0.25', 'violet 0.1', 'grey 0.05', 'gold 5', 'silver 10'].forEach(function (t) { var p = t.split(' '); eq(D('brown black red ' + p[0]).tol, +p[1], 'tol ' + p[0]); });
// digit order
var seq = 'black brown red orange yellow green blue violet grey white'.split(' '); is(JSON.stringify(E.DIGIT), JSON.stringify(seq), 'digit order');
// invalid
is(E.decode(['gold', 'black', 'red', 'gold']), null, 'gold as digit'); is(E.decode(['red', 'red']), null, 'too few'); is(E.decode(['red', 'red', 'red', 'orange']), null, 'orange as tol'); is(E.decode(['red', 'red', 'pink', 'gold']), null, 'unknown');
// encode
is(E.encode(4700, 2, 'gold').join(' '), 'yellow violet red gold', 'enc 4.7k'); is(E.encode(2260, 3, 'brown').join(' '), 'red red blue brown brown', 'enc 2.26k'); is(E.encode(10000, 3, 'brown').join(' '), 'brown black black red brown', 'enc 10k 3d');
is(E.encode(1, 2, 'gold').join(' '), 'brown black gold gold', 'enc 1'); is(E.encode(0.56, 2, 'gold').join(' '), 'green blue silver gold', 'enc 0.56'); is(E.encode(220, 2, 'silver').join(' '), 'red red brown silver', 'enc 220');
is(E.encode(2260, 2, 'gold'), null, '2.26k needs 3 digits'); is(E.encode(0, 2), null, 'zero');
// round trip for the E24 decade
[10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91].forEach(function (v) { [1, 100, 10000].forEach(function (m) { var o = v * m, b = E.encode(o, 2, 'gold'); is(b && E.decode(b).ohms, o, 'round trip ' + o); }); });
// parse and format
eq(E.parse('4.7k'), 4700, 'p4.7k'); eq(E.parse('2k26'), 2260, 'p2k26'); eq(E.parse('4R7'), 4.7, 'p4R7'); eq(E.parse('10 kohm'), 10000, 'pkohm'); eq(E.parse('330'), 330, 'p330'); eq(E.parse('1M'), 1e6, 'p1M'); is(E.parse('abc'), null, 'pbad');
is(E.fmt(4700), '4.7 kΩ', 'f4.7k'); is(E.fmt(2260), '2.26 kΩ', 'f2.26k'); is(E.fmt(1e6), '1 MΩ', 'f1M'); is(E.fmt(220), '220 Ω', 'f220'); is(E.fmt(0.56), '0.56 Ω', 'f0.56');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
