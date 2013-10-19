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

buster.testCase("score.features.round", {

    game: null,
    
    setUp: function() {
        game = score.Game(); 
        score.features.scores(game);
        score.features.round(game);
    },
    
    "End of round event fired": function() {
        var result;
        game.events.on("round", function(e) { result = e; });
        game.scores[0] = 5;
        game.scores[1] = 7;
        game.endRound();
        assert.equals(result[0], 5);
        assert.equals(result[1], 7);
    },
    
    "Scores totalled during round": function() {
        var result;
        game.events.on("round", function(e) { result = e; });
        game.scores[0] += 5;
        game.scores[1] += 7;
        game.scores[0] += 5;
        game.scores[1] += 7;
        game.endRound();
        assert.equals(result[0], 10);
        assert.equals(result[1], 14);        
    },
    
    "Totals reset after round": function() {
        var result;
        game.events.on("round", function(e) { result = e; });
        game.scores[0] += 5;
        game.scores[1] += 7;
        game.endRound();
        game.scores[0] += 10;
        game.scores[1] += 11;
        game.endRound();
        assert.equals(result[0], 10);
        assert.equals(result[1], 11);          
    },
    
    "Undo round": function() {
        game.scores[0] = 5;
        game.scores[1] = 7;
        game.endRound();
        game.scores[0] += 5;
        game.scores[1] += 7;
        game.endRound();
        assert.equals(game.scores[0], 10);
        assert.equals(game.scores[1], 14); 
        game.undo();
        assert.equals(game.scores[0], 5);
        assert.equals(game.scores[1], 7);            
    },
    
    "Redo round": function() {
        game.scores[0] = 5;
        game.scores[1] = 7;
        game.endRound();
        game.scores[0] += 5;
        game.scores[1] += 7;
        game.endRound();
        assert.equals(game.scores[0], 10);
        assert.equals(game.scores[1], 14); 
        game.undo();
        game.redo();
        assert.equals(game.scores[0], 10);
        assert.equals(game.scores[1], 14);           
    }
    
});
