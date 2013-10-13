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

var score = score || {};
score.rules = score.rules || {};

score.rules.ByTwo = score.rules.ByTwo || function(points, options) {
    
    var self = {};
    
    var isWinner = function(winner, loser, gameLength) {
        if ( Math.abs(winner - loser) < 2 ) {
            return false;
        }
        if ( winner >= options.gameLength ) {
            return true;
        }
        return false;
    };
       
    self.winner = function() { 
        if ( isWinner(points(0), points(1), options.gameLength) ) {
            return points.players(0);
        }
        if ( isWinner(points(1), points(0), options.gameLength) ) {
            return points.players(1);
        }
    };
    
    self.overtime = function() {
        return points(0) >= options.gameLength || 
               points(1) >= options.gameLength();
    };
    
    self.gamePoint = function() {
        return isWinner(points(0) + 1, points(1), options.gameLength) ||
               isWinner(points(1) + 1, points(0), options.gameLength);    
    };
    
    return self;
    
};

