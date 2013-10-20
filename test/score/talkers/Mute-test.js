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

buster.testCase("score.talkers.Mute", {
    
    talker: null,
    events: null,
    listener: null,
    
    setUp: function() {
        events = blackchip.Events();
        talker = score.talkers.Mute(events, 10);
        listener = this.stub();
    },
    
    "Event fired before talking": function() {
        events.on("say", listener);
        talker.say("Foo");
        assert.calledWith(listener, "Foo");    
    },
    
    "Event fired after talking": function(done) {
        events.on("after say", done(function(text) {
            assert.equals(text, "Foo");
        }));
        talker.say("Foo");
    },
    
    "Talk events queued": function(done) {
        events.on("after say", function(text) {
            if ( text === "done" ) {
                assert(true);
                done();
            }   
        });
        talker.say("start");
        talker.say("done");
    },
    
    "Silence": function(done) {
        events.on("after say", function(text) {
            if ( text === "pass" ) {
                assert(true);
                done();
                return;
            }
            assert(false);
        });
        talker.say("start");
        talker.say("done");
        talker.silence();
        talker.say("pass");
    }
    
});
