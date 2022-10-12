const path=require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin } = require("clean-webpack-plugin");


const config = {
    entry:"./main.js",
    output:{
        filename:"main.[chunkhash].js",
        path:path.resolve(__dirname,"dist")
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "JavaScript Game"
        }),
    ],
    module: {
        rules:[
            {
                test: /\.css$/,
                use:[
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:["file-loader"]
            }
        ]
    }
};
  
module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'eval';
        /*config.devServer={
            contentBase: "./dist"
        }*/
    }
    return config;
};