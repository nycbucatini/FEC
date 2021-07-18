require('dotenv').config();
// console.log(process.env);
const webpack = require('webpack');
module.exports = {
  entry: __dirname + "/client/app.jsx",
  module: {
    rules: [
      {
        test: [/\.jsx$/],
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["env", "react"]
        }
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/public"
  },
  plugins: [
    new webpack.DefinePlugin({
      GITHUB: JSON.stringify(process.env)
    })
  ]
};
