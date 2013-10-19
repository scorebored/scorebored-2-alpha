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

/**
 * Not documented
 * 
 * @class match
 */
score.features.match = score.features.match || function(self) {
    
    self.currentGame = 1;

    var init = function() {
        var games = {};
        
        for ( var i = 0; i < self.options.maxPlayers; i++ ) {
            games[i] = 0;
        }
        self.games = blackchip.Properties(games, self.events, "game");

        self.events.on("after gameWin", function(player) {
            self.games[player]++;
        });
        
        self.events.on("game", function() {
            self.record.apply(null, arguments);
        });
        
        self.events.on("undo game", function(games, player, previous) {
            self.games[player] = previous;  
            self.undo();  
        });
        
        self.events.on("undo nextGame", function() {
            self.currentGame--;
            self.undo();
            self.undo();
        });
    };    
       
    self.nextGame = function() {
        self.events.trigger("before nextGame");
        self.currentGame++;
        self.scores[0] = self.options.startingScore || 0;
        self.scores[1] = self.options.startingScore || 0;
        self.events.trigger("nextGame");
        self.events.trigger("after nextGame");
        self.record("nextGame");
    };
          
    init();
    return self;
    
};