const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];

export const files = {
  change: e => {
    return new Promise(async (resolve, reject) => {
      const file = e.target.files[0];
      if (!file) return;
      if (acceptedTypes.indexOf(file.type) === -1) {
        reject('Invalid file type');
        return;
      }
      const readerResult = await files.reader('file', file);
      resolve(readerResult);
    })
    .then(result => result);    
  },
  reader: (type, data) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader[type === 'file' ? 'readAsDataURL' : 'readAsText'](data);
    })
    .then(result => result);
  }
};
