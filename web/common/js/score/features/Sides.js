var score = score || {}; 
score.features = score.features || {};

score.features.Sides = score.features.Sides || function(self) {

    self.sides = blackchip.Properties({
        0: 0,
        1: 1
    }, self.events, "side");
    
    self.switchSides = function() {
        if ( self.rollback ) {
            return;
        }
        self.sides[0] = (self.sides[0] + 1) % 2;
        self.sides[1] = (self.sides[1] + 1) % 2;   
        var event = { sides: self.sides };
        self.events.trigger("switchSides", event);
        self.record("switchSides", event);       
    };
    
    self.events.on("before nextGame", self.switchSides);
    
    self.events.on("undo switchSides", function() {
        self.sides[0] = (self.sides[0] + 1) % 2;
        self.sides[1] = (self.sides[1] + 1) % 2; 
        self.undo();             
    });
    
    return self; 
};
