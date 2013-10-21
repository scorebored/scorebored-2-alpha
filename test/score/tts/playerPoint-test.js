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

buster.testCase("score.tts.playerPoint", {

    app: null,
    opitions: null,
    
    setUp: function() {
        gameOptions = {gameLength: 11};
        options = {};
        app = score.Game(gameOptions);
        score.features.scores(app);
        score.rules.winGameByTwo(app);
        score.tts.playerPoint(app, options);
    },
 
    "Player 1 point": function() {
        this.stub(app.talker, "say");
        app.scores[0] = 1;
        assert.calledWith(app.talker.say, "Point Player 1");      
    },
    
    "Player 2 point": function() {
        this.stub(app.talker, "say");
        app.scores[1] = 1;
        assert.calledWith(app.talker.say, "Point Player 2");      
    },
    
    "Point in overtime": function() {
        app.scores[0] = 10;
        app.scores[1] = 10;
        this.stub(app.talker, "say");
        app.scores[0] = 11;
        assert.calledWith(app.talker.say, "Point Player 1");        
    },
    
    "Silent in overtime": function() {
        options.noOverTime = true;
        app.scores[0] = 10;
        app.scores[1] = 10;
        this.stub(app.talker, "say");
        app.scores[0] = 11;
        assert(app.talker.say.notCalled);           
    }

});
