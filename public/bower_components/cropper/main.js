window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var console = window.console || { log: function () {} };
  var image = document.getElementById('crop-img');
  var isUndefined = function (obj) {
    return typeof obj === 'undefined';
  };
  var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        build: function (e) {
          console.log(e.type);
        },
        built: function (e) {
          console.log(e.type);
        },
        cropstart: function (e) {
          console.log(e.type, e.detail.action);
        },
        cropmove: function (e) {
          console.log(e.type, e.detail.action);
        },
        cropend: function (e) {
          console.log(e.type, e.detail.action);
        },
        crop: function (e) {
          var data = e.detail;

          console.log(e.type);
          dataX.value = Math.round(data.x);
          dataY.value = Math.round(data.y);
          dataHeight.value = Math.round(data.height);
          dataWidth.value = Math.round(data.width);
          dataRotate.value = !isUndefined(data.rotate) ? data.rotate : '';
          dataScaleX.value = !isUndefined(data.scaleX) ? data.scaleX : '';
          dataScaleY.value = !isUndefined(data.scaleY) ? data.scaleY : '';
        },
        zoom: function (e) {
          console.log(e.type, e.detail.ratio);
        }
      };
  var cropper = new Cropper(image, options);

  function preventDefault(e) {
    if (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  }

};
