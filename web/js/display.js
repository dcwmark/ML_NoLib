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

const handleClick = (sample, doScroll = true) => {
  if (sample == null) {
    deEmphasizeAll();
    return;
  }
  const el = document.getElementById(
    `sample_${sample.id}`
  );
  if (el.classList.contains(EMPHASIZE)) {
    el.classList.remove(EMPHASIZE);
    chart.selectSample(null);
    return;
  }
  deEmphasizeAll();
  el.classList.add(EMPHASIZE);
  if (doScroll) {
    el.scrollIntoView({
      behavior: 'auto',
      block: 'center',
    });
  }
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
