const path = require('path');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
