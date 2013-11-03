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
 * @module sb
 */
var sb = sb || {};

sb.rules = sb.rules || function() {

    var self = {};

    self.winByTwo = function(scores, length) {
        if ( Math.abs(scores[0] - scores[1]) < 2 ) {
            return null;
        }
        if ( scores[0] > scores[1] && scores[0] >= length ) {
            return 0;
        }
        if ( scores[1] > scores[0] && scores[1] >= length ) {
            return 1;
        }
        return null;
    };

    self.overtimeByTwo = function(scores, length) {
        if ( !_.isNull(self.winByTwo(scores, length)) ) {
            return false;
        }
        if ( scores[0] === length - 1 && scores[1] === length - 1 ) {
            return true;
        }
        if ( scores[0] >= length || scores[1] >= length ) {
            return true;
        }
    };

    self.gamePointByTwo = function(scores, length) {
        var s0 = [scores[0] + 1, scores[1]];
        if ( !_.isNull(self.winByTwo(s0, length)) ) {
            return true;
        }
        var s1 = [scores[1] + 1, scores[0]];
        if ( !_.isNull(self.winByTwo(s1, length)) ) {
            return true;
        }
    };

    self.matchPointBestOf = function(scores, length) {
        var s0 = [scores[0] + 1, scores[1]];
        if ( !_.isNull(self.winBestOf(s0, length)) ) {
            return true;
        }
        var s1 = [scores[1] + 1, scores[0]];
        if ( !_.isNull(self.winBestOf(s1, length)) ) {
            return true;
        }
    };

    self.winBestOf = function(scores, length) {
        if ( scores[0] > (length / 2) ) {
            return 0;
        }
        if ( scores[1] > (length / 2) ) {
            return 1;
        }
        return null;
    };

    return self;

}();
