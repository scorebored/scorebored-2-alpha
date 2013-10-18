
var score = score || {};
score.features = score.features || {};

score.features.Server = score.features.Server || function(self) {

    self.server = blackchip.Properties({
        is: null
    }, self.events, "server");

    self.changeServer = function() {
        if ( !self.rollback ) {
            self.server.is = (self.server.is + 1) % 2;
        }
    };
        
    self.events.on("server", function(event, name) {
        self.record(name, event);
    });
    
    self.events.on("undo server", function(event, name) {
        self.server.is = event.previous;
        self.undo();        
    });
        
    return self;
        
};
