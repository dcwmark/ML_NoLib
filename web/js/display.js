// web/js/display.js

const EMPHASIZE = 'emphasize';

const createRow = (container, studentName, samples) => {
  const row = document.createElement('div');
  row.classList.add('row');
  container.appendChild(row);

  const rowLabel = document.createElement('div');
  rowLabel.innerHTML = studentName;
  rowLabel.classList.add('rowLabel');
  row.appendChild(rowLabel);

  for (let sample of samples) {
    const { id, label, student_id, } = sample;

    const sampleContainer = document.createElement('div');
    sampleContainer.id = `sample_${id}`;
    // The <code>handleClick</code> scrolls the selection
    // to the center of scree.  But this behavious is not
    // desired for when clicking of the chart.
    // Therefore, set the second parameter of
    // <code>handleClick</code> would bypass this behaviour.
    sampleContainer.onclick =
      () => handleClick(sample, false);
    sampleContainer.classList.add('sampleContainer');

    const sampleLabel = document.createElement('div');
    sampleLabel.innerHTML = label;
    sampleContainer.appendChild(sampleLabel);

    const img = document.createElement('img');
    img.src = constants.IMG_DIR + '/' + id + '.png';
    img.classList.add('thumb');

    if (utils.flaggedUsers.includes(student_id)) {
      img.classList.add('blur');
    }

    sampleContainer.appendChild(img);
    row.appendChild(sampleContainer);
  }
}

const deEmphasizeAll = () =>
  [...document.querySelectorAll(`.${ EMPHASIZE }`)].
    forEach((e) => e.classList.remove(EMPHASIZE));

// 1. When an item is clicked on the grid or the chart ...
const handleClick = (sample, doScroll = true) => {
  // <code>sample</code> can be null if click was
  // done on empty space of the chart (not on an item).
  if (sample == null) {
    deEmphasizeAll();
    return;
  }

  // 2. Grab the item ...
  const el = document.getElementById(
    `sample_${sample.id}`
  );

  // When am <code>EMPHASIZE</code>d element is selected
  // again, deEMPHASIZE it.
  if (el.classList.contains(EMPHASIZE)) {
    el.classList.remove(EMPHASIZE);
    chart.selectSample(null);
    return;
  }

  deEmphasizeAll();

  // 3. Add the "emphasize" class ...
  el.classList.add(EMPHASIZE);

  // 4. Scrool the item to view
  if (doScroll) {
    el.scrollIntoView({
      behavior: 'auto',
      block: 'center',
    });
  }

  // 5. Reflect the selected item in the chart.
  chart.selectSample(sample);
}

const DISPLAY_NONE = 'none';
const DISPLAY_BLOCK = 'block';
const toggleInput = () => {
  if (inputContainer.style.display === DISPLAY_NONE) {
    inputContainer.style.display = DISPLAY_BLOCK;
    sketchPad.triggerUpdate();
  } else {
    inputContainer.style.display = DISPLAY_NONE;
    chart.hideDynamicPoint();
  }
}
