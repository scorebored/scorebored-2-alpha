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

    game: null,
    
    setUp: function() {
        game = score.Game({gameLength: 11});
        
        score.features.scores(game);
        score.rules.winGameByTwo(game);
    },
    
    "Win at game length": function() {
        game.scores[0] = 11;
        assert(game.gameOver);
    },
    
    "No win when less than two": function() {
        game.scores[0] = 10;
        game.scores[1] = 10;
        game.scores[0]++;
        refute(game.gameOver);
    },
    
    "Is overtime": function() {
        game.scores[0] = 10;
        game.scores[1] = 10;
        game.scores[0]++;
        assert(game.isOverTime());      
    },
    
    "Is overtime next": function() {
        game.scores[0] = 10;
        game.scores[1] = 10;
        assert(game.isOverTimeNext());            
    },
    
    "Game point": function() {
        game.scores[1] = 10;
        assert(game.isGamePoint());            
    },
    
    "No game point when tied": function() {
        game.scores[0] = 10;
        game.scores[1] = 10;
        refute(game.isGamePoint());        
    },
    
    "Win by two": function() {
        game.scores[0] = 10;
        game.scores[1] = 10;
        game.scores[1]++;
        refute(game.gameOver);  
        game.scores[1]++;
        assert(game.gameOver);        
    },
    
    "Events triggered on a win": function() {
        var before = this.stub();
        var as = this.stub();
        var after = this.stub();
        
        game.events.on("before gameWin", before);
        game.events.on("gameWin", as);
        game.events.on("after gameWin", after);
        
        game.scores[1] = 11;
        
        assert.calledWith(before, "1", "before gameWin");
        assert.calledWith(as, "1", "gameWin");
        assert.calledWith(after, "1", "after gameWin");       
    },
        
});

    
