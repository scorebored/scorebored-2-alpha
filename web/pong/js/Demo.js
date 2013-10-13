var pong = score.pong.Driver();
score.pong.Announcer(pong, score.talkers.Console());

pong.players.events.on("name", function(event) {
    console.log(event.previous, "is now", event.name);        
});

pong.demo = function() {    
    var ken = pong.players(0);
    ken.name("Ken");
    var mcg = pong.players(1);
    mcg.name("McG");

    pong.server(ken);
    
    pong.points.award(ken);
    pong.points.award(ken);
    pong.points.award(mcg);
};


