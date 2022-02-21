let ctx = CanvasRenderingContext2D;
let drawing = false;

export const canvas = {
  el: null,
  bcr: {},
  init: () => {
    canvas.el = document.getElementById('editorCanvas');
    if (!canvas.el) {
      alert('Could not get the canvas element');
      return false;
    };
    ctx = canvas.el.getContext("2d")
    canvas.bcr = canvas.el.getBoundingClientRect();
    return true;
  },
  draw: (photo, imageSrc) => {
    // prevent too many redraws
    if (drawing === true) return;
    drawing = true;
    setTimeout(() => {
      drawing = false;
    }, 50);
    ctx.clearRect(0, 0, photo.width, photo.height);
    ctx.drawImage(imageSrc, photo.x, photo.y, photo.width, photo.height);
  }
};
