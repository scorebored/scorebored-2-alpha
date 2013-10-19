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

var score = score || {};
score.tts = score.tts || {};

score.tts.matchStandings = score.tts.matchStandings || function(self) {

    var game = self.game;

    var allowed = function(event) {
        if ( game.matchOver ) {
            return false;
        }
        return true;
    };

    self.events.on("after gameWin", function(event) {
        if ( !allowed(event) ) {
            return;
        }
        if ( game.match[0] === game.match[1] ) {
            self.say("Games tied at " + game.match[0]);
            return;
        }
        var leader, leaderGames, followerGames;
        if ( game.match[0] > game.match[1] ) {
            leader = game.players[0];
            leaderGames = game.match[0];
            followerGames = game.match[1];
        } else if ( game.match[1] > game.match[0] ) {
            leader = games.players[1];
            leaderGames = game.match[1];
            followerGames = game.match[0];
        } else {
            throw new Error("Illegal state");
        }
        var gameText = ( leaderGames === 1 ) ? "game" : "games";
        self.say(leader + " leads, " + leaderGames + " " + gameText +
            " to " + followerGames);
    });

    return self;

};