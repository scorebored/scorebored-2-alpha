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

buster.testCase("score.tts.matchStandings", {

    app: null,
    
    setUp: function() {
        gameOptions = {gameLength: 11, matchLength: 7};
        app = score.Game(gameOptions);
        score.features.scores(app);
        score.features.match(app);
        score.rules.winGameByTwo(app);
        score.rules.winMatchBestOf(app);
        score.tts.matchStandings(app);
    },
    
    "Match standings, Player 1 leads": function() {
        app.games[0] = 2;
        app.games[1] = 2;
        this.stub(app.talker, "say");
        app.scores[0] = 11;
        assert.calledWith(app.talker.say, "Player 1 leads, 3 games to 2");
    },
    
    "Match standings, Player 2 leads": function() {
        app.games[0] = 2;
        app.games[1] = 2;
        this.stub(app.talker, "say");
        app.scores[1] = 11;
        assert.calledWith(app.talker.say, "Player 2 leads, 3 games to 2");
    }, 
    
    "Match standings, Tied": function() {
        app.games[0] = 2;
        app.games[1] = 1;
        this.stub(app.talker, "say");
        app.scores[1] = 11;
        assert.calledWith(app.talker.say, "Games tied at 2");
    },        
    
    "Singular form of game": function() {
        this.stub(app.talker, "say");
        app.scores[0] = 11;
        assert.calledWith(app.talker.say, "Player 1 leads, 1 game to 0");        
    },
    
    "Slient when match is over": function() {
        app.games[0] = 3;
        app.games[1] = 3;
        this.stub(app.talker, "say");
        app.scores[1] = 11;
        assert(app.talker.say.notCalled);        
    }  

});