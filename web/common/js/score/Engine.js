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

score.Engine = score.Engine || function(self) {
        
    (function() {
        var players = {};
        
        for ( var i = 0; i < self.options.maxPlayers; i++ ) {
            var playerNumber = i + 1;
            players[i] = "Player " + playerNumber;
        }
        self.players = blackchip.Properties(players, self.events, "player");
    })();    
            
    self.rollback = 0;
    self.history = [];
    
    self.record = function(name, event) {
        if ( !self.rollback ) {
            self.history.push({name: name, event: event});
        }
    };
    
    self.undo = function() {
        if ( self.history.length === 0 ) {
            return;
        }
        self.rollback++;
        var item = self.history.pop();
        self.events.trigger("undo " + item.name, item.event); 
        self.rollback--;   
    };
    
    
    return self;
    
};