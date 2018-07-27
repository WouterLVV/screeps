var container = {
    init: function () {
        if ("sources" in Memory.module) return;
        Memory.module.sources = {};
        Memory.module.sources.exists = true;
        Memory.module.sources.sources = {};
    },

    defaults: {
    	exploiters: 0
    }
};

module.exports = container;