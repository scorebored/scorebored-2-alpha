/******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2024 blackchip.org
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

var score = score || {};
score.tts = score.tts || {};

score.tts.scoreByServer = score.tts.scoreByServer || function(self, options) {
    
    options = options || {};

    var allowed = function(event) {
        if ( self.gameOver ) {
            return false;
        }
        if ( options.noOverTime && self.isOverTime() ) {
            return false;
        }
        if ( options.noOverTimeNext && self.isOverTimeNext() ) {
            return false;
        }
        return true;
    };

    self.events.on("after score", function() {
        if ( !allowed() ) {
            return;
        }
        var server = self.server.is;
        var score1 = server === "0" ? self.scores[0] : self.scores[1];
        var score2 = server === "0" ? self.scores[1] : self.scores[0];
        self.say(score1 + " - " + score2);
    });

    return self;

};
