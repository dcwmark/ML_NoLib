// web/js/sketchPad.js

class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
      background-color: white;
      box-shadow: 0px 0px 18px 2px black;
    `;
    container.appendChild(this.canvas);

    const lineBreak = document.createElement("br");
    container.appendChild(lineBreak);

    this.undoBtn = document.createElement("button");
    this.undoBtn.innerHTML = 'UNDO';
    container.appendChild(this.undoBtn);

    this.ctx = this.canvas.getContext('2d');

    // this.onUpdate = onUpdate;
    this.reset();

    // this.paths = [];
    // this.isDrawing = false;
    // this.#redraw();

    this.#addEventListeners();
  }

  reset = () => {
    /**
     * The path of drawing in the mouse [X, Y] co-ordinates.
     */
    this.paths = [];
    /**
     * Signifying when drawing commences.
     */
    this.isDrawing = false;
    this.#redraw();
  };

  #addEventListeners() {
    this.canvas.onmousedown = (evt) => {
      const mouse = this.#getMouseLocation(evt);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };
    this.canvas.onmousemove = (evt) => {
      if (this.isDrawing) {
        const mouse = this.#getMouseLocation(evt);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#redraw();
      }
    };
    /**
     * If the mouseup is triggered outside the canvas,
     *   this.canvas.mouseup would not be caught, hence,
     *   document.mouseup; instead.
     */
    document.onmouseup = () => {
      this.isDrawing = false;
    };

    /**
     * Set up for touch dvices.
     */
    this.canvas.ontouchstart = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousedown(loc);
    };
    this.canvas.ontouchmove = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousemove(loc);
    };
    this.canvas.ontouchend = () => {
      document.onmouseup();
    };

    /**
     * UNDO button events
     */
    this.undoBtn.onclick = () => {
      this.paths.pop();
      this.#redraw();
    };
  }

  #getMouseLocation = (evt) => {
    const rect = this.canvas.getBoundingClientRect();
    /**
     * Obtain the mouse co-ordinate of the mouse by
     * taking the clientX of the event minus
     *   the left side of the canvas rectangle,
     *   thereby, getting the X co-ordinate that is relative
     *   to the left side of the canvas,
     * then, take the clientY of the event minus
     *   the top of the canvas rectangle,
     *   thereby, getting the Y co-ordinate that is relative
     *   to the top part of the canvas.
     * As we do not need the high precision available from the above
     *   calculations, we would round off to the nearest integers.
     */
    return [
      Math.round(evt.clientX - rect.left),
      Math.round(evt.clientY - rect.top)
    ];
  };

  #redraw = () => {
    /**
     * Use ctx clearRect to clear the canvas.
     */
    this.ctx.clearRect(
      0, 0,               // from this offset (top left) 
      this.canvas.width,
      this.canvas.height  // to this offset (nottom right)
    );
    draw.paths(this.ctx, this.paths);

    this.undoBtn.disabled = this.paths.length > 0 ? false : true;

    // this.triggerUpdate();
    // this.onUpdate(this.paths);
  };

  triggerUpdate = () => {
    if (this.onUpdate) {
      this.onUpdate(this.paths);
    }
  };
}
