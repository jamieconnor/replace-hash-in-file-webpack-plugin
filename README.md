## Webpack plugin: replace-hash-in-file-webpack-plugin

This is a [webpack](http://webpack.github.io/) plugin that can replace content in file(s) after compilation is done. This is useful when you want to replace content in any kind of files(html, css, js etc) which are not processed by loaders.

Use \[hash] to insert the compilation hash into the search and replace when it is a string or a method returning a string i.e. not a regex.

This is heavily based off [replace-in-file-webpack-plugin](https://github.com/oyslin/replace-in-file-webpack-plugin)

Installation
============
Install the plugin with npm:
```shell
$ npm install replace-hash-in-file-webpack-plugin --save-dev
```

Basic Usage
===========
Add the plugin to your webpack and config as follows:

```javascript
    const ReplaceHashInFileWebpackPlugin = require('replace-hash-in-file-webpack-plugin');
    const webpackConfig = {
        entry: 'index.js',
        output: {
            path: __dirname + '/dist',
            filename: 'index_bundle.js'
        },
        plugins: [
            new ReplaceHashInFileWebpackPlugin([{
                dir: 'dist',
                files: ['index.html', 'main.html'],
                rules: [{
                    search: /js\/bundle\.*[a-zA-Z0-9]*\.js/,
                    replace: 'js/bundle.[hash].js'
                },{
                    search: /@title/,
                    replace: 'page title!'
                }]
            }, {
                dir: 'dist/style',
                test: /\.html$/,
                rules: [{
                    search: /version/ig,
                    replace: '1.0.0'
                },{
                    search: '@title',
                    replace: function(match){

                    }
                }]
            },{
                dir: 'dist/style',
                test: [/\.css$/, /\.txt/],
                rules: [{
                    search: /version/ig,
                    replace: '1.0.0'
                },{
                    search: '@title',
                    replace: 'webpack'
                }]
            }])
        ]
    };
```

Configuration
=============

You can pass an array of configuration options to `ReplaceHashInFileWebpackPlugin`. Each configuration has following items:

- `dir`: Optional. Base dir to find the files, if not provided, use the root of webpack context.
- `files`: Optional. Files in `dir` to find for replacement.
- `test`: Optional. Regex expression or Regex expressions array to match files in `dir`.
- `rules`: Required. Replace content rules array. Each rule has `search` and `replace` properties.
- `search`: Required. String or Regex expression used for searching content in files - use \[hash] to replace hash in string.
- `replace`: Required. String or funcion used for replacing the searching content - use \[hash] to replace hash in string.

# License

This project is licensed under [MIT](https://github.com/oyslin/replace-hash-in-file-webpack-plugin/blob/master/LICENSE).
