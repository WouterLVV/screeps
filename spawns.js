

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
        spawn.memory.creep_count = {};
        spawn.memory.target_creep_count = {};
        for (var rolename in script_screeps.roles) {
            var role = script_screeps.roles[rolename];
            console.log(role);
            spawn.memory.creep_count[role] = 0;
            spawn.memory.target_creep_count[role] = properties.spawns.default_creep_count[role];
        }

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
            let cannotspawn = spawn.spawning;
            
            if (!spawn) {
                console.log("Spawn no longer exists");
                delete Memory.module.spawns.spawns[spid];
            } else {
                //console.log("PROCESSING SPAWN " + spawn.name);
                for (var rolename in script_screeps.roles) {
                    var rolestr = script_screeps.roles[rolename];
                    var role = script_screeps[rolestr];
                    //console.log("Checking role " + rolestr + " -- " + role);
                    if (spawn.memory.creep_count[rolestr] < spawn.memory.target_creep_count[rolestr] && !cannotspawn) {
                        console.log("WANTING TO CREATE " + rolestr);
                        
                        var cancreate = spawn.spawnCreep(role.body,"TEST",{dryRun: true});
                        if (cancreate == OK) {
                            console.log("RESOURCES OK");
                            
                            switch(rolestr) {
                                case script_screeps.roles.worker:
                                    if (spawn.memory.source_count > 0) {
                                        var target_source = Game.getObjectById(get_least_exploited_source(spawn));
                                        
                                        if (spawn.spawnCreep(role.body, role.get_name(), {memory: role.create(spawn, target_source)}) == OK) {
                                            spawn.memory.creep_count[rolestr]++;
                                            Memory.module.sources.sources[target_source.id].exploiters++;
                                            cannotspawn = true;
                                        }
                                    }
                                    break;
                                case script_screeps.roles.upgrader:
                                    if (spawn.spawnCreep(role.body, role.get_name(), {memory: role.create(spawn, spawn.room.controller)}) == OK) {
                                            spawn.memory.creep_count[rolestr]++;
                                            cannotspawn = true;
                                        }
                                    break;
                                default:
                                    console.log("UNKOWN ROLE!");
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = container;