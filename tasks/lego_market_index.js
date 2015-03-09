/*
 * grunt-lego-market-index
 * https://github.com/ppxu/grunt-lego-market-index
 *
 * Copyright (c) 2015 PPxu
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    _ = require('lodash'),
    template = require('art-template');

function collecMods(modsDir, callback) {
    var mods = [],
        waiting = 0;

    var actualDir = path.resolve(modsDir);

    fs.readdir(actualDir, function(err, files) {
        if (err || !files || !files.length) {
            return callback(err, mods);
        }

        waiting = files.length;

        files.forEach(function(fileName) {
            var filePath = path.join(actualDir, fileName);
            fs.stat(filePath, function(err, fileStat) {
                if (fileStat && fileStat.isDirectory()) {
                    mods.push(fileName);
                }
                if (!--waiting) {
                    callback(null, mods);
                }
            });
        });
    });
}

function wrapModsWithKMD(config, mods, options) {
    var tab = '    ',
        enter = '\n';

    var modStr = mods.sort().map(function(mod) {
        return '\'' + mod + '\'';
    }).join(', ');


    var packageStr = _.isEmpty(config.dependencies.packages) ? '' : config.dependencies.packages.map(function(pg) {
        return ', {' + enter +
            tab + tab + '\'name\': \'' + pg.name + '\',' + enter +
            tab + tab + '\'base\': \'' + pg.base + '\',' + enter +
            tab + tab + '\'ignorePackageNameInUri\': ' + (pg.ignorePackageNameInUri ? 'true' : 'false') + enter +
            tab + '}';
    }).join('');


    var moduleStr = '';

    if (!_.isEmpty(config.dependencies.modules)) {

        moduleStr += ',' + enter +
            tab + '\'modules\': {' + enter;

        var modulesArr = [];

        _.forEach(config.dependencies.modules, function(value, key) {
            modulesArr.push(tab + tab + '\'' + key + '\': ' + JSON.stringify(value));
        });

        moduleStr += modulesArr.join(',');

        moduleStr += enter + tab + '}';

    }

    template.defaults.extname = '';
    template.defaults.escape = false;

    var output = template(__dirname + '/template/index.tpl', {
        config: config,
        modStr: modStr,
        packageStr: packageStr,
        moduleStr: moduleStr
    });

    return output;
}

function createFile(output, content, callback) {
    fs.writeFile(output, content, function(err) {
        if (err) {
            return callback(err);
        } else {
            callback(null);
        }
    });
}

function createModsFile(config, options, callback) {
    collecMods(options.modsDir, function(err, mods) {
        if (err) {
            return callback(err);
        }

        createFile(options.output, wrapModsWithKMD(config, mods, options), function(err) {
            if (err) {
                return callback(err);
            } else {
                return callback();
            }

        });
    });
}

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('lego_market_index', 'generate the index file of a market package in lego project', function() {
        var done = this.async(),
            options = this.data,
            cfg;

        try {
            cfg = grunt.file.readJSON(options.config);
        } catch (err) {
            grunt.fail.warn(err);
        }

        if (!cfg || !cfg.name || !cfg.version || !cfg.group) {
            grunt.fail.warn('config.json must have name & version & group!');
        }

        createModsFile(cfg, options, function(err, success) {
            if (err) {
                grunt.log.error(err);
            } else {
                grunt.log.ok('file ' + chalk.cyan(options.output) + ' has been created successfuly');
            }
            done();
        });
    });

};