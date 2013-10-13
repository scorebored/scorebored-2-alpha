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

score.rules = score.rules || {};

score.rules.BestOf = score.rules.BestOf || function(match, options) {
    
    var self = {};
    
    var isWinner = function(winner, matchLength) {
        return ( winner >= Math.ceil(matchLength / 2));
    };
       
    self.winner = function() { 
        if ( isWinner(match.wins(0), options.matchLength) ) {
            return match.players(0);
        }
        if ( isWinner(match.wins(1), options.matchLength) ) {
            return match.players(1);
        }
    };
    
    self.eliminationGame = function() {
        return matchLength > 1 &&
            (isWinner(match.wins(0) + 1, options.matchLength) ||
             isWinner(match.wins(1) + 1, options.matchLength));    
    };
    
    return self;
};