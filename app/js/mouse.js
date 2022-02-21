let x = 0;
let y = 0;
let dragging = false;

export const mouse = {
  down: (e, canvasBcr) => {
    e.preventDefault();
    e.stopPropagation();
    const mx = e.clientX - canvasBcr.left;
    const my = e.clientY - canvasBcr.top;

    if (dragging === false) {
      dragging = true;
    }

    // set where we are
    x = mx;
    y = my;
  },
  up: (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = false;
  },
  move: (e, config, canvasBcr) => {
    if (dragging === false) return;
    e.preventDefault();
    e.stopPropagation();

    // get the mouse position
    const mx = e.clientX - canvasBcr.x;
    const my = e.clientY - canvasBcr.y;

    // get the distance
    const dx = mx - x;
    const dy = my - y;

    // set temp position to compare
    let _imgx = config.photo.x + dx;
    let _imgy = config.photo.y + dy;

    // set current mouse position
    x = mx;
    y = my;

    // get the current image size and distance travelled
    const photoPathX = config.photo.width + _imgx;
    const photoPathY = config.photo.height + _imgy;

    // should we lock X
    if (photoPathX < config.width || _imgx > 0 && photoPathX > config.width) {
      _imgx = config.photo.x;
    }

    // should we lock y
    if (photoPathY < config.height || _imgy > 0 && photoPathY > config.height) {
      _imgy = config.photo.y;
    }

    return {x: _imgx, y: _imgy};
  }
};