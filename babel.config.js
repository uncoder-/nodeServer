const presets = [
  ["@babel/preset-env"]
];
const plugins = ["@babel/plugin-syntax-dynamic-import"];

if (process.env["ENV"] === "prod") {
  // plugins.push(...);
}
module.exports = { presets, plugins };