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
 * @module score.features
 */
var score = score || {};
score.features = score.features || {};

/**
 * Records number of games won in a match.
 * 
 * This requires a rule to have been mixed in that triggers an "after gameWin"
 * event. Upon receiving that event, the number of games won for that
 * player will be incremented by one.
 * 
 * @class match
 */
score.features.match = score.features.match || function(self) {
    
    /**
     * Number of games won by player id.
     * 
     * @property games
     */
    self.games = null;
    
    /**
     * Number of the current game being played. Starts at one.
     * 
     * @property games.current
     */
    
    var init = function() {
        var games = {};
        
        for ( var i = 0; i < self.options.maxPlayers; i++ ) {
            games[i] = 0;
        }
        self.games = blackchip.Properties(games, self.events, "game");
        self.games.current = 1;
        
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
            self.games.current--;
            self.undo();
        });
    };    
    init();
    
    /**
     * Advances to the next game.
     * 
     * @method games.next
     */
    self.games.next = function() {
        self.events.trigger("before nextGame");
        self.games.current++;
        self.correction = true;
        self.scores[0] = self.options.startingScore || 0;
        self.scores[1] = self.options.startingScore || 0;
        self.correction = false;
        self.events.trigger("nextGame");
        self.events.trigger("after nextGame");
        self.record("nextGame");
    };
          
    return self;
    
};
