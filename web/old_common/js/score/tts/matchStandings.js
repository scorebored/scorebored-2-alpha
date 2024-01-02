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

score.tts.matchStandings = score.tts.matchStandings || function(self) {
    
    var allowed = function() {
        if ( self.matchOver ) {
            return false;
        }
        return true;
    };

    self.events.on("after gameWin", function() {
        if ( !allowed() ) {
            return;
        }
        if ( self.games[0] === self.games[1] ) {
            self.say("Games tied at " + self.games[0]);
            return;
        }
        var leader, leaderGames, followerGames;
        if ( self.games[0] > self.games[1] ) {
            leader = self.players[0];
            leaderGames = self.games[0];
            followerGames = self.games[1];
        } else if ( self.games[1] > self.games[0] ) {
            leader = self.players[1];
            leaderGames = self.games[1];
            followerGames = self.games[0];
        } else {
            throw new Error("Illegal state");
        }
        var gameText = ( leaderGames === 1 ) ? "game" : "games";
        self.say(leader + " leads, " + leaderGames + " " + gameText +
            " to " + followerGames);
    });

    return self;

};
