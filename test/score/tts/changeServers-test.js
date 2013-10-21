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

buster.testCase("score.tts.changeServers", {

    app: null,
    options: null,
    
    setUp: function() {
        options = {};
        app = score.Game();
        score.features.server(app);
        score.tts.changeServers(app, options);
    },
    
    "Serves first when no server is assigned": function() {
        this.stub(app.talker, "say");
        app.server.is = 0;
        assert.calledOnce(app.talker.say);
        assert.calledWith(app.talker.say, "Player 1 serves first");    
    },
    
    "Change servers": function() {
        app.server.is = 0;
        this.stub(app.talker, "say");
        app.server.is = 1;
        assert.calledOnce(app.talker.say);
        assert.calledWith(app.talker.say, "Change servers");            
    },
    
    "No announcment when game is over": function() {
        app.gameOver = true;
        this.stub(app.talker, "say");
        app.server.is = 1;
        assert(app.talker.say.notCalled);
    },
    
    "Announcement in overtime": function() {
        this.stub(app.talker, "say");
        var ot = this.stub();
        ot.returns(true);
        app.isOverTime = ot;
        app.server.is = 1;
        assert.calledOnce(app.talker.say);        
    },
    
    "No announcment in overtime": function() {
        options.noOverTime = true;
        this.stub(app.talker, "say");
        var ot = this.stub();
        ot.returns(true);
        app.isOverTime = ot;
        app.server.is = 1;
        assert(app.talker.say.notCalled);     
    }
            
});
