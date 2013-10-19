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

buster.testCase("score.features.seats", {
    
    game: null,
    
    setUp: function() {
        game = score.Game({maxPlayers: 3}); 
        score.features.seats(game);
    },
    
    "Seats in player order by default": function() {
        assert.equals(game.seats[0], 0);
        assert.equals(game.seats[1], 1);
        assert.equals(game.seats[2], 2);
    },
    
    "Used a different property name when specified": function() {
        game = score.Game({maxPlayers: 2}); 
        score.features.seats(game, "sides");   
        assert.equals(game.sides[0], 0);
        assert.equals(game.sides[1], 1);    
    },
    
    "Swap seats": function() {
        game.seats.swap(0, 1);
        assert.equals(game.seats[0], 1);
        assert.equals(game.seats[1], 0);
        assert.equals(game.seats[2], 2);        
    },
    
    "Event fired when a seat changes": function() {
        var listener = this.stub();
        game.events.on("seat", listener);
        game.seats[0] = 1;
        assert.calledWith(listener, 1);
    }
    
});
    
