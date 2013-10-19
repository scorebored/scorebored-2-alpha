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
 * @modules score.rules.winMatchBestOf
 */
var score = score || {};
score.rules = score.rules || {};

/**
 * Not documented
 * 
 * @class winMatchBestOf
 */
score.rules.winMatchBestOf = score.rules.winMatchBestOf || function(self) {

    self.matchOver = false;

    var isWinner = function(score) {
        return ( score / self.options.matchLength >= .5 ) ;
    };

    self.isMatchPoint = function() {
        return self.isGamePoint() &&
            ( isWinner(self.match[0] + 1) || isWinner(self.match[1] + 1) );
    };

    self.events.on("match", function(player) {
        if ( self.undoing ) {
            return;
        }
        if ( self.matchOver ) {
            throw new Error("Match is over");
        }
        if ( isWinner(player) ) {
            self.events.trigger("before matchWin", player);
            self.matchOver = true;
            self.events.trigger("matchWin", player);
            self.events.trigger("after matchWin", player);
            self.record("matchWin", player);
        }
    });

    self.events.on("undo matchWin", function(event) {
        self.matchOver = false;
        self.undo();
    });

    return self;
};
