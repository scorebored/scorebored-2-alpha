var score = score || {}; 
score.features = score.features || {};

score.features.Sides = score.features.Sides || function(self) {

    self.sides = blackchip.Properties({
        0: 0,
        1: 1
    }, self.events, "side");
    
    self.switchSides = function() {
        self.sides[0] = (self.sides[0] + 1) % 2;
        self.sides[1] = (self.sides[1] + 1) % 2;   
        self.events.trigger("switchSides", {
            sides: self.sides
        });       
    };
    
    self.events.on("before nextGame", self.switchSides);
    
    return self; 
};
