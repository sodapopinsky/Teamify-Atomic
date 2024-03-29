module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-html2js');

    // Default task.
    grunt.registerTask('default', ['jshint','build','karma:unit']);
    grunt.registerTask('buildsass', ['sass']);
    grunt.registerTask('build', ['html2js','concat','copy:assets']);
    grunt.registerTask('release', ['clean','html2js','uglify','karma:unit','concat:index', 'recess:min','copy:assets']);
    grunt.registerTask('test-watch', ['karma:watch']); //'jshint'
    grunt.loadNpmTasks('grunt-contrib-sass');
    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    var karmaConfig = function(configFile, customOptions) {
        var options = { configFile: configFile, keepalive: true };
        var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
        return grunt.util._.extend(options, customOptions, travisOptions);
    };

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        banner:
        '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
        ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        src: {
            js: ['src/**/*.js'],
            jsTpl: ['<%= distdir %>/templates/**/*.js'],
            specs: ['test/**/*.spec.js'],
            scenarios: ['test/**/*.scenario.js'],
            html: ['src/index.html'],
            tpl: {
                app: ['src/app/**/*.tpl.html'],
                common: ['src/common/**/*.tpl.html']
            },

            sass: ['src/sass/style.scss'],
            sassWatch: ['src/sass/**/*.scss'],
            less: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
            lessWatch: ['src/less/**/*.less']
        },
        clean: ['<%= distdir %>/*'],
        copy: {
            assets: {
                files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
            }
        },
        sass: {
            dist: {

                files: {
                    '<%= distdir %>/style.css' : ['<%= src.sass %>']
                }
            }
        },
        karma: {
            unit: { options: karmaConfig('test/config/unit.js') },
            watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
        },
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= src.tpl.app %>'],
                dest: '<%= distdir %>/templates/app.js',
                module: 'templates.app'
            },
            common: {
                options: {
                    base: 'src/common'
                },
                src: ['<%= src.tpl.common %>'],
                dest: '<%= distdir %>/templates/common.js',
                module: 'templates.common'
            }
        },
        concat:{
            dist:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>', '<%= src.jsTpl %>'],
                dest:'<%= distdir %>/<%= pkg.name %>.js'
            },
            index: {
                src: ['src/index.html'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            },
            vendor: {
                src:['bower_components/angular-resource/angular-resource.min.js',
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/sweetalert/dist/sweetalert.min.js',
                    'bower_components/satellizer/satellizer.min.js',
                    'bower_components/ocModal/dist/ocModal.min.js',
                    'bower_components/moment/moment.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js'],
                dest: '<%= distdir %>/vendor.js'
            },
            vendor_css: {
                src:['bower_components/components-font-awesome/css/font-awesome.min.css',
                    'bower_components/sweetalert/dist/sweetalert.css',
                    'bower_components/ocModal/dist/css/ocModal.light.min.css',
                    'bower_components/ocModal/dist/css/ocModal.animations.min.css'],
                dest: '<%= distdir %>/vendor.css'
            },
            angular: {
                src:['bower_components/angular/angular.js','bower_components/angular-ui-router/release/angular-ui-router.min.js'],
                dest: '<%= distdir %>/angular.js'
            },
            jquery: {
                src:['vendor/jquery/*.js'],
                dest: '<%= distdir %>/jquery.js'
            }
        },
        uglify: {
            dist:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
                dest:'<%= distdir %>/<%= pkg.name %>.js'
            },
            angular: {
                src:['<%= concat.angular.src %>'],
                dest: '<%= distdir %>/angular.js'
            },
            mongo: {
                src:['vendor/mongolab/*.js'],
                dest: '<%= distdir %>/mongolab.js'
            },
            bootstrap: {
                src:['vendor/angular-ui/bootstrap/*.js'],
                dest: '<%= distdir %>/bootstrap.js'
            },
            jquery: {
                src:['vendor/jquery/*.js'],
                dest: '<%= distdir %>/jquery.js'
            }
        },
        recess: {
            build: {
                files: {
                    '<%= distdir %>/<%= pkg.name %>.css':
                        ['<%= src.less %>'] },
                options: {
                    compile: true
                }
            },
            min: {
                files: {
                    '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
                },
                options: {
                    compress: true
                }
            }
        },
        watch:{
            main: {
                files:['<%= src.js %>', '<%= src.specs %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
                tasks:['build','timestamp'],

                options: {
                    livereload: true
                }
            },
            sass:{
                files:['<%= src.sassWatch %>'],
                tasks:['buildsass','timestamp'],
                options: {
                    livereload: true
                }
            },
            build: {
                files:['<%= src.js %>', '<%= src.specs %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
                tasks:['build','timestamp'],
                options: {
                    livereload: true
                }
            }
        },

        jshint:{
            files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
            options:{
                curly:false,
                eqeqeq:true,
                immed:true,
                latedef: false,
                newcap:true,
                noarg:true,
                sub:true,
                boss:true,
                eqnull:true,
                "-W065": true,
                globals:{}
            }
        }
    });

};
