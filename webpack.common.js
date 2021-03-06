const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require('webpack');
const glob = require('glob-all');
const yaml = require('js-yaml');
const fs = require('fs');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const uuid = require("uuid")
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/js/app.tsx')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/images", to: "images" },
                { from: "src/*.{js,txt,json,xml}", to: "[name].[ext]" },
                { from: "netlify.toml", to: "netlify.toml" }
            ],
        }),
        new ForkTsCheckerWebpackPlugin(),
        new DefinePlugin((() => {
            let translations = {};
            glob.sync([
                path.join(__dirname, 'translations/**/*.yaml'),
            ]).forEach((file) => {
                const [domain, locale, ext] = path.basename(file).split('.');

                if (translations[locale] === undefined) {
                    translations[locale] = {};
                }
                if (translations[locale][domain] === undefined) {
                    translations[locale][domain] = {};
                }
                translations[locale][domain] = yaml.load(fs.readFileSync(file, 'utf8'));
            });
            return {
                __TRANSLATIONS__: JSON.stringify(translations)
            };
        })()),
        new ReplaceInFileWebpackPlugin([{
            dir: 'public',
            files: ['sw.js'],
            rules: [{
                search: '##__PACKAGEVERSION__##',
                replace: uuid.v4()
            }]
        }]),
        new WebpackManifestPlugin({
            fileName: 'bmanifest.json',
            publicPath: '',
            filter: (file) => {
                return ![
                    'index.html',
                    'netlify.toml',
                    'src/manifest.json',
                    'src/robots.txt',
                    'src/browserconfig.xml',
                    'src/sw.js',
                    'src/index.html'
                ].includes(file.name);
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, './public')
    }
};

