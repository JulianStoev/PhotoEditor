import { canvas } from "./canvas";
import { files } from "./files";
import { image } from "./image";
import { mouse } from "./mouse";

const config = {
  canvas: {
    width: 0,
    height: 0,
    photo: {
      id: null,
      originalWidth: 0,
      originalHeight: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      zoom: 1
    }
  },
  getConfig: () => ({...config.canvas})
};

export const start = () => Object.values(initScripts).forEach(val => val());

const initScripts = {
  setFileListener: () => {
    const inputEl = document.getElementById('fileSelector');
    if (inputEl) tools.listeners(inputEl, 'add', 'change', events.onImageUpload);
  },

  setCanvas: () => {
    if (!canvas.init()) return;
    config.canvas.width = canvas.el.width = canvas.el.offsetWidth;
    config.canvas.height = canvas.el.height = canvas.el.offsetHeight;
  },

  buttonsInit: () => {
    tools.downloadBtn = document.getElementById('download');
    if (tools.downloadBtn) tools.listeners(tools.downloadBtn, 'add', 'click', events.onDownload);
  
    const upload = document.getElementById('upload');
    if (upload) tools.listeners(upload, 'add', 'change', events.onConfigUpload);
  },

  setZoomSlider: () => {
    image.zoomEl = document.getElementById('zoomSlider');
    if (image.zoomEl) tools.listeners(image.zoomEl, 'add', 'input', events.onZoom);
  }
};

const events = {
  onConfigUpload: (e) => actions.onConfigUpload(e),

  onDownload: () => actions.onDownload(),

  onMouseDown: e => mouse.down(e, canvas.bcr),

  onMouseUp: e => mouse.up(e),

  onMouseMove: e => actions.onMouseMove(e),

  onZoom: e => actions.onZoom(e),

  onImageUpload: e => actions.onImageUpload(e)
};

const actions = {
  onConfigUpload: async (e) => {
    const readerResult = await files.reader('json', e.target.files[0]);
    config.canvas = JSON.parse(readerResult);

    const imageResult = await image.load(config.canvas.photo.id);
    image.init(imageResult, config.getConfig(), true);

    if (image.zoomEl) image.zoomEl.value = Number(config.canvas.photo.zoom);

    canvas.draw(config.getConfig().photo, image.src);

    tools.setCanvasListeners();
    tools.enableControls();
  },

  onDownload: () => {
    const link = document.createElement('a');
    link.download = 'config.json';
    link.href = URL.createObjectURL(new Blob([JSON.stringify(config.canvas)], {type: 'text/json'}));
    link.click();
    link.remove();
  },

  onMouseMove: e => {
    const coords = mouse.move(e, config.getConfig(), canvas.bcr);
    if (!coords) return; // might be locked
    config.canvas.photo.x = coords.x;
    config.canvas.photo.y = coords.y;
    canvas.draw(config.getConfig().photo, image.src);
  },

  onZoom: e => {
    const zoomLevel = Number(e.target.value);
    if (config.canvas.photo.zoom > zoomLevel) {
      config.canvas.photo.x = 0;
      config.canvas.photo.y = 0;
    }
    config.canvas.photo.width = Math.floor(config.canvas.photo.originalWidth * zoomLevel);
    config.canvas.photo.height = Math.floor(config.canvas.photo.originalHeight * zoomLevel);
    config.canvas.photo.zoom = zoomLevel;
    canvas.draw(config.getConfig().photo, image.src);
  },

  onImageUpload: e => {
    files.change(e)
      .then(async readerResult => {
        const imageResult = await image.load(readerResult);
        const size = image.init(imageResult, config.canvas);
        config.canvas.photo.width = size.width;
        config.canvas.photo.height = size.height;
        config.canvas.photo.originalWidth = size.width;
        config.canvas.photo.originalHeight = size.height;
        config.canvas.photo.id = image.src.src;
        config.canvas.photo.x = 0;
        config.canvas.photo.y = 0;
        canvas.draw(config.getConfig().photo, image.src);
        tools.setCanvasListeners();
        tools.enableControls();
      })
      .catch(err => alert(err));
  }
};

const tools = {
  downloadBtn: null,

  listeners: (el, type, eventType, callback) => el[(type === 'add' ? 'add' : 'remove') + 'EventListener'](eventType, callback),
  
  setCanvasListeners: () => {
    if (!canvas.el) return;
    tools.listeners(canvas.el, 'add', 'mousedown', events.onMouseDown);
    tools.listeners(canvas.el, 'add', 'mouseup', events.onMouseUp);
    tools.listeners(canvas.el, 'add', 'mouseout', events.onMouseUp);
    tools.listeners(canvas.el, 'add', 'mousemove', events.onMouseMove);
  },
  
  enableControls: () => {
    if (image.zoomEl) image.zoomEl.disabled = false;
    if (tools.downloadBtn) tools.downloadBtn.disabled = false;
  }

};
