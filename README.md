# BandCode

Resistor color code decoder and encoder (4 and 5 band).

Digits black 0 to white 9; multiplier 10^digit, gold x0.1, silver x0.01; tolerance brown 1%, red 2%, green 0.5%, blue 0.25%, violet 0.1%, grey 0.05%, gold 5%, silver 10%, none 20% (3-band only).
Tests: 123 checks. Worked example from https://en.wikipedia.org/wiki/Electronic_color_code (red red blue brown brown = 2.26 kOhm, 1%), well-known values (4.7k, 10k, 220, 330, 1M), gold and silver multipliers, invalid bands, and encode-decode round trip over the E24 values across three decades.
Not covered: 6-band temperature coefficient, and deciding which end is the start on a physical part; measure with a meter when it matters.

Static client-side. `node test-engine.js` runs the tests.
