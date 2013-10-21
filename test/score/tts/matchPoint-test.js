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

buster.testCase("score.tts.matchPoint", {

    app: null,
    options: null,
    
    setUp: function() {
        gameOptions = {gameLength: 11, matchLength: 3};
        options = {};
        app = score.Game(gameOptions);
        score.features.scores(app);
        score.features.match(app);
        score.rules.winGameByTwo(app);
        score.rules.winMatchBestOf(app);
        score.tts.matchPoint(app, options);
    },
    
    "Match point": function() {
        app.games[0] = 1;
        this.stub(app.talker, "say");
        app.scores[0] = 10;
        assert.calledWith(app.talker.say, "Match point"); 
    },
    
    "Silent when not match point": function() {
        app.games[0] = 1;
        this.stub(app.talker, "say");
        app.scores[0] = 9;
        assert(app.talker.say.notCalled);       
    },
    
    "Slient when game over": function() {
        app.games[0] = 1;
        this.stub(app.talker, "say");
        app.scores[0] = 11;  
        assert(app.talker.say.notCalled);             
    },
    
    "No match point in overtime": function() {
        options.noOverTime = true; 
        app.games[0] = 1;
        app.scores[0] = 10;
        this.stub(app.talker, "say");
        app.scores[1] = 10;  
        assert(app.talker.say.notCalled);                  
    }

});

