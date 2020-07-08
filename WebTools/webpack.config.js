const path = require("path");

module.exports = {
  entry: "./src/app.tsx",
  mode: "production",
  module: {
    rules: [
        {
          test: /\.ts|\.tsx$/,
          use: "ts-loader",
          exclude: "/node-modules/"
        }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "trek.js",
    path: path.resolve(__dirname, "dist")
  }
};