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

buster.testCase("score.features.sides", {
    
    game: null,
    
    setUp: function() {
        game = score.Game();
        score.features.sides(game);    
    },
    
    "Assigned to default sides": function() {
        assert.equals(game.sides[0], 0);
        assert.equals(game.sides[1], 1);
    },
    
    "Change sides": function() {
        game.sides.change();
        assert.equals(game.sides[0], 1);
        assert.equals(game.sides[1], 0);
    },
    
    "Double change sides": function() {
        game.sides.change();
        game.sides.change();
        assert.equals(game.sides[0], 0);
        assert.equals(game.sides[1], 1);        
    },
    
    "Events triggered on side change": function() {
        var before = this.stub();
        var as = this.stub();
        var after = this.stub();
        
        game.events.on("before sides", before);
        game.events.on("sides", as);
        game.events.on("after sides", after);
        
        game.sides.change();
        assert.calledWith(before, 1, 0);
        assert.calledWith(as, 1, 0);
        assert.calledWith(after, 1, 0);
    }
    
});
