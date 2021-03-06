/* playerControl.js - handles the controls of the player.  */
/**
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2014, 2015  Alan Manuel K. Gloria
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
define(function (require) {
"use strict";

var chart = require('galaxy').chart;
var console = require('console');
var engines = require('engines');
var field = require('field');
var keys = require('keys');
var label = require('label');
var loop = require('loop');
var panel = require('panel');
var shield = require('shield');
var signal = require('signal');
var vars = require('vars');
var hyperwarp = require('hyperwarp');
var photons = require('photons');
var lrs = require('lrs');
var viewControl = require('viewControl');
var computer = require('computer');

/*-----------------------------------------------------------------------------
Key Handler Table
-----------------------------------------------------------------------------*/

var keytable = {};

(function () {
var i;
function engineControl(k) {
    if (hyperwarp.engaged()) {
        console.write('Hyperwarp aborted.');
    }
    engines.setSpeed(parseInt(k));
}
for (i = 0; i <= 9; ++i) {
    keytable[i.toString()] = engineControl;
}
})();
keytable['h'] = keytable['H'] = function () {
    if (hyperwarp.engaged()) {
        console.write('Hyperwarp aborted.');
        engines.setSpeed(0);
    } else {
        console.write('Hyperwarp engines engaged.');
        hyperwarp.engage();
    }
};

/* View control.  */
keytable['a'] = keytable['A'] = viewControl.aft;
keytable['f'] = keytable['F'] = viewControl.fore;
keytable['l'] = keytable['L'] = viewControl.lrs;
keytable['g'] = keytable['G'] = viewControl.chart;

/* Instrument computer.  */
keytable['t'] = keytable['T'] = function () {
    if (!computer.instruments.isAutotrackEnabled()) {
        console.write('Computer auto-tracking enabled.');
        computer.instruments.autotrackEnable();
    } else {
        console.write('Computer auto-tracking disabled.');
        computer.instruments.autotrackDisable();
    }
};
keytable['m'] = keytable['M'] = function () {
    computer.instruments.switchTarget();
};
/* Attack computer.  */
keytable['c'] = keytable['C'] = function () {
    if (!computer.attack.isEnabled()) {
        console.write('Attack computer enabled.');
        computer.attack.enable();
    } else {
        console.write('Attack computer disabled.');
        computer.attack.disable();
    }
};

/* Shields.  */
keytable['s'] = keytable['S'] = function () {
    if (shield.isEnabled()) {
        console.write('Shields disabled.');
        shield.disable();
    } else {
        console.write('Shields enabled.');
        shield.enable();
    }
};

keytable['\e'] = keytable['p'] = keytable['P'] = function () {
    loop.enterPause();
};

/*-----------------------------------------------------------------------------
Interface
-----------------------------------------------------------------------------*/

var isGameOver = false;

function onUpdate() {
    var movex = 0;
    var movey = 0;
    var k = '';
    var f = null;

    if (isGameOver) {
        field.pitch = 0;
        field.yaw = 0;
        chart.movex = 0;
        chart.movey = 0;
        photons.fire = false;
        if (keys.key === '\e') {
            loop.enterPause();
        }
        return;
    }

    if (keys.left) {
        --movex;
    }
    if (keys.right) {
        ++movex;
    }
    if (keys.up) {
        --movey;
    }
    if (keys.down) {
        ++movey;
    }

    /* Only fire missiles if not in hyperspace or hyperwarp.  */
    if (!hyperwarp.engaged() && !hyperwarp.inHyperspace() &&
        field.speed < 70.0) {
        photons.fire = keys.fire;
    } else {
        photons.fire = false;
    }

    if (!chart.isShown() || hyperwarp.engaged()) {
        field.yaw = movex;
        field.pitch = -movey;
        chart.movex = 0;
        chart.movey = 0;
    } else {
        field.yaw = 0;
        field.pitch = 0;
        chart.movex = movex;
        chart.movey = movey;
    }

    k = keys.key;
    if (k !== '') {
        if (typeof keytable[k] === 'function') {
            keytable[k](k);
        }
    }
}

function onGameOver() {
    isGameOver = true;
}
function onNewGame() {
    isGameOver = false;
}

signal('update', onUpdate);
signal('gameOver', onGameOver);
signal('newGame', onNewGame);
return onUpdate;
});
