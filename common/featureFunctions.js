// common/featureFunctions.js

const featureFunctions = {

  getPathCount: (paths) => paths.length,

  getPointCount: (paths) => paths.flat().length,

  getWidth: (paths) => {
    const points = paths.flat();
    const x = points.map(p => p[0]);
    const min = Math.min(...x);
    const max = Math.max(...x);
    return max - min;
  },

  getHeight: (paths) => {
    const points = paths.flat();
    const y = points.map(p => p[1]);
    const min = Math.min(...y);
    const max = Math.max(...y);
    return max - min;
  },
};

/**
 * Chain of responsibility ???
 * ===========================
  featureFunctions.inUse = [{
    name: 'Path Count', function: featureFunctions.getPathCount,
  }, {
    name: 'Point Count', function: featureFunctions.getPointCount,
  }];
 */
featureFunctions.inUse = [{
  name: 'Width', function: featureFunctions.getWidth,
}, {
  name: 'Height', function: featureFunctions.getHeight,
}];

if (typeof module !== 'undefined')
  module.exports = featureFunctions;

