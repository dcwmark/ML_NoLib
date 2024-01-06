// node/feature_extractor.js

const fs = require('fs');

const constants = require('../common/constants');
const featureFunctions = require('../common/featureFunctions');
const utils = require('../common/utils');

console.log(`Extracting Features ...`);

const samples = JSON.parse(
    fs.readFileSync(constants.SAMPLES)
).filter(s => s.id != 3107);

for (const sample of samples) {
  const paths = JSON.parse(
    fs.readFileSync(
      `${constants.JSON_DIR}/${sample.id}.json`
    )
  );
  /**/
   sample.point = [
     featureFunctions.getPathCount(paths),
     featureFunctions.getPointCount(paths)
   ];
  /* 
   * With featureFunction.inUse[], replace each seperate calls
   * to mapping each of the function call and repeat calling each,
   */
  const functions = featureFunctions.inUse.map(f => f.function);
  // sample.point = functions.map(f => f(paths));
}

const minMax = utils.normalizePoints(
  samples.map(s => s.point)
);

/**
 * const featureNames = ['Path Counts', 'Point Count'];
 * 
 * With featureFunction.inUse[], replace each seperate calls
 * to mapping each of the name ref and repeat calling each,
 */
const featureNames = featureFunctions.inUse.map(f => f.name);

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
  `const features=${ JSON.stringify({ featureNames, samples }) };`,
);

fs.writeFileSync(
  constants.MIN_MAX_JS,
  `const minMax=${ JSON.stringify({ minMax }) };`,
);

console.log(`Done!`);
