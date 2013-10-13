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
score.models = score.models || {};

score.models.Match = score.models.Match || function(players, options) {
    
    var events = blackchip.Events();
    var self = {};
    
    var games = [];
    var wins;
    var current = 0;
    var matchOver = false;
    
    var init = function() {
        games[0] = score.models.Points(players, options, events);    
        wins = _.times(players().length, function() { return 0; });   
    };
 
    var self = function(id) {
        return games[current](id);    
    };

    self.wins = function(id) {
        if ( _.isUndefined(id) ) {
            return wins;
        }    
        return wins[id];
    };
    
    self.players = players;
    
    self.award = function(spec) {
        return games[current].award(spec);
    };
    
    self.gameOver = function(player) {
        games[current].over();
        wins[player.id()]++;
        events.trigger("win_game", {
            player: player,
            wins: wins[player.id()],
            match: wins
        });        
    };
    
    self.nextGame = function() {
        current++;
        if ( !games[current] ) {
            games[current] = score.models.Points(players, options, events);
        }
        gameOver = false;
        events.trigger("start_game", {
            game: current
        });
    };
    
    self.matchOver = function(player) {
        games[current].over();
        matchOver = true;
        events.trigger("win_match", {
            player: player,
            wins: wins[player.id()],
            match: wins
        });  
    };
        
    self.events = events;
    
    init();
        
    return self; 

};
