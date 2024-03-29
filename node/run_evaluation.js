const fs = require('fs');

const constants = require('../common/constants');
const utils = require('../common/utils');

const KNN = require('../common/classifiers/knn');

console.log(`Running Classification ...`);

const { samples: trainingSamples } = JSON.parse(
  fs.readFileSync(constants.TRAINING)
);

const k = 100;
const kNN = new KNN(trainingSamples, k);

const { samples: testingSamples } = JSON.parse(
  fs.readFileSync(constants.TESTING)
);

let totalCount = 0;
let correctCount = 0;
for (const sample of testingSamples) {
  const { label: predictedLabel } = kNN.predict(sample.point);
  correctCount += predictedLabel === sample.label;
  totalCount++;
}

console.log(`
  ACCURACY: ${correctCount} / ${totalCount} (
    ${utils.formatPercent(correctCount/totalCount)}
  )
`);

console.log(`Generating Decision Boundary ...`);

const { createCanvas } = require('canvas');
const canvas = createCanvas(100, 100);
const ctx = canvas.getContext('2d');

for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    // plotting the [canvas] point-by-point
    const point = [
      x / canvas.width,
      1 - y / canvas.height // <code>1 - </code> is needed;
                            // otherwise, the resulting
                            // chart for y-axis would be
                            // FLIPPED.
    ];
    // As kNN is already "populated" by "trainingSamples" from above.
    const { label } = kNN.predict(point);
    // Get the colour associated with the predicted label.
    const color = utils.styles[label].color;
    ctx.fillStyle = color;
    // "Paint" a 1 X 1 pixel with the label's associated colour.
    ctx.fillRect(x, y, 1, 1);
  }
}

// Write the resulting canvas to a file as png image.
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);

console.log('Done!');

