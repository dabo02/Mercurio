/* global EXIF */
'use strict';

// Require library: https://github.com/jseidelin/exif-js
// Require Jquery (If not have jquery you must handle DOM by native js code)
/**
  @description this directive auto rotate image by css base on image orientation value
  Check the example of image orientation here:
    https://github.com/recurser/exif-orientation-examples
  @example
     <div class="modal-upload-file-thumbnail" ng-if="isOneImageFile">
      <img ng-src="{{thumbnail}}" img-orientation/>
    </div>
**/

angular.module('mercurio').directive('imgOrientation', function(){
  return {
    restrict: 'A',
    link: function(scope, element/*, attrs*/) {
      function setTransform(transform) {
        element.css('-ms-transform', transform);
        element.css('-webkit-transform', transform);
        element.css('-moz-transform', transform);
        element.css('transform', transform);
      }

      var parent = element.parent();
      $(element).bind('load', function() {
        EXIF.getData(element[0], function() {
          var orientation = EXIF.getTag(element[0], 'Orientation');
          var height = element.height();
          var width = element.width();
          if (orientation && orientation !== 1) {
            switch (orientation) {
              case 2:
                setTransform('rotateY(180deg)');
                break;
              case 3:
                setTransform('rotate(180deg)');
                break;
              case 4:
                setTransform('rotateX(180deg)');
                break;
              case 5:
                setTransform('rotateZ(90deg) rotateX(180deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
              case 6:
                setTransform('rotate(90deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
              case 7:
                setTransform('rotateZ(90deg) rotateY(180deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
              case 8:
                setTransform('rotate(-90deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
            }
          }
        });
      });
    }
  };
});
