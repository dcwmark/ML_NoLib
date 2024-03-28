// node/feature_extractor.js

const fs = require('fs');

const constants = require('../common/constants');
const featureFunctions = require('../common/featureFunctions');
const utils = require('../common/utils');

console.log(`Extracting Features ...`);

const samples = JSON.parse(
    fs.readFileSync(constants.SAMPLES)
);

for (const sample of samples) {
  const paths = JSON.parse(
    fs.readFileSync(
      `${constants.JSON_DIR}/${sample.id}.json`
    )
  );
  /**
   * ============================================================
   * sample.point = [
   *   featureFunctions.getPathCount(paths),
   *   featureFunctions.getPointCount(paths)
   * ];
   * ============================================================
   * With featureFunction.inUse[], replace each seperate calls
   * to mapping each of the function call and repeatedly calling each.
   */
  const functions = featureFunctions.inUse.map(f => f.function);
  sample.point = functions.map(f => f(paths));
}

const minMax = utils.normalizePoints(
  samples.map(s => s.point)
);

/**
 * const featureNames = ['Path Count', 'Point Count'];
 * 
 * With featureFunction.inUse[], replace each seperate calls
 * to mapping each of the name ref and repeat calling each,
 */
const featureNames = featureFunctions.inUse.map(f => f.name);

console.log(`Generating Splits ...`);

const trainingAmount = samples.length * 0.5;

const partition = (baseArray, isTrue) => {
  return baseArray.reduce(([part1, part2], elem) => {
    return isTrue(elem)
    ? [[...part1, [elem]], [...part2]] 
    : [[...part1], [...part2, [elem]]];
  }, [[], []]);
};
const [partition1, partition2] = partition(
  samples,
  (e) => e.id <= trainingAmount,
);
const training = partition1.flat(Infinity);
const testing = partition2.flat(Infinity);

fs.writeFileSync(
  constants.FEATURES,
  JSON.stringify({ 
    featureNames,
    samples: samples.map( (s) => {
      return {
        point: s.point,
        label: s.label,
      };
    }),
  }),
);

/** 
 * Create similiar data as above with the "whole" of samples;
 * except wrapping the data
 * with <code>const samples = </code> and <code>;</code>
 * 
 * This step is chosen instead of creating an API
 * for the task is to:
 * 
 * 1. Avoid CORS
 * 2. Web Server
 * 3. Live Server
 */
fs.writeFileSync(
  constants.FEATURES_JS,
  `const features=${
    JSON.stringify({ featureNames, samples })
  };`,
);

fs.writeFileSync(
  constants.TRAINING,
  JSON.stringify({ 
    featureNames,
    samples: training.map( (s) => {
      return {
        point: s.point,
        label: s.label,
      };
    }),
  }),
);
fs.writeFileSync(
  constants.TRAINING_JS,
  `const training=${
    JSON.stringify({ featureNames, samples: training })
  };`,
);

fs.writeFileSync(
  constants.TESTING,
  JSON.stringify({ 
    featureNames,
    samples: testing.map( (s) => {
      return {
        point: s.point,
        label: s.label,
      };
    }),
  }),
);
fs.writeFileSync(
  constants.TESTING_JS,
  `const testing=${
    JSON.stringify({ featureNames, samples: testing })
  };`,
);

fs.writeFileSync(
  constants.MIN_MAX_JS,
  `const minMax=${ JSON.stringify(minMax) };`,
);

console.log(`Done!`);

