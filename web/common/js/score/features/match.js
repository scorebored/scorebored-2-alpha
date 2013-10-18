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
score.features = score.features || {};

score.features.Match = score.features.Match || function(self) {
    
    (function() {
        var match = {};
        
        for ( var i = 0; i < self.options.maxPlayers; i++ ) {
            match[i] = 0;
        }
        self.match = blackchip.Properties(match, self.events, "match");
    })();    
       
    self.currentGame = 1;
    
    self.events.on("after gameWin", function(event) {
        self.match[event.player]++;
    });
    
    self.events.on("match", function(event, name) {
        self.record(name, event);
    });
    
    self.next = function() {
        self.events.trigger("before nextGame");
        self.currentGame++;
        self.events.quiet = true;
        self.scores[0] = self.options.startingScore || 0;
        self.scores[1] = self.options.startingScore || 0;
        self.events.quiet = false;
        self.events.trigger("nextGame");
        self.record("nextGame");
    };
          
    self.events.on("undo match", function(event) {
        self.match[event.name] = event.previous;  
        self.undo();  
    });
    
    self.events.on("undo nextGame", function() {
        self.currentGame--;
        self.undo();
        self.undo();
    });
        
    return self;
    
};