export const image = {
  src: null,
  zoomEl: null,
  getSize: (srcWidth, srcHeight, maxWidth, maxHeight) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    const newSize = {
      width: srcWidth * ratio,
      height: srcHeight * ratio
    }
    const increment = (incr) => {
      newSize.width += incr;
      newSize.height += incr;
    }
    if (newSize.width < maxWidth) increment(maxWidth - newSize.width);
    if (newSize.height < maxHeight) increment(maxHeight - newSize.height);
    return newSize;
  },
  init: (img, canvasConfig, skipSizing = false) => {
    image.src = img;
    return !skipSizing ? image.getSize(image.src.naturalWidth, image.src.naturalHeight, canvasConfig.width, canvasConfig.height) : '';
  },
  load: (src) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    })
    .then(result => result);
  }
};
