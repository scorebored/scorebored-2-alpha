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

score.shoes = score.shoes || {};

score.shoes.Driver = score.shoes.Driver || function(options) {

    var console = blackchip.Console;

    var self = {};
    
    options = options || {};
    options.gameLength = options.gameLength || 11;
    options.matchLength = options.matchLength || 1;
    
    self.MATCH_LENGTHS = [1, 3, 5, 7];
    self.options = options;
         
    self.players = score.models.Players([
        { name: "Home Team" },
        { name: "Away Team" }
    ]);
    
    self.match = score.models.Match(self.players, options);
    self.round = score.models.Round({
        players: self.players,
        points: self.match        
    });
    
    self.gameWinRule = score.rules.ByTwo(self.match, options);
    self.matchWinRule = score.rules.BestOf(self.match, options);
    
    self.round.events.on("after_round", function() {
        var winner = self.gameWinRule.winner();
        if ( winner ) {
            self.match.gameOver(winner);
        }
    });
    self.match.events.on("win_game", function() {
        var winner = self.matchWinRule.winner();
        if ( winner ) {
            self.match.matchOver(winner);
        }
    });
    
    
    return self;
    
};