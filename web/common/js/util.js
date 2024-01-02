/******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2024 blackchip.org
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
 * @module sb
 */
var sb = sb || {};

sb.util = sb.util || function() {

    var self = {};

    self.total = function(numberArray) {
        return _.reduce(numberArray, function(sum, value) {
            return sum + value;
        });
    };

    self.other = function(index) {
        return index === 0 ? 1 : 0;
    };

    self.swap = function(array) {
        var e1 = array[1];
        array[1] = array[0];
        array[0] = e1;
        return array;
    };

    self.lpad = function(str, length) {
        str = ""+str;
        length = length || 0;
        if (lpad.length < length) {
            return Array(length - str.length + 1).join('0') + str;
        }
        return str;
    };

    self.elapsedString = function(milliseconds) {
        var d = new Date(milliseconds);
        var seconds = "" + d.getSeconds();
        var minutes = "" + d.getMinutes();
        seconds = ( seconds.length === 1 ) ? "0" + seconds : seconds;
        minutes = ( minutes.length === 1 ) ? "0" + minutes : minutes;
        return minutes + ":" + seconds;
    };

    // May be a duplicate of above method, but intended for
    // larger durations (includes hours by default)
    self.duration = function(milliseconds) {
        milliseconds = _.parseInt(milliseconds);
        if (isNaN(milliseconds)) { return "-"; }
        if (milliseconds < 0) { return "-"; }
        var secs = milliseconds / 1000;

        var hours = ~~(secs / (60*60));
        secs %= (60*60);
        var mins = ~~(secs / 60);
        secs %= 60;

        return self.lpad(hours, 2) + ":" +
                self.lpad(mins, 2) + ":" +
                self.lpad(secs, 2);
    };

    return self;

}();
