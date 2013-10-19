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

buster.testCase("score.features.tokenRing", {
    
    game: null,
    
    setUp: function() {
        game = score.Game({maxPlayers: 3});
        score.features.token(game, "dealer");
        score.features.tokenRing(game, "dealer");
    },
    
    "Next assigns to first in order if token is not held": function() {
        game.dealer.next();
        assert.equals(game.dealer.is, "0");
    },
    
    "Moves to the next player": function() {
        game.dealer.is = "1";
        game.dealer.next();
        assert.equals(game.dealer.is, "2");
    },
    
    "Next circles arounds to the beginning": function() {
        game.dealer.is = "2";
        game.dealer.next();
        assert.equals(game.dealer.is, "0");
    }, 
    
    "Previous assigns to last in order if token is not held": function() {
        game.dealer.previous();
        assert.equals(game.dealer.is, "2");
    },
    
    "Moves to the previous player": function() {
        game.dealer.is = "2";
        game.dealer.previous();
        assert.equals(game.dealer.is, "1");
    },
    
    "Previous circles arounds to the end": function() {
        game.dealer.is = "0";
        game.dealer.previous();
        assert.equals(game.dealer.is, "2");
    },
    
    "Alternates with two players": function() {
        game = score.Game({maxPlayers: 2});
        score.features.token(game, "server");
        score.features.tokenRing(game, "server");
        
        game.server.is = "0";
        game.server.next();
        assert.equals(game.server.is, "1");
        game.server.next();
        assert.equals(game.server.is, "0");
    }
    
}); 