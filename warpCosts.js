/* warpCosts.js - table of hyperwarp costs.  */
/**
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2014  Alan Manuel K. Gloria
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */
define([], function () {
/* Energy actually consumed to jump from one sector to another.  */
var table = [
    100,
    130,
    160,
    200,
    230,
    500,
    700,
    800,
    900,
    1200,
    1250,
    1300,
    1350,
    1400,
    1550,
    1700,
    1840,
    2000,
    2080,
    2160,
    2230,
    2320,
    2410,
    2500
];
function warpCosts(px, py, cx, cy) {
    var dist;
    dist = Math.floor(
        Math.abs(px - cx) + Math.abs(py - cy)
    );
    return table[dist];
}
return warpCosts;
});
