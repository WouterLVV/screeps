var script_screeps = require('screeps');

var default_settings = {
    exists: true,

    global: {
        max_creeps: 10,
    },

    spawns: {
        default_creep_count: {}
    }
};

var container = {
    init: function () {
        if ("properties" in Memory.module) return;
        
        default_settings.spawns.default_creep_count[script_screeps.roles.worker] = 2;
        default_settings.spawns.default_creep_count[script_screeps.roles.upgrader] = 1;
        

        Memory.module.properties = default_settings;
        console.log("PROPERTIES INITIALIZED");
    }
};

module.exports = container;