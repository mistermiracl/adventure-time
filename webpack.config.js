require('dotenv').config();
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemoveFilesWebpackPlugin = require('remove-files-webpack-plugin');

const publicPath = path.join(__dirname, 'public', '/');
const srcPath = path.join(__dirname, 'src', '/');
const resourcesPath = path.join(__dirname, 'resources', '/');
const viewsPath = path.join(__dirname, 'src', 'views', '/');//has to be absolute to ignore the set output path

const jsFolder = 'js/';
const cssFolder = 'css/';
const imgFolder = 'img/';

const isProd = process.env.NODE_ENV === 'production';

const entries = {
    jsPath: path.join(resourcesPath, jsFolder),
    js: [
        'main.js'
    ],
    cssPath: path.join(resourcesPath, cssFolder),
    css: [
        'main.css'
    ],
    imgPath: path.join(resourcesPath, imgFolder),
    get() {
        return { 
            main: [
                ...this.js.map(j => this.jsPath + j),
                ...this.css.map(c => this.cssPath + c)
            ]
        };
    },
    images(abs = false) {
        return fs.readdirSync(path.join(resourcesPath, imgFolder)).map(f => abs ? path.join(resourcesPath, imgFolder, f) : f)
    }
};

const output = {
    jsPath: path.join(publicPath, jsFolder),
    cssPath: path.join(publicPath, cssFolder),
    imgPath: path.join(publicPath, imgFolder)
}

module.exports = {
    entry: entries.get(),
    output: {
        path: publicPath,
        filename: jsFolder + 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.ejs$/,
                use: ['raw-loader']//to prevent problems with the default ejs loader that webpack uses, since templates are handled on the backend
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: cssFolder + 'bundle.css'// it uses the specified path which is the public path
        }),
        new HtmlWebpackPlugin({
            filename: viewsPath + 'layouts/index.ejs',
            template: viewsPath + 'layouts/index.src.ejs',
            hash: true,
            publicPath: '/'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './resources/img',
                    to: output.imgPath,
                    toType: 'dir'
                }
            ]
        }),
        new RemoveFilesWebpackPlugin({
            after: {
                test: [
                    {
                        folder: output.imgPath,
                        method: absoluteItemPath => {
                            // const winabsoluteItemPath = absoluteItemPath.replace(/\\/g, '\\\\');
                            const file = path.basename(absoluteItemPath);
                            return !entries.images().includes(file);
                        }
                    }
                ]
            }
        })
    ]
};