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
 * @module score.rules
 */
var score = score || {};
score.rules = score.rules || {};

/**
 * Not documented
 * 
 * @class winGameByTwo
 */
score.rules.winGameByTwo = score.rules.winGameByTwo || function(self, options) {

    options = options || {};
    var when = options.when || "after score";
    
    self.gameOver = false;

    self.isOverTime = function() {
        return !self.gameOver && (self.scores[0] >= self.options.gameLength ||
                                  self.scores[1] >= self.options.gameLength);
    };

    self.isOverTimeNext = function() {
        return !self.gameOver &&
                (self.scores[0] === self.options.gameLength - 1 &&
                 self.scores[1] === self.options.gameLength - 1);
    };

    var isWinner = function(score1, score2) {
        if ( Math.abs(score1 - score2) < 2 ) {
            return;
        }
        return ( score1 >= self.options.gameLength );
    };

    self.isGamePoint = function() {
        return isWinner(self.scores[0] + 1, self.scores[1]) ||
               isWinner(self.scores[1] + 1, self.scores[0]);
    };

    self.events.on(when, function() {
        if ( self.undoing ) {
            return;
        }
        if ( self.gameOver ) {
            throw new Error("Game is over");
        }
        var winner = null;
        if ( isWinner(self.scores[0], self.scores[1]) ) {
            winner = 0;
        }
        if ( isWinner(self.scores[1], self.scores[0]) ) {
            winner = 1;
        }
        if ( !_.isNull(winner) ) {
            self.events.trigger("before gameWin", winner);
            self.gameOver = true;
            self.events.trigger("gameWin", winner);
            self.events.trigger("after gameWin", winner);
            self.record("gameWin", winner);
        }
    });

    self.events.on("before nextGame", function(event) {
        self.undoing = true;
    });

    self.events.on("nextGame", function(event) {
        self.gameOver = false;
        self.overTime = false;
        self.undoing = false;
    });

    self.events.on("undo gameWin", function(event) {
        self.gameOver = false;
        self.undo();
    });

    return self;
};

