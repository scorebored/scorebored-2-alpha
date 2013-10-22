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
    var app = score.pong.Game({matchLength: 3});
    var talkers = {
        mute: score.talkers.Mute(app.events),
        google: score.talkers.Google(app.events)
    };
    
    app.talker = talkers.mute;
    
    window.pong = app; // Just for console debugging
    
    var log = blackchip.Logging.get("score.pong");
    
    app.events.all(function() { 
        log.trace.apply(log.trace, arguments);
    });
    
    var onNameChange = function() {
        $("#names [data-player='0']").html(app.players[0]);
        $("#names [data-player='1']").html(app.players[1]);
    };
    
    var onScore = function() {
        $("#scores [data-player='0']").html(app.scores[0]);
        $("#scores [data-player='1']").html(app.scores[1]);
    };
    
    var onServer = function() {
        $("#server div").html("&nbsp;");
        if ( !_.isNull(app.server.is) ) {
            $("#server [data-player='" + app.server.is + "']").html("Server");    
        }   
    };
    
    var onGameWin = function() {
        if ( !app.matchOver ) {
            $("#nextGame").css("display", "inline"); 
        }
        $("button.add").attr("disabled", true);   
    };
    
    var onUndoGameWin = function() {
        $("#nextGame").css("display", "none"); 
        $("button.add").attr("disabled", false);             
    };
    
    var onGame = function() {
        $("#games [data-player='0']").html(app.games[0]);
        $("#games [data-player='1']").html(app.games[1]);       
    };
    
    var onSides = function() {
        $("[data-side='0']").attr("data-player", app.sides[0]);
        $("[data-side='1']").attr("data-player", app.sides[1]);
        onNameChange();
        onScore();
        onServer();
        onGame();        
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
        
    app.events
        .on("player", onNameChange)
        .on("score", onScore)
        .on("server", onServer)
        .on("after gameWin", onGameWin)
        .on("undo gameWin", onUndoGameWin)
        .on("game", onGame)
        .on("history", onHistory)
        .on("say", onSay)
        .on("after say", onSilence)
        .on("silence", onSilence)
        .on("seat", onSides);
        
    
    $("button.add").click(function() {
        var player = $(this).attr("data-player");
        if ( _.isNull(app.server.is) ) {
            app.server.is = player;    
        } else {
            app.scores[player] += 1;
        } 
    });

    $("#undo").click(function() {
        app.undo();
    });

    $("#nextGame").click(function() {
        app.games.next();   
        $("button.add").attr("disabled", false);  
        $("#nextGame").css("display", "none");  
    });
    
    $("#talker").change(function() {
        app.talker = talkers[$(this).val()];
    });
    
    $("#setNames input").keyup(function() {
        var player = $(this).attr("data-player");
        var name = $(this).val();
        if ( /^ *$/.test(name) ) {
            name = app.defaultPlayerName(player);
        }
        app.players[player] = name;
    });
           
})();
