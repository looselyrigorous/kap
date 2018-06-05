'use strict';

const {Tray} = require('electron');
const path = require('path');

const {openCropperWindow} = require('./cropper');
const {openExportsWindow} = require('./exports');
const {cogMenu} = require('./menus');

let tray = null;

const initializeTray = () => {
  tray = new Tray(path.join(__dirname, '..', 'static', 'menubarDefaultTemplate.png'));
  tray.on('click', openExportsWindow);
  tray.on('right-click', () => {
    tray.popUpContextMenu(cogMenu);
  });
  tray.on('drop-files', (event, files) => console.log(files));

  return tray;
};

const disableTray = () => {
  tray.removeListener('click', openCropperWindow);
};

const setRecordingTray = stopRecording => {
  animateIcon();

  tray.once('click', () => {
    stopRecording();
    tray.setImage(path.join(__dirname, '..', 'static', 'menubarDefaultTemplate.png'));
    tray.on('click', openCropperWindow);
  });
};

const animateIcon = () => new Promise(resolve => {
  const interval = 20;
  let i = 0;

  const next = () => {
    setTimeout(() => {
      const number = String(i++).padStart(5, '0');
      const filename = `loading_${number}Template.png`;

      try {
        tray.setImage(path.join(__dirname, '..', 'static', 'menubar-loading', filename));
        next();
      } catch (err) {
        resolve();
      }
    }, interval);
  };

  next();
});

module.exports = {
  initializeTray,
  disableTray,
  setRecordingTray
};