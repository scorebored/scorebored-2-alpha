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

buster.testCase("score.features.scores", {
    
    options: null,
    game: null,
    
    setUp: function() {
        options = {maxPlayers: 3};
        game = score.Game(options);    
        score.features.scores(game);
    },
    
    "Initial scores are zero by default": function() {
        assert.equals(game.scores[0], 0);
        assert.equals(game.scores[1], 0);
        assert.equals(game.scores[2], 0);
    },
    
    "Initial scores with provided value": function() {
        options.startingScore = 301;
        game = score.Game(options);    
        score.features.scores(game);
 
        assert.equals(game.scores[0], 301);
        assert.equals(game.scores[1], 301);
        assert.equals(game.scores[2], 301);        
    },
    
    "Event fired when score changed": function() {
        var listener = this.stub();
        game.events.on("score", listener);
        game.scores[0] = 5;
        assert(listener.calledWith(5, "0", 0));
    },
    
    "Score change recorded in history": function() {
        game.scores[0] = 1;
        game.scores[0] = 2;
        assert.equals(game.history[1][0], "score"); // event name    
        assert.equals(game.history[1][1], 2); // value
        assert.equals(game.history[1][2], "0"); // playerId
        assert.equals(game.history[1][3], 1); // previous
    },
    
    "Undo applied": function() {
        game.scores[0] = 1;
        game.scores[0] = 2;
        game.undo();
        assert.equals(game.scores[0], 1);
    },
    
    "Redo applied": function() {
        game.scores[0] = 1;
        game.scores[0] = 2;
        game.undo();
        game.redo();
        assert.equals(game.scores[0], 2);        
    }
    
});