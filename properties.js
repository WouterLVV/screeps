var default_settings = {
    exists: true,

    global: {
        max_creeps: 10,
    },

    spawns: {
        default_creep_count: 2
    }
};

var container = {
    init: function () {
        if ("properties" in Memory.module) return;

        Memory.module.properties = default_settings;
        console.log("PROPERTIES INITIALIZED");
    }
};

module.exports = container;