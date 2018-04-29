'use strict';

const macBundleUtil = require('./mac-bundle-util.node');

function getLocalizedBundleDisplayName(bundlePath) {
  let appName = null;
  try {
    appName = macBundleUtil.getLocalizedBundleDisplayName(bundlePath);
  } catch (e) {
    console.error(e);
  }
  return appName;
}

function saveApplicationIconAsPng(bundlePath, pngPath, callback) {
  try {
    macBundleUtil.saveApplicationIconAsPng(bundlePath, pngPath, callback);
  } catch (e) {
    console.error(e);
    callback(false);
  }
}

module.exports = {
  getLocalizedBundleDisplayName,
  saveApplicationIconAsPng
};
