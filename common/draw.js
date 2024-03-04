// common/draw.js

const draw = {};

draw.path = (ctx, path, color = 'black') => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  // ctx moveTo takes two parameters
  // each path occurance has X Y coirdinates
  // the spread operator will satisfy the parameters
  ctx.moveTo(...path[0]);
  path.map( coord => ctx.lineTo(...coord) );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
};

draw.paths = (ctx, paths, color = 'black') => {
  paths.map( path => draw.path(ctx, path, color) );
};

if (typeof module !== 'undefined')
  module.exports = draw;
