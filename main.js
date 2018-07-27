var properties = require("properties");

var script_screeps = require("screeps");
var script_spawns  = require("spawns");
var script_sources = require("sources");

module.exports.loop = function () {
    if (! ("module" in Memory)) {
        Memory.module = {};
    }
    
    //console.log("INITS...")
	// inits
	properties.init();

	script_screeps.init();
	script_spawns.init();
	script_sources.init();


    //console.log("TICKS...")
	// do_ticks

	script_spawns.do_tick();
	script_screeps.do_tick();
}