const Dotenv = require('dotenv-webpack');
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
  externals: {
    'Config': JSON.stringify(
    {
      API_KEY: process.env.API_KEY
    })
 },
  // plugins: [
  //   new Dotenv()
  // ]
};
