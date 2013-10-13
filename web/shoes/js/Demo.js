var shoes = score.shoes.Driver({
    matchLength: 3
});
shoes.log = blackchip.Logging.get("score.shoes.demo");

shoes.players.events.all(function(args, event) {
    shoes.log.debug("EVENT", event, args);    
});
shoes.round.events.all(function(args, event) {
    shoes.log.debug("EVENT", event, args);
});
shoes.match.events.all(function(args, event) {
    shoes.log.debug("EVENT", event, args);
});

shoes.demo = function(debugging) {
    if ( debugging ) {
        blackchip.Logging.debug("score.shoes.demo");
    } else {
        blackchip.Logging.disable("score.shoes.demo");
    }
    
    var g = shoes;
     
    var pat = g.players(0);
    pat.name("Pat");
    var mcg = g.players(1);
    mcg.name("McG");
    
    var award = g.round.award;
    var commit = function () {
        g.round.commit();
        shoes.log.debug(g.match());
    };
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
    award({player: mcg, value: 1, type: "close"});
    award({player: pat, value: 3, type: "ringer"});
    commit();
    
    award({player: mcg, value: 1, type: "close"});
    award({player: pat, value: 3, type: "ringer"});
    commit();
    
    award({player: mcg, value: 1, type: "close"});
    award({player: pat, value: 3, type: "ringer"});
    commit();
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
    g.match.nextGame();
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
    award({player: mcg, value: 1, type: "close"});
    award({player: pat, value: 3, type: "ringer"});
    commit();
    
    award({player: mcg, value: 1, type: "close"});
    award({player: pat, value: 3, type: "ringer"});
    commit();
    
    award({player: mcg, value: 1, type: "close"});
    award({player: pat, value: 3, type: "ringer"});
    commit();
    
    award({player: mcg, value: 3, type: "ringer"});
    award({player: pat, value: 1, type: "close"});
    commit();
    
};

