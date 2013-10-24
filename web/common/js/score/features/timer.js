/******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 blackchip.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *****************************************************************************/

/**
 * @module score.features
 */
var score = score || {};
score.features = score.features || {};

score.features.timer = score.features.timer || function(self) {

    var mark = 0;
    var add = 0;

    self.timer = {};
    self.timer.running = false;

    self.timer.start = function() {
        if ( self.timer.running ) {
            return;
        }
        mark = Date.now();
        self.timer.running = true;
        self.events.trigger("timerStart");
    };

    self.timer.elapsed = function() {
        if ( self.timer.running ) {
            return Date.now() - mark + add;
        } else {
            return add;
        }
    };

    self.timer.stop = function() {
        if ( !self.timer.running ) {
            return;
        }
        add = self.timer.elapsed();
        self.timer.running = false;
        self.events.trigger("timerStop");
    };

    self.timer.reset = function() {
        mark = Date.now();
        add = 0;
    };

    self.events.on("gameStart", function() {
        self.timer.reset();
        self.timer.start();
    });

    self.events.on("undo gameStart", function() {
        self.timer.reset();
        self.timer.stop();
    });

    self.events.on("gameWin", function() {
        self.timer.stop();
    });

    self.events.on("undo gameWin", function() {
        self.timer.start();
    });

    self.events.on("nextGame", function() {
        self.timer.start();
    });

    return self;
};
