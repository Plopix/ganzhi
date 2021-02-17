const path = require('path');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    mode: 'development',
    output: {
        filename: '[name].js'
    },
    plugins: [
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new StyleLintPlugin({
            configFile: '.stylelintrc.json',
            context: 'src',
            files: '**/*.{css,sass,scss,sss}',
            syntax: 'scss'
        })
    ],
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, './public'),
        writeToDisk: true,
        historyApiFallback: {
            index: 'index.html'
        }
    }
};
