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
        "lib/jquery.js",
        "lib/lodash.js",
        "lib/bootstrap/js/bootstrap.js",
        "lib/jquery.countdown.js",
        "lib/jquery.fittext.js",

        "old_common/js/blackchip/module.js",
        "old_common/js/blackchip/console.js",
        "old_common/js/blackchip/Events.js",
        "old_common/js/blackchip/Logging.js",
        "old_common/js/blackchip/Properties.js",

        "old_common/js/score/Game.js",
        "old_common/js/score/util.js",

        "old_common/js/score/tts/changeServers.js",
        "old_common/js/score/tts/deuce.js",
        "old_common/js/score/tts/gamePoint.js",
        "old_common/js/score/tts/gameWinner.js",
        "old_common/js/score/tts/matchPoint.js",
        "old_common/js/score/tts/matchStandings.js",
        "old_common/js/score/tts/matchWinner.js",
        "old_common/js/score/tts/playerPoint.js",
        "old_common/js/score/tts/roundPoints.js",
        "old_common/js/score/tts/score.js",
        "old_common/js/score/tts/scoreByServer.js",
        "old_common/js/score/tts/switchSides.js",

        "old_common/js/score/features/match.js",
        "old_common/js/score/features/round.js",
        "old_common/js/score/features/scores.js",
        "old_common/js/score/features/seats.js",
        "old_common/js/score/features/server.js",
        "old_common/js/score/features/sides.js",
        "old_common/js/score/features/timer.js",
        "old_common/js/score/features/token.js",
        "old_common/js/score/features/tokenRing.js",

        "old_common/js/score/rules/gameWinServer.js",
        "old_common/js/score/rules/gameWinSwitchSides.js",
        "old_common/js/score/rules/winGameByTwo.js",
        "old_common/js/score/rules/winMatchBestOf.js",

        "old_common/js/score/talkers/Console.js",
        "old_common/js/score/talkers/Google.js",
        "old_common/js/score/talkers/Mute.js"
    ]);

})();
