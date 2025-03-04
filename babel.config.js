module.exports = {
  presets: [
    require('@babel/preset-env'),
    require('@babel/preset-react'),
    require('@babel/preset-typescript'),
  ],
  plugins: [
    [require('@babel/plugin-transform-runtime'), { regenerator: true }],
    require('@babel/plugin-transform-class-properties'),
    require('@babel/plugin-transform-object-rest-spread'),
  ],
};
