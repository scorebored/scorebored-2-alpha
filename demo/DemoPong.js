var pong = score.pong.Game();
score.pong.Announcer(pong, score.talkers.Console());

(function() {
    var listener = function(event, name) { console.log(name, event); };

    //pong.events.all(function(event, name) { console.log("ALL", name, event); });
    /*
    pong.events
        .on("player", listener)
        .on("server", listener)
        .on("score", listener)
        .on("switchSides", listener)
        .on("match", listener)
        .on("gameWin", listener)
        .on("matchWin", listener);

    pong.events
        .on("undo matchWin", listener)
        .on("undo gameWin", listener)
        .on("undo match", listener)
        .on("undo switchSides", listener)
        .on("undo score", listener)
        .on("undo server", listener);
    */

})();

pong.demo = function() {
    var game = pong;
    game.options.matchLength = 3;
    
    var ken = 0;
    game.players[ken] = "Ken";
    var mcg = 1;
    game.players[mcg] = "McG";

    game.server.is = ken;

    var point = function(player) {
        game.scores[player]++;
        console.log(" ");
    };

    for ( var i = 0; i < 11; i++ ) {
        point(ken);
    }

    game.nextGame();
    for ( var i = 0; i < 10; i++ ) {
        point(ken);
        point(mcg);
    }
    point(ken);
    point(mcg);
    point(mcg);
    point(mcg);

    game.nextGame();
    for ( var i = 0; i < 11; i++ ) {
        point(ken);
    }
};

pong.demo.undo = function() {
    var game = pong;

    for ( var i = 0; i < 11 + 11; i++ ) {
        game.undo();
        //game.status();
    }
};



