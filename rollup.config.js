import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"
import uglify from "rollup-plugin-uglify"
import {minify} from "uglify-es"
import json from "rollup-plugin-json"
import eslint from "rollup-plugin-eslint"
import replace from "rollup-plugin-replace"
import sizes from "rollup-plugin-sizes"
import filesize from "rollup-plugin-filesize"
// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false

let production = function () {
    let prod = !process.env.ROLLUP_WATCH
    console.log(prod)
    return prod

}

/*
const babel_preset = {
    presets: [
        ["@babel/preset-env", {
            "targets": {
                "browsers": ["> 0.5%"]
            }
        }]
    ]
};

{
            exclude: [
                'node_modules/**',
                '*.json'
            ],
            plugins: ["lodash"]
        }
*/
export default {
    input: 'src/ajax-complete-jquery.js',
    sourcemap: false,
    output: {
        name: "measurementFramework",
        file: 'public/measurement-framework.js',
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
        eslint({}),
        babel({
            exclude: [
                'node_modules/**',
                '*.json'
            ],
            plugins: ["lodash"]
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