module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            plugin: {
                files: [
                    {
                        expand: true,
                        cwd: "./src",
                        src: ['**/*.less'],
                        dest: './src',
                        ext: '.css'
                    }
                ]
            }
        },
        connect:{
            server:{
                options:{
                    hostname: '0.0.0.0',
                    port: 9090,
                    base: '../../',
                }
            }
        },
        watch: {
            options:{
                livereload: true
            },
            less: {
                files: ["./src/**/*.less"],
                tasks: ["less"]
            },
            html: {
                files: ["./demo/**/*.html"]
            },
            script: {
                files: ["./src/**/*.js"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['less','connect', 'watch']);
};