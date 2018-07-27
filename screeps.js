// Creep attributes: memory.home, memory.target

var NAMES = ["Aspect", "Kraken", "Bender", "Lynch", "Big Papa", "Mad Dog", "Bowser", "Bruise", "Psycho", "Cannon", "Ranger", "Clink", "Ratchet", "Cobra", "Reaper", "Colt", "Rigs", "Crank", "Ripley", "Creep", "Roadkill", "Daemon", "Ronin", "Decay", "Rubble", "Diablo", "Sasquatch", "Doom", "Scar", "Dracula", "Shiver", "Dragon", "Skinner", "Fender", "Skull Crusher", "Fester", "Slasher", "Fisheye", "Steelshot", "Flack", "Surge", "Gargoyle", "Sythe", "Grave", "Trip", "Gunner", "Trooper", "Hash", "Tweek", "Hashtag", "Vein", "Indominus", "Void", "Ironclad", "Wardon", "Killer", "Wraith", "Knuckles", "Zero"]

function get_random_from_list(list) {
    return list[Math.floor(Math.random()*list.length)];
}

function general_create(mem) {
    mem.crid = Memory.module.screeps.creep_id;
    Memory.module.screeps.creep_id++;
}

function worker_tick(creep) {
    var home = Game.getObjectById(creep.memory.home);
    var target = Game.getObjectById(creep.memory.target);

    if(creep.carry.energy < creep.carryCapacity) {
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
    else {
        if(creep.transfer(home, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(home);
        }
    }
        
}




var roles = {
    worker: "WORKER"
}

var container = {
    roles: roles,

    init: function () {
        if ("screeps" in Memory.module) return;
        Memory.module.screeps = {};
        Memory.module.screeps.creep_id = 0;
        Memory.module.screeps.creep_map = {};
    },

    do_tick: do_ticks,


    "WORKER": {

        create: function (home, target) {
            var creepmem = {};
            general_create(creepmem);
            creepmem.home = home.id;
            creepmem.target = target.id;
            creepmem.role = roles.worker;
            return creepmem;
        },

        do_tick: worker_tick,

        get_name: function() {return "CREEP_" + Memory.module.screeps.creep_id + "_" + get_random_from_list(NAMES)},

        body: [MOVE, CARRY, WORK]



    }



}


function do_ticks() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!(creep.memory.crid in Memory.module.screeps.creep_map)) {
            Memory.module.screeps.creep_map[creep.memory.crid] = creep.name;
        }
    }
    
    
    for (var crid in Memory.module.screeps.creep_map) {
        var creep = Game.creeps[Memory.module.screeps.creep_map[crid]];
        //console.log("PROCESSING CREEP " + creep.name);
        if (!creep) {
            console.log("Creep does not exist!");
            Game.getObjectById(Memory.creeps[Memory.module.screeps.creep_map[crid]].home).memory.creep_count--;
            Memory.module.sources.sources[Memory.creeps[Memory.module.screeps.creep_map[crid]].target].exploiters--;
            delete Memory.creeps[Memory.module.screeps.creep_map[crid]];
            delete Memory.module.screeps.creep_map[crid];
            
        } else {
            var role = creep.memory.role;
            container[role].do_tick(creep);
        }
    }
}

module.exports = container;