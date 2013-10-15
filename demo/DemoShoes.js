var shoes = score.shoes.Game();
score.shoes.Announcer(shoes, score.talkers.Console());

(function() {
    var listener = function(event, name) { console.log(name, event); };

    //shoes.events.all(function(event, name) { console.log("ALL", name, event); });

})();

shoes.demo = function() {
    var game = shoes;

    var pat = 0;
    game.players[pat] = "Pat";
    var mcg = 1;
    game.players[mcg] = "McG";

    game.ringer(mcg);
    game.endRound();

    game.leaner(mcg);
    game.close(pat);
    game.endRound();

    game.ringer(mcg);
    game.ringer(pat);
    game.close(pat);
    game.endRound();

    game.ringer(mcg);
    game.ringer(pat);
    game.endRound();

};

pong.demo.undo = function() {
};



