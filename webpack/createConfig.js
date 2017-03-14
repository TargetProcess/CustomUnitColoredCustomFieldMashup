const path = require('path');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const tmp = require('tmp');

const TargetprocessMashupPlugin = require('targetprocess-mashup-webpack-plugin');

const pkg = require('../package.json');
const tmpFile = tmp.fileSync();

const createConfig = (options_) => {

    const options = Object.assign({
        mashupName: pkg.name,
        production: false,
        mashupManager: false
    }, options_);

    const mashupName = options.mashupName;

    const config = {
        context: path.resolve(__dirname, '../src'),
        entry: {
            index: [
                './index.js',
                `!!targetprocess-mashup-webpack-plugin/config-loader?libraryTarget=${mashupName}&parse=false&outputFile=./mashup.config.js!./config.json`
            ].concat(options.mashupManager ? [] : [
                '!!targetprocess-mashup-webpack-plugin/manifest-loader!./manifest.json',
                `file?name=./chunks/mashup.ignore!${tmpFile.name}`
            ])
        }
    };

    config.output = {
        filename: '[name].js',
        path: 'build',
        chunkFilename: 'chunks/[id].[name].[hash].js',
        pathinfo: !options.production,
        jsonpFunction: `webpackJsonp_mashup_${mashupName.replace(/-/g, '_')}`
    };

    const localIdentName = options.production ? '[hash:base64]' : '[name]---[local]---[hash:base64:5]';

    config.module = {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            //loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loaders: [
                'style',
                `css?modules&importLoaders=1&localIdentName=${localIdentName}`,
                'postcss'
            ]
        }, {
            test: /\.html$/,
            loader: 'html?minimize=true'
        }]
    };

    config.postcss = [autoprefixer];

    if (!options.production) {
        config.debug = true;
        config.devtool = 'eval-source-map';
    }

    config.plugins = [
        new TargetprocessMashupPlugin(mashupName, {
            useConfig: true
        }),
        new webpack.DefinePlugin({
            '__DEV__': process.env.NODE_ENV !== 'production',
            '__PRODUCTION__': process.env.NODE_ENV === 'production',
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.BannerPlugin(`v${pkg.version} Build ${new Date().toUTCString()}`, {
            entryOnly: true
        })
    ];

    if (options.mashupManager) {
        config.plugins = config.plugins.concat(new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }));
    }

    if (options.production) {
        config.plugins = config.plugins.concat(new webpack.optimize.UglifyJsPlugin({
            compress: {
                properties: true,
                screw_ie8: false,
                warnings: false
            },
            output: {
                screw_ie8: false
            }
        }));
    }

    config.externals = [
        'jQuery',
        {jquery: 'jQuery'},
        'Underscore',
        {underscore: 'Underscore'},
        'react',
        'react-dom',
        /^tp3\//,
        /^tau\//,
        /^tp\//
    ];

    return config;

};

module.exports = createConfig;
