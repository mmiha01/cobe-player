const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: "./src/index.tsx",
  output: {
      filename: "bundle.js",
      path: __dirname + "/dist"
  },

  // Start dev server
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    historyApiFallback: true,
    writeToDisk: false
  }, 

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new HtmlWebPackPlugin({
    template: "./index.html",
    filename: "./index.html",
    excludeChunks: [ 'server' ]
    })
  ], 
  
  // Rules for files and loaders
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { 
        test: /\.tsx?$/, loader: "awesome-typescript-loader" 
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { 
        enforce: "pre", test: /\.js$/, loader: "source-map-loader" 
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          //"style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader']
        },
        {
          // Loads the javacript into html template provided.
          // Entry point is set below in HtmlWebPackPlugin in Plugins 
         test: /\.html$/,
         use: [
             {
               loader: "html-loader",
               options: { 
                 minimize: true,
                 removeComments: false,
                 collapseWhitespace: false
               }
             }
           ]
         }           
      ],
  }
}