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

    var game = score.pong.Game({matchLength: 3});
    window.pong = game;
    var log = blackchip.Logging.get("score.pong");
    
    pong.events.all(function() { 
        log.trace.apply(log.trace, arguments);
    });
    
    var onScore = function(value, player) {
        $("#scores ." + player).html(value);
        var hasUndo = game.history.length > 0;
        $("#undo").attr("disabled", !hasUndo); 
    };
    
    var onServer = function(player) {
        $("#server div").html("&nbsp;");
        if ( !_.isNull(game.server.is) ) {
            $("#server ." + player).html("Server");    
        }   
    };
    
    var onGameWin = function() {
        if ( !game.matchOver ) {
            $("#nextGame").css("display", "inline"); 
        }
        $("button.add").attr("disabled", true);   
    };
    
    var onGame = function(games, player) {
        $("#matches ." + player).html(games);        
    };
    
    var onHistory = function(history) {
        $("#undo").attr("disabled", history.length === 0);    
    };
    
    game.events
        .on("score", onScore)
        .on("server", onServer)
        .on("after gameWin", onGameWin)
        .on("game", onGame)
        .on("history", onHistory);
    
    $("button.add").click(function() {
        var player = $(this).attr("data-player");
        if ( _.isNull(game.server.is) ) {
            game.server.is = player;    
        } else {
            game.scores[player] += 1;
        } 
    });

    $("#undo").click(function() {
        game.undo();
    });

    $("#nextGame").click(function() {
        game.nextGame();   
        $("button.add").attr("disabled", false);  
        $("#nextGame").css("display", "none");  
    });
            
})();
