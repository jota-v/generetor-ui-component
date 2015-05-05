'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);

        this.option('skip-install', {
            desc: 'Skips the installation of dependencies',
            type: Boolean
        });

    },

    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var done = this.async();

        this.log(yosay('\'Hello Tiger! Out of the box I include a gulpfile.js to build your component.'));

        var prompts = [{
            type: 'checkbox',
            name: 'features',
            message: 'What more would you like?',
            choices: [{
                name: 'Mesh',
                value: 'includeMesh',
                checked: true
            }, {
                name: 'Chico',
                value: 'includeChico',
                checked: true
            }]
        }];

        this.prompt(prompts, function(answers) {
            var features = answers.features;

            var hasFeature = function(feat) {
                return features.indexOf(feat) !== -1;
            };

            this.includeSass = hasFeature('includeSass');
            this.includeChico = hasFeature('includeChico');

            done();
        }.bind(this));
    },

    writing: {
        miscfiles: function () {
            this.template('_package.json', 'package.json');
            this.template('editorconfig', '.editorconfig');
            this.template('README.md');
            this.template('Makefile');
        },

        gulpfile: function() {
            this.template('gulpfile.js');
        },

        gitfiles: function() {
            this.copy('gitignore', '.gitignore');
            this.copy('gitattributes', '.gitattributes');
        },

        bower: function() {
            var bower = {
                name: this._.slugify(this.appname),
                private: true,
                devDependencies: {}
            };

            bower.devDependencies.mobileDetect = "hgoebl/mobile-detect.js#~1.0.0";

            if (this.includeChico) {
                bower.devDependencies.jquery = '~2.1.1';
                bower.devDependencies.chico = "https://github.com/mercadolibre/chico.git";
            }

            if (this.includeSass) {
                bower.devDependencies.bourbon = '~4.2.2';
            }

            this.copy('bowerrc', '.bowerrc');
            this.write('bower.json', JSON.stringify(bower, null, 2));
        },

        stylesheets: function() {
            if (this.includeSass) {
                this.copy('_demo.scss', 'src/styles/_demo.scss');
                this.copy('main.scss', 'src/styles/main.scss');
                this.copy('main__small.scss', 'src/styles/main__small.scss');
                this.copy('main__medium.scss', 'src/styles/main__medium.scss');
                this.copy('main__large.scss', 'src/styles/main__large.scss');
            } else {
                this.copy('main.css', 'src/styles/main.css');
                this.copy('main__small.css', 'src/styles/main__small.css');
                this.copy('main__medium.css', 'src/styles/main__medium.css');
                this.copy('main__large.css', 'src/styles/main__large.css');
            }
        },

        img: function() {
            this.copy('yeoman.png', 'src/images/yeoman.png');
        },

        writeIndex: function () {
            this.template('index.html', 'src/index.html');
        },

        app: function() {
            this.mkdir('src');
            this.mkdir('src/scripts');
            this.mkdir('src/styles');
            this.mkdir('src/images');
            this.copy('main.js', 'src/scripts/main.js');
        }
    },

    install: function() {
        var howToInstall =
            '\nAfter running ' +
            chalk.yellow.bold('npm install & bower install') +
            ', inject your' +
            '\nfront end dependencies by running ' +
            chalk.yellow.bold('gulp wiredep') +
            '.';

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }

        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }
});
