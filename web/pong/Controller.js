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
    var pong = score.pong.Game({matchLength: 3});
    var talkers = {
        mute: score.talkers.Mute(pong.events),
        google: score.talkers.Google(pong.events)
    };
    
    pong.talker = talkers.mute;
    
    window.pong = pong; // Just for console debugging
    
    var log = blackchip.Logging.get("score.pong");
    
    pong.events.all(function() { 
        log.trace.apply(log.trace, arguments);
    });
    
    var onScore = function(value, player) {
        $("#scores ." + player).html(value);
    };
    
    var onServer = function(player) {
        $("#server div").html("&nbsp;");
        if ( !_.isNull(pong.server.is) ) {
            $("#server ." + player).html("Server");    
        }   
    };
    
    var onGameWin = function() {
        if ( !pong.matchOver ) {
            $("#nextGame").css("display", "inline"); 
        }
        $("button.add").attr("disabled", true);   
    };
    
    var onUndoGameWin = function() {
        $("#nextGame").css("display", "none"); 
        $("button.add").attr("disabled", false);             
    };
    
    var onGame = function(games, player) {
        $("#matches ." + player).html(games);        
    };
    
    var onHistory = function(history) {
        $("#undo").attr("disabled", history.length === 0);    
    };
    
    var onSay = function(text) {
        $("#announcement").html(text);    
    };

    var onSilence = function(text) {
        $("#announcement").html("&nbsp");    
    };
        
    pong.events
        .on("score", onScore)
        .on("server", onServer)
        .on("after gameWin", onGameWin)
        .on("undo gameWin", onUndoGameWin)
        .on("game", onGame)
        .on("history", onHistory)
        .on("say", onSay)
        .on("after say", onSilence)
        .on("silence", onSilence);
        
    
    $("button.add").click(function() {
        var player = $(this).attr("data-player");
        if ( _.isNull(pong.server.is) ) {
            pong.server.is = player;    
        } else {
            pong.scores[player] += 1;
        } 
    });

    $("#undo").click(function() {
        pong.undo();
    });

    $("#nextGame").click(function() {
        pong.games.next();   
        $("button.add").attr("disabled", false);  
        $("#nextGame").css("display", "none");  
    });
    
    $("#talker").change(function() {
        pong.talker = talkers[$(this).val()];
    });
           
})();
