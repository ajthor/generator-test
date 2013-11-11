'use strict';
var util = require('util');
var path = require('path');
var GeneratorMain = require('../lib/generator-main.js');

var _ = require('lodash');

var Generator = module.exports = function Generator(args, options, config) {
	GeneratorMain.apply(this, arguments);

};

util.inherits(Generator, GeneratorMain);

Generator.prototype.updatePackageJSON = function updatePackageJSON() {
	var packageJSON = JSON.parse(this.readFileAsString(path.join(this.destinationRoot(), 'package.json')));
	if(!packageJSON.devDependencies) packageJSON.devDependencies = {};
	
	_.each(this.components, function (component) {
		packageJSON.devDependencies[component] = "*";
	});

	this.write('package.json', JSON.stringify(packageJSON));
};

Generator.prototype.setKarmaConfig = function setKarmaConfig() {
	var karmaConfig = {
		name: this.name,
		version: this.version,

		PORT: 3000,
		
		dir: this.dir,
		dev: this.dev,
		
		components: this.components
	};
};




