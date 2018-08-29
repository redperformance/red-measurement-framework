const resolve = require("rollup-plugin-node-resolve")
const commonjs = require("rollup-plugin-commonjs")
const uglify = require("rollup-plugin-uglify")
const UglifyJS = require("uglify-es")
const json = require("rollup-plugin-json")
const eslint = require("rollup-plugin-eslint")
const replace = require("rollup-plugin-replace")
const sizes = require("rollup-plugin-sizes")
const filesize = require("rollup-plugin-filesize")
const buble = require('rollup-plugin-buble')

let production = function () {
    return !process.env.ROLLUP_WATCH
}

module.exports = {
    input: 'src/measurement-framework.js',
    sourcemap: false,
    output: {
        name: "measurementFramework",
        file: 'dist/measurement-framework.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        sourcemap: false,
        globals: {
            window: 'window',
            document: 'document'
        }
    },
    treeshake: true,
    external: ['window', 'document'],
    plugins: [
        json(),
        replace({
            "RMFBUILDTIME": new Date().toISOString()
        }),
        resolve({
            module: true, // Default: true
            jsnext: true, // Default: false
            main: true, // Default: true
            browser: true, // Default: false
            extensions: ['.js', '.json'], // Default: ['.js']
            preferBuiltins: true, // Default: true
            modulesOnly: false, // Default: false
            customResolveOptions: {}
        }), // tells Rollup how to find date-fns in node_modules
        commonjs(), // converts date-fns to ES modules
        production() && eslint({}),
        buble(),
        production() && uglify({
            toplevel: true,
            ie8: true,
            sourceMap: false,
            mangle: true,
            compress: {
                toplevel: true,
                drop_console: true
                //reduce_vars: false
            }
        }, UglifyJS.minify), // minify, but only in production
        sizes(),
        filesize()
    ]
}