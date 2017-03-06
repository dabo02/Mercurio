(function (angular, EXIF) {
    'use strict';

    angular.module("fix-image-orientation", []).directive('imgFixOrientation', [orient]);


    function orient() {
        return {
            restrict: 'A',
            scope: {
                'imgFixOrientation': '='
            },
            link: linkLogic
        };

        function linkLogic(scope, element, attrs) {
            var imageUrl = scope.imgFixOrientation;
            var xhr = new XMLHttpRequest();
            //Request to get the image from the url
            xhr.open("GET", imageUrl, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function(e) {
              //transform the respone to array of 8-bit unsigned integers, so we can read the exif data.
                var arrayBuffer = new Uint8Array(this.response);
                  //Read data
                var exifData = EXIF.readFromBinaryFile(arrayBuffer.buffer);
                 //get the orientation, it is given in numbers from 1-8
                reOrient(parseInt(exifData.Orientation || 1, 10), element);
                };
                xhr.send();

        }

        function reOrient(orientation, element) {
                //CASES::
               // 1. nothing
               // 2. transform: flip horizontal
               // 3. transform: rotate 180
               // 4. transform: flip vertical
               // 5. transform: transpose
               // 6. transform: rotate 90
               // 7. transform: transverse
               // 8. transform: rotate 270
               // console.log(orientation);
            switch (orientation) {
                case 1:
                    // No action needed
                    break;
                case 2:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 3:
                    element.css({
                        'transform': 'rotate(180deg)'
                    });
                    break;
                case 4:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1) rotate(180deg)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 5:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1) rotate(90deg)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 6:
                    element.css({
                        'transform': 'rotate(90deg)'
                    });
                    break;
                case 7:
                    element.css({
                        '-moz-transform': 'scaleX(-1)',
                        '-o-transform': 'scaleX(-1)',
                        '-webkit-transform': 'scaleX(-1)',
                        'transform': 'scaleX(-1) rotate(-90deg)',
                        'filter': 'FlipH',
                        '-ms-filter': "FlipH"
                    });
                    break;
                case 8:
                    element.css({
                        'transform': 'rotate(-90deg)'
                    });
                    break;
            }
        }// End reOrient()
    }// End orient()
})(window.angular, window.EXIF, window);
