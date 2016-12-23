'use strict';

const path = require('path');
const argv = require('yargs').argv;
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const pkg = require('./package.json');

const libraryName = pkg.name.split('-').map(str => str[0].toUpperCase() + str.substr(1)).join('');

const VERSION = argv.version || pkg.version;
const ENV = argv.mode;
const IS_LOC = ENV === 'loc';
const IS_DEV = ENV === 'dev';
const IS_PROD = ENV === 'prod';

let outputFile = pkg.name;
const plugins = [
	new webpack.NoErrorsPlugin(),
	new webpack.DefinePlugin({
		'VERSION': JSON.stringify(VERSION),
		'IS_LOC': JSON.stringify(IS_LOC),
		'IS_DEV': JSON.stringify(IS_DEV),
		'IS_PROD': JSON.stringify(IS_PROD),
		'LIBRARY_NAME': JSON.stringify(libraryName),
		'process.env': {
			'NODE_ENV': JSON.stringify('production'),
		},
	}),
];

if (IS_DEV || IS_PROD) {
	plugins.push(new webpack.optimize.DedupePlugin());
	plugins.push(new CompressionPlugin({
		asset: '[path].gz[query]',
		algorithm: 'gzip',
		test: /\.js$|\.html$|\.css|\.map/,
		minRatio: 0.8,
	}));
}

if (IS_PROD) {
	outputFile = outputFile + '.min.js';

	plugins.push(new webpack.optimize.UglifyJsPlugin({
		beautify: false,
		comments: false,
		compress: {
			sequences: true,
			booleans: true,
			loops: true,
			unused: true,
			warnings: false,
			drop_console: false,
			unsafe: true,
		},
	}));
} else {
	outputFile = outputFile + '.js';
}

const config = {
	entry: path.join(__dirname, 'src', 'index.js'),

	devtool: 'source-map',

	watch: IS_LOC,

	watchOptions: {
		aggregateTimeout: 100,
	},

	cache: true,
	debug: !IS_PROD,

	stats: {
		colors: true,
		reasons: true,
	},

	output: {
		path: __dirname + '/lib',
		filename: outputFile,
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},

	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /(node_modules)/,
			},
		],
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /(node_modules)/,
			},
		],
	},

	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js'],
	},

	plugins: plugins,

	eslint: {
		configFile: path.join(__dirname, '.eslintrc.js'),
	},
};

module.exports = config;
