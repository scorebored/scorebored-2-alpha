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

buster.testCase("score.models.TokenRing", {
    
    players: null,
    token: null,
    
    setUp: function() {
        players = score.models.Players([
            { name: "Player 1" },
            { name: "Player 2" },
            { name: "Player 3" },
            { name: "Player 4" }
        ]);
        token = score.models.Token();
    },
    
    "Advances to the next player": function() {
        var tokenRing = new score.models.TokenRing(players(), token);
        token(players(0));
        tokenRing.next();
        assert.equals(token().id(), 1);
    },
    
    "Selects the first player if no token is held": function() {
        var tokenRing = new score.models.TokenRing(players(), token);
        tokenRing.next();
        assert.equals(token().id(), 0);
    },
    
    "Circles on next at end": function() {
        var tokenRing = new score.models.TokenRing(players(), token);
        token(players(3));
        tokenRing.next();
        assert.equals(token().id(), 0);        
    },
    
    "Moves back to previous player": function() {
        var tokenRing = new score.models.TokenRing(players(), token);
        token(players(2));
        tokenRing.previous();
        assert.equals(token().id(), 1);
    },
    
    "Circles on previous at the beginning": function() {
        var tokenRing = new score.models.TokenRing(players(), token);
        token(players(0));
        tokenRing.previous();
        assert.equals(token().id(), 3);           
    }
    
});

    