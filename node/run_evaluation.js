const fs = require('fs');

const constants = require('../common/constants');
const utils = require('../common/utils');

const KNN = require('../common/classifiers/knn');

console.log(`Running Classification ...`);

const { samples: trainingSamples } = JSON.parse(
  fs.readFileSync(constants.TRAINING)
);

const kNN = new KNN(trainingSamples, 50);

const { samples: testingSamples } = JSON.parse(
  fs.readFileSync(constants.TESTING)
);

let totalCount = 0;
let correctCount = 0;
for (const sample of testingSamples) {
  const { label: predictedLabel } = kNN.predict(sample);
  correctCount += predictedLabel === sample.label;
  totalCount++;
}

console.log(`
  ACCURACY: ${correctCount} / ${totalCount} (
    ${utils.formatPercent(correctCount/totalCount)}
  )
`);

