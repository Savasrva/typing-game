const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'typingGame.js',
        path: resolve(__dirname, 'public'),
    },
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html', 
          template: './src/public/index.html'
        }),
        new MiniCssExtractPlugin({ filename: 'app.css' }),
        new CleanWebpackPlugin({
          cleanAfterEveryBuildPatterns: ['public']
        })
      ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    devServer: {
      hot: true,
      open: true,
      port: 3000,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      modules: ['node_modules'],
      extensions: ['.js', '.json', '.jsx', '.css'],
    },
};