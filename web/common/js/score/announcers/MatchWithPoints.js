score.announcers = score.announcers || {};

score.announcers.MatchWithPoints = 
        score.announcers.MatchWithPoints || function(engine, talker) {
            
    var self = {};
    var say = talker.say;
    var events = engine.events;
    
    events.on("score") = function(events) {
        say()    ;
    };
    
};
