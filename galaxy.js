/* galaxy.js - Handles the galactic sectors and the player's galactic
     chart view.  */
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
define(['signal'], function (signal) {
"use strict";

/* The galaxy is 16x8.  Sectors are identified from 0 -> 127.  */
/*
The game model array is an array of signed integers.
Positive numbers denote an enemy group, with the magnitude
being the number of enemy ships in the group.
0 denotes an empty sector.
Negative numbers denote a friendly starbase.  -1 is
normal starbase, -2 is a starbase that is surrounded for
one term, -3 for two terms, -4 for three terms (at risk
of destruction).
*/

function asmModule(stdlib) {
    "use asm";

    var imul = stdlib.Math.imul;

    function sectorOffset(s, x, y) {
        s = s|0;
        x = x|0;
        y = y|0;
        var sx = 0;
        var sy = 0;
        var tmp = 0;
        var rv = 0;
        sx = ((s|0) % (16|0))|0;
        sy = ((s|0) / (16|0))|0;
        sx = (sx + x)|0;
        sy = (sy + y)|0;
        if ((sx|0) < 0) {
            sx = (sx + 16)|0;
        } else if ((sx|0) >= 16) {
            sx = (sx - 16)|0;
        }
        if ((sy|0) < 0) {
            sy = (sy + 8)|0;
        } else if ((sy|0) >= 8) {
            sy = (sy - 8)|0;
        }
        tmp = imul(sy, 16)|0;
        rv = (tmp + sx)|0;
        return rv|0;
    }

    return {sectorOffset: sectorOffset};
}
var asm = asmModule(window);
var sectorOffset = asm.sectorOffset;


/* A model of the real world.

The currrent star date is stored in
this.dateMaj and this.dateMin.
*/
function Model() {
    var i;

    /* Stardate major and minor date.  */
    this.dateMin = 0;
    this.dateMaj = 0;
    /* The minor date is incremented per second.  */
    this._sec = 0.0;

    /* Sector information.  */
    this.sectors = new Array(128);
    for (i = 0; i < 128; ++i) {
        this.sectors[i] = 0;
    }

    /* Reserve for initialization.  */
    this.chart = null;
}
Model.prototype.update = function (seconds) {
    this._sec += seconds;
    if (this._sec > 1.0) {
        this._sec -= 1.0;
        ++this.dateMin;
        if (this.dateMin === 100) {
            ++this.dateMaj;
            this.dateMin = 0;
        }
        /* Update at each x.50 or x.00.  */
        if (this.dateMin === 0 || this.dateMin === 50) {
            this._enemyMove();
            this.chart._modelChange();
        }
    }
    return this;
};
/* Called at each time that the enemy moves.  */
Model.prototype._enemyMove = function () {
    // TODO
    return this;
};
/* Called at the start of the game.  */
Model.prototype.newGame = function (difficulty) {
    // TODO
    return this;
};
/* Called when the player destroys the starbase in the current
   sector.  */
Model.prototype.playerDestroyStarbase = function () {
    // TODO
    return this;
};

/* Status of the sub-space radio.  */
var FIXED = 0;
var DAMAGED = 1;
var DESTROYED = 2;

/* A map of the real world.  The map is not the territory.  */
function Chart() {
    this._display = false;

    this._state = FIXED;

    this._dom = null;

    /* Control movement of cursor.  */
    this.movex = 0;
    this.movey = 0;

    /* Reserve for initialization.  */
    this.m = null;
}
Chart.prototype.update = function (seconds) {
    /* TODO */
    return this;
};
Chart.prototype.render = function () {
    /* TODO */
    return this;
};
/* Display state.  */
Chart.prototype.show = function () {
    this._display = true;
    return this;
};
Chart.prototype.hide = function () {
    this._display = false;
    return this;
};
Chart.prototype.isShown = function () {
    return this._display;
};
/* Called by the model object if the model changes.
   We only update the map if the galactic chart is
   actually enabled and the chart is fixed.  */
Chart.prototype._modelChange = function () {
    /* TODO */
    return this;
};
/* Called at the beginning of each game, after the model
   has initialized.  */
Chart.prototype.newGame = function () {
    this._state = FIXED;
    /* TODO */
    return this;
};

function Galaxy() {
    /* Initialize chart and model.  */
    this.chart = new Chart();
    this._m = new Model();
    /* Tie them.  */
    this.chart.m = this._m;
    this._m.chart = this.chart;

    /* Set up signals.  */
    signal('update', this.update.bind(this));
    signal('render', this.render.bind(this));
    signal('newGame', this.newGame.bind(this));
}
Galaxy.prototype.update = function (seconds) {
    this._m.update(seconds);
    this.chart.update(seconds);
    return this;
};
Galaxy.prototype.render = function () {
    this.chart.render();
    return this;
};
Galaxy.prototype.newGame = function (difficulty) {
    this._m.newGame(difficulty);
    this.chart.newGame(difficulty);
    return this;
};
Galaxy.prototype.playerDestroyStarbase = function () {
    this._m.playerDestroyStarbase();
    return this;
};

return new Galaxy();
});