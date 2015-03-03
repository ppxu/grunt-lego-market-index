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
    _ = require('lodash');

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

    var start =
        'KISSY.config({' + enter +
        tab + '\'' + config.name + '\': {' + enter +
        tab + tab + 'mods: [';


    var prefix = options.assetsPrefix || 'http://g.alicdn.com/';
        
    var modsArr = mods.sort().map(function(mod) {
        return '\'' + mod + '\'';
    }).join(', ');

    var middle =
        ']' + enter +
        tab + '},' + enter;

    var packages =
        tab + '\'packages\': [{' + enter +
        tab + tab + '\'name\': \'' + config.name + '\',' + enter +
        tab + tab + '\'base\': \''+ prefix + config.name + '/' + config.version + '\',' + enter +
        tab + tab + '\'ignorePackageNameInUri\': true' + enter +
        tab + '}';

    var pkgArr = _.isEmpty(config.dependencies.packages) ? '' : config.dependencies.packages.map(function(pg) {
        return ', {' + enter +
            tab + tab + '\'name\': \'' + pg.name + '\',' + enter +
            tab + tab + '\'base\': \'' + pg.base + '\',' + enter +
            tab + tab + '\'ignorePackageNameInUri\': ' + (pg.ignorePackageNameInUri ? 'true' : 'false') + enter +
            tab + '}';
    }).join('');

    var pkgEnd = ']';

    var modules = '';

    if (!_.isEmpty(config.dependencies.modules)) {

        modules += ',' + enter +
            tab + '\'modules\': {' + enter;

        var modulesArr = [];

        _.forEach(config.dependencies.modules, function(value, key) {
            modulesArr.push(tab + tab + '\'' + key + '\': ' + JSON.stringify(value));
        });

        modules += modulesArr.join(',');

        modules += enter + tab + '}';

    }

    var end = enter + '});';

    return start + modsArr + middle + packages + pkgArr + pkgEnd + modules + end;
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

        if (!cfg || !cfg.name || !cfg.version) {
            grunt.fail.warn('config.json must have name & version!');
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