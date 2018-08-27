import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"
import uglify from "rollup-plugin-uglify"
import {minify} from "uglify-es"
import json from "rollup-plugin-json"
import replace from "rollup-plugin-replace"
import sizes from "rollup-plugin-sizes"
import filesize from "rollup-plugin-filesize"

let production = function () {
    return !process.env.ROLLUP_WATCH
}

export default {
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
        production(),
        babel({
            exclude: [
                //'node_modules/**',
                '*.json'
            ],
            plugins: []
        }),
        production() && uglify({
            toplevel: true,
            ie8: true,
            sourceMap: false,
            mangle: true,
            compress: {
                toplevel: true
                //reduce_vars: false
            }
        }, minify), // minify, but only in production
        sizes({}),
        filesize()
    ]
}