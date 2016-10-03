angular.module('zypeApp').controller('VideoCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {


  $scope.videos = [
    { name: "Video #1", // BAD
      id: 1,
      show_details: false,
      length: { hour: 3, min: 08, sec: 52}, 
      fails: [ { hour: 0, min: 03, sec: 33}, { hour: 0, min: 11, sec: 13} ], 
      format: "HLS", 
      href: "http://bad-videos.dev.zype.com/video1/zfaeEvbmOKYqguNR.m3u8", 
      status: "bad" },
    { name: "Video #2", // BAD
      id: 2,
      show_details: false, 
      length: { hour: 3, min: 28, sec: 59}, 
      fails: [], 
      format: "HLS", 
      href: "http://bad-videos.dev.zype.com/video4/U477ESYmVc5XQTTK.m3u8", 
      status: "bad" },
    { name: "Video #3", // BAD
      id: 3,
      show_details: false,
      length: { hour: 2, min: 55, sec: 10}, 
      fails: [ { hour: 0, min: 11, sec: 47}, { hour: 0, min: 17, sec: 07}, { hour: 0, min: 18, sec: 49}, { hour: 0, min: 36, sec: 00} ], 
      format: "HLS", 
      href: "http://bad-videos.dev.zype.com/video3/_at63NQWIh9IIx7m.m3u8", 
      status: "bad" },
    { name: "Video #4", // BAD
      id: 4,
      show_details: false,
      length: { hour: 2, min: 40, sec: 57}, 
      fails: [ { hour: 0, min: 01, sec: 30}, { hour: 0, min: 01, sec: 50}, { hour: 0, min: 03, sec: 41}, { hour: 0, min: 15, sec: 31}, { hour: 0, min: 15, sec: 37}, { hour: 0, min: 26, sec: 12} ], 
      format: "MP4", 
      // href: "http://bad-videos.dev.zype.com/video2/erPQbYqt0EcCae8e.mp4",
      href: "/videos/erPQbYqt0EcCae8e.mp4",
      status: "bad" },
    { name: "Video #5", // BAD
      id: 5,
      show_details: false,
      length: { hour: 0, min: 0, sec: 34}, 
      fails: [ { hour: 0, min: 0, sec: 06} ], 
      format: "HLS", 
      href: "http://bad-videos.dev.zype.com/video5/dH2vtLGAjHr6bd5w.m3u8",
      // href: "/videos/dH2vtLGAjHr6bd5w.m3u8",
      status: "bad" },

    { name: "Video #1", // GOOD
      id: 6,
      show_details: false,
      length: { hour: 0, min: 28, sec: 16}, 
      fails: [], 
      format: "MP4", 
      //href: "http://bad-videos.dev.zype.com/good-video1/ArduinoTheDocumentary.mp4",
      href: "/videos/ArduinoTheDocumentary.mp4",
      status: "good" },
    { name: "Video #2", // GOOD
      id: 7,
      show_details: false,
      length: { hour: 0, min: 14, sec: 48}, 
      fails: [], 
      format: "MP4", 
      // href: "http://bad-videos.dev.zype.com/good-video2/sintel-2048-stereo.mp4",
      href: "/videos/sintel-2048-stereo.mp4",
      status: "good" },
    { name: "Video #3", // GOOD
      id: 8,
      show_details: false,
      length: { hour: 0, min: 28, sec: 16}, 
      fails: [], 
      format: "HLS", 
      href: "http://bad-videos.dev.zype.com/good-video3/bipbopall.m3u8", 
      status: "good" }
  ];

}]);
