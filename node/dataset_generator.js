// node/dataset_generator.js
const fs = require('fs');
const { createCanvas } = require('canvas');

const draw = require('../common/draw.js');
const constants = require('../common/constants.js');
const utils = require('../common/utils.js');

const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

/* Read the RAW File folder */
const fileNames = fs.readdirSync(constants.RAW_DIR);

const generateImageFile = (outFile, paths) => {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
  draw.paths(ctx, paths);

  /**
   * Use the drawing paths to draw the images
   * and store the image buffers 
   */
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outFile, buffer);
};

const samples = [];
let id = 1;
/*
  Read each one of the raw files
  and push the content of each raw file
  to ths samples array,
*/
fileNames.forEach( (fn) => {
  const content = fs.readFileSync(
    constants.RAW_DIR+'/'+fn
  );
  const { session, student, drawings } =
    JSON.parse(content);

  for (let label in drawings) {
    samples.push({
      id,
      label,
      student_name: student,
      student_id: session,
    });
  
    /*
      Write each "drawing" of data poins into
      their own JSON file
    */
    const paths = drawings[label];
    fs.writeFileSync(
      constants.JSON_DIR+'/'+id+'.json',
      JSON.stringify(paths)
    );
  
    generateImageFile(
      constants.IMG_DIR+'/'+id+'.png',
      paths
    );  

    utils.printProgress(id, fileNames.length * 8);
    id++;
  }  
});

/** 
 * Write the samples array to samples.json as summary
 */
fs.writeFileSync(
  constants.SAMPLES,
  JSON.stringify(samples)
);

/** 
 * Create the same data as above except wrapping the data
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
  constants.SAMPLES_JS,
    `const samples=${JSON.stringify(samples)};`
);
