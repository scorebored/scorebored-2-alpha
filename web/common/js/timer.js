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
var sb = sb || {};

sb.timer = sb.timer || function() {

    var mark = 0;
    var add = 0;

    var self = {};

    self.events = sb.events();
    self.running = false;

    self.start = function() {
        if ( self.running ) {
            return;
        }
        mark = Date.now();
        self.running = true;
        self.events.trigger("start");
    };

    self.elapsed = function() {
        if ( self.running ) {
            return Date.now() - mark + add;
        } else {
            return add;
        }
    };

    self.stop = function() {
        if ( !self.running ) {
            return;
        }
        add = self.elapsed();
        self.running = false;
        self.events.trigger("stop");
    };

    self.reset = function() {
        mark = Date.now();
        add = 0;
        if ( self.running ) {
            self.events.trigger("start");
        }
    };

    return self;
};