var container = {
    init: function () {
        if ("rooms" in Memory.module && !Memory.module.rooms.re_init) return;
        Memory.module.rooms = {};
        Memory.module.re_init = false;
        
        Memory.module.rooms.ownedRooms = {};
        
        for (var roomname in Game.rooms) {
            //var gameroom = Game.rooms[roomname];
            Memory.module.rooms.ownedrooms[roomname] = {};
        }
        
    },
    
    init_room: function(memroom, gameroom) {
        var structurecount = gameroom.find(FIND_MY_STRUCTURES);
        
    }
    
    do_tick: function () {
        for (var roomname in Memory.module.rooms.ownedRooms) {
            var memroom = Memory.module.rooms.ownedRooms[roomname];
            var gameroom = Game.rooms[roomname];
            
            if (!gameroom) {
                console.log("Room " + roomname + " no longer visible!");
                delete Memory.module.rooms.ownedRooms[roomname];
            } else if (!gameroom.controller.my) {
                console.log("Room " + roomname + " no longer under our control!");
                delete Memory.module.rooms.ownedRooms[roomname];
            } else {
                var controllerlevel = gameroom.controller.level;
                
                
                switch (controllerlevel) {
                    case 1:
                        break;
                        
                    case 2:
                        
                }
                
            }
            
        }
    }
}

module.exports = container;