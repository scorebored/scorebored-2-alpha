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

buster.testCase("score.tts.scoreByServer", {

    app: null,
    options: null,
    
    setUp: function() {
        gameOptions = {gameLength: 11};
        options = {};
        app = score.Game(gameOptions);
        score.features.scores(app);
        score.features.server(app);
        score.rules.winGameByTwo(app);
        score.tts.scoreByServer(app, options);
    },
    
    "Player 1 serving": function() {
        app.server.is = "0";
        this.stub(app.talker, "say");
        app.scores[0] = 4;
        assert.calledWith(app.talker.say, "4 - 0");
    },
    
    "Player 2 serving": function() {
        app.server.is = "1";
        this.stub(app.talker, "say");
        app.scores[0] = 4;
        assert.calledWith(app.talker.say, "0 - 4");
    },
    
    "Silent when game is over": function() {
        app.server.is = "1";
        this.stub(app.talker, "say");
        app.scores[0] = 11;
        assert(app.talker.say.notCalled);        
    },
    
    "Silent when overtime is next": function() {
        options.noOverTimeNext = true;
        app.server.is = "1";
        app.scores[0] = 10;
        this.stub(app.talker, "say");
        app.scores[1] = 10;
        assert(app.talker.say.notCalled);               
    },
    
    "Silent in overtime": function() {
        options.noOverTime = true;
        app.server.is = "1";
        app.scores[0] = 10;
        app.scores[1] = 10;
        this.stub(app.talker, "say");
        app.scores[1] = 11;
        assert(app.talker.say.notCalled);          
    }

});