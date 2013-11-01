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

buster.testCase("score.rules.winGameByTwo", {

    app: null,
    
    setUp: function() {
        app = score.Game({gameLength: 11});
        
        score.features.scores(app);
        score.rules.winGameByTwo(app);
    },
    
    "Win at game length": function() {
        app.scores[0] = 11;
        assert(app.gameOver);
    },
    
    "No win when less than two": function() {
        app.scores[0] = 10;
        app.scores[1] = 10;
        app.scores[0]++;
        refute(app.gameOver);
    },
    
    "Is overtime": function() {
        app.scores[0] = 10;
        app.scores[1] = 10;
        app.scores[0]++;
        assert(app.isOverTime());      
    },
    
    "Is overtime next": function() {
        app.scores[0] = 10;
        app.scores[1] = 10;
        assert(app.isOverTimeNext());            
    },
    
    "Game point": function() {
        app.scores[1] = 10;
        assert(app.isGamePoint());            
    },
    
    "No game point when tied": function() {
        app.scores[0] = 10;
        app.scores[1] = 10;
        refute(app.isGamePoint());        
    },
    
    "Win by two": function() {
        app.scores[0] = 10;
        app.scores[1] = 10;
        app.scores[1]++;
        refute(app.gameOver);  
        app.scores[1]++;
        assert(app.gameOver);        
    },
    
    "Events triggered on a win": function() {
        var before = this.stub();
        var as = this.stub();
        var after = this.stub();
        
        app.events.on("before gameWin", before);
        app.events.on("gameWin", as);
        app.events.on("after gameWin", after);
        
        app.scores[1] = 11;
        
        assert.calledWith(before, "1", "before gameWin");
        assert.calledWith(as, "1", "gameWin");
        assert.calledWith(after, "1", "after gameWin");       
    },
    
    "Exception thrown when game length shortened": function() {
        app.options.gameLength = 21;
        app.scores[0] = 11;
        assert.exception(function() {
            app.options.gameLength = 11;
        });    
    }
        
});

    
