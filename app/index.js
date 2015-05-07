'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

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
        var basePath = path.basename(process.env.PWD);
        var appName = this._.camelize(basePath);

        this.log(yosay('\'Hola Hola! Would you mind giving me some info so I can scafold your component?'));

        var prompts = [{
            name: 'componentName',
            message: 'How do you want to call your component? Allowed characters ^[a-zA-Z0-9]+$',
            default: appName,
        },{
            name: 'componentDescription',
            message: 'What is this component about? Short. Straight to the point.',
        },{
            name: 'componentContributor',
            message: 'Who is participating in the project?',
            default: 'Contributor - contributor@mercadolibre.com'
        },{
            type: 'checkbox',
            name: 'features',
            message: 'What more would you like?',
            choices: [{
                name: 'Mesh',
                value: 'includeMesh',
                checked: false
            }]
        }];

        this.prompt(prompts, function(answers) {
            var features = answers.features;

            var hasFeature = function(feat) {
                return features.indexOf(feat) !== -1;
            };

            this.componentName = answers.componentName;
            this.componentDescription = answers.componentDescription;
            this.componentContributor = answers.componentContributor;
            this.includeMesh = hasFeature('includeMesh');

            done();
        }.bind(this));
    },

    writing: {
        miscfiles: function () {
            this.template('_package.json', 'package.json');
            this.template('_bower.json', 'bower.json');
            this.template('README.md','README.md');
            this.copy('_jshintrc', '.jshintrc');
            this.copy('gitignore', '.gitignore');
            this.copy('gitattributes', '.gitattributes');
            this.copy('editorconfig', '.editorconfig');
            this.copy('Makefile','Makefile');
            this.copy('main.js', 'src/scripts/main.js');
            this.copy('mobile-detect.js', 'mobile-detect.js');
            this.copy('yeoman.png', 'src/images/yeoman.png');
        },

        stylesheets: function() {
            this.copy('_demo.scss', 'src/styles/_demo.scss');
            this.copy('_main__small.scss', 'src/styles/_main__small.scss');
            this.copy('_main__medium.scss', 'src/styles/_main__medium.scss');
            this.copy('_main__large.scss', 'src/styles/_main__large.scss');
            this.copy('main.scss', 'src/styles/main.scss');
            this.copy('main__small.scss', 'src/styles/main__small.scss');
            this.copy('main__medium.scss', 'src/styles/main__medium.scss');
            this.copy('main__large.scss', 'src/styles/main__large.scss');
        },

        gulpfile: function() {
            this.template('gulpfile.js');
        },

        writeIndex: function () {
            this.template('index.html', 'index.html');
        }
    },

    install: function() {
        var howToInstall =
            '\nRun ' +
            chalk.yellow.bold('npm install');

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }

        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }
});
