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

(function() {

    blackchip.ScriptLoader.load([
        "common/lib/jquery.js",
        "common/lib/lodash.js",
        "common/lib/bootstrap/js/bootstrap.js",

        "common/js/blackchip/module.js",
        "common/js/blackchip/console.js",
        "common/js/blackchip/Events.js",
        "common/js/blackchip/Logging.js",
        "common/js/blackchip/Properties.js",

        "common/js/score/Announcer.js",
        "common/js/score/Game.js",

        "common/js/score/tts/changeServers.js",
        "common/js/score/tts/deuce.js",
        "common/js/score/tts/gamePoint.js",
        "common/js/score/tts/gameWinner.js",
        "common/js/score/tts/matchPoint.js",
        "common/js/score/tts/matchStandings.js",
        "common/js/score/tts/matchWinner.js",
        "common/js/score/tts/playerPoint.js",
        "common/js/score/tts/roundPoints.js",
        "common/js/score/tts/score.js",
        "common/js/score/tts/scoreByServer.js",
        "common/js/score/tts/switchSides.js",

        "common/js/score/features/match.js",
        "common/js/score/features/round.js",
        "common/js/score/features/scores.js",
        "common/js/score/features/seats.js",
        "common/js/score/features/server.js",
        "common/js/score/features/sides.js",
        "common/js/score/features/token.js",
        "common/js/score/features/tokenRing.js",        

        "common/js/score/rules/gameWinSwitchSides.js",
        "common/js/score/rules/winGameByTwo.js",
        "common/js/score/rules/winMatchBestOf.js",

        "common/js/score/talkers/Console.js",
        "common/js/score/talkers/Google.js",
        "common/js/score/talkers/Mute.js"
    ]);

})();
