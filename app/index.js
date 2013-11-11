'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var _ = require('lodash');

var Generator = module.exports = function Generator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.hookFor('test:boilerplate', {
		args: args,
		options: {
			options: {
				"dont-ask": this.options["dont-ask"] || true
			}
		}
	});

	this.hookFor('test:common', {
		args: args,
		options: {
			options: {
				"dont-ask": this.options["dont-ask"] || true
			}
		}
	});

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor() {
	// If the argument 'dont-ask' was set, return.
	if(this.options["dont-ask"]===true) return;

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var done = this.async();

	var prompts = [{
		type: 'confirm',
		name: 'node',
		message: "Do you want to run node unit tests as well?",
		default: false
	}, {
		type: 'list',
		name: 'engine',
		message: "What testing engine do you want to use?",
		choices: [
		{
			name: 'Jasmine',
			value: 'jasmine'
		}, {
			name: 'Mocha',
			value: 'mocha'
		}]
	}, {
		type: 'checkbox',
		name: 'components',
		message: "What other components do you want to add?",
		choices: [
		// Add new component choices here in this array.
		// 'value' is the name of the library to include in the bower config file.
		{
			name: 'Karma',
			value: ['karma']
		}, {
			name: 'Chai (Assertions Library)',
			value: ['chai']
		}, {
			name: 'Istanbul (Code Coverage)',
			value: 'istanbul'
		}]
	}];

	this.prompt(prompts, function (results) {
		// Set components to an empty array.
		this.components = [];
		// Add testing engine.
		if(results.engine === 'jasmine') {
			this.components.push('grunt-contrib-jasmine');
			if(results.node === true) {
				this.components.push('jasmine-node');
				this.components.push('grunt-jasmine-node');
			}
		} else {
			// Mocha
			this.components.push('mocha');
			this.components.push('grunt-mocha');
			if(results.components.indexOf('istanbul') !== -1) {
				this.components.push('mocha-istanbul');
				this.components.push('grunt-mocha-istanbul');
			}
		}
		// Add components which the user selected.
		_.each(results.components, function (component) {
			if(_.isArray(component)) {
				this.components = _.union(this.components, component);
			}
			else this.components.push(component);
		}, this);
		// And send the components to the configuration file.
		this.config.set("components", this.components);
		this.config.forceSave();

		// WARNING: Need this async 'done' call to ensure hooks work.
		done();
	}.bind(this));


};



