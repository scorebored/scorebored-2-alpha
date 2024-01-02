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

score.tts.matchWinner = score.tts.matchWinner || function(self) {
    
    var allowed = function() {
        if ( self.options.matchLength === 1 ) {
            return false;
        }
        return true;
    };

    self.events.on("matchWin", function(winner) {
        if ( !allowed() ) {
            return;
        }
        var loser = ( winner === "0" ) ? 1: 0;
        self.say(self.players[winner] + " has won the match",
                 self.games[winner] + " games to " + self.games[loser]);
    });

    return self;

};
