

var script_screeps = require("screeps");

var script_sources = require("sources");

function get_least_exploited_source(spawn) {
    var least = spawn.memory.source_ids[0];
    for (var plpl in spawn.memory.source_ids) {
        var soid = spawn.memory.source_ids[plpl];
        if (Memory.module.sources.sources[soid].exploiters < Memory.module.sources.sources[least].exploiters) {
            least = soid;
        }
    }
    return least;
}

var container = {
    init: function () {
        if ("spawns" in Memory.module) return;
        Memory.module.spawns = {};
        Memory.module.spawns.exists = true;
        Memory.module.spawns.spawn_id = 0;
        Memory.module.spawns.spawns = {};
    },

    init_spawn: function (spawn) {
        if (spawn.memory.exists) return;
        var properties = Memory.module.properties;
        spawn.memory.exists = true;
        spawn.memory.spid = Memory.module.spawns.spawn_id;
        Memory.module.spawns.spawn_id++;
        Memory.module.spawns.spawns[spawn.memory.spid] = spawn.id;
        spawn.memory.creep_count = 0;
        spawn.memory.target_creep_count = properties.spawns.default_creep_count;

        var sources = spawn.room.find(FIND_SOURCES);
        var mod_source = Memory.module.sources.sources;

        spawn.memory.source_count = sources.length;
        spawn.memory.source_ids = [];

        for (var i = 0; i < spawn.memory.source_count; i++) {
            spawn.memory.source_ids.push(sources[i].id);
            if (! mod_source[sources[i].id]) {
                mod_source[sources[i].id] = script_sources.defaults;
            }
        }

    },

    do_tick: function () {
        for (var name in Game.spawns) {
            var spawn = Game.spawns[name];
            container.init_spawn(spawn);
        }

        for (var spid in Memory.module.spawns.spawns) {
            var spawn = Game.getObjectById(Memory.module.spawns.spawns[spid]);
            
            if (!spawn) {
                console.log("Spawn no longer exists");
                delete Memory.module.spawns.spawns[spid];
            } else {
                //console.log("PROCESSING SPAWN " + spawn.name);
                if (spawn.memory.creep_count < spawn.memory.target_creep_count && !spawn.spawning) {
                    console.log("WANTING TO CREATE CREEP");
                    var workers = script_screeps[script_screeps.roles.worker];
                    var cancreate = spawn.spawnCreep(workers.body,"TEST",{dryRun: true});
                    if (cancreate == OK && spawn.memory.source_count > 0) {
                        console.log("SPAWNING CREEP");
                        
                        var target_source = Game.getObjectById(get_least_exploited_source(spawn));

                        

                        if (spawn.spawnCreep(workers.body, workers.get_name(), {memory: workers.create(spawn, target_source)}) == OK) {
                            spawn.memory.creep_count++;
                            Memory.module.sources.sources[target_source.id].exploiters++;
                        }
                    }
                }
            }
        }
    }
}

module.exports = container;