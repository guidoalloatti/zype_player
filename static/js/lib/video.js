function init() {

  // control
  $("#btnMute").click(muteVideo);
  $("#btnEnlarge").click(enlargePlayer);
  $("#btnReduce").click(reducePlayer);
  $("#btnPause").click(pauseVideo);
  $("#btnResume").click(resumeVideo);
  $("#btnSeek10").click(
    function(){
      seekVideo(10);
    }
  );

  $(".tab-control").each(
      function(){
        var $tabControl = $(this);
        // tabs
        $tabControl.find("ul.tabs a").click(
          function(e){
            e.preventDefault();
            var $this = $(this);
            var targetID = $this.attr("href").substring(1);
            $this.parent().siblings().each(
              function(){
                $(this).find("a").toggleClass("selected", false);
              }
            );
            $this.toggleClass("selected", true);
            $tabControl.find("div.tab-content").each(
              function(){
                if($(this).attr("id") == targetID){
                  $(this).show();
                }
                else{
                  $(this).hide();
                }
              }
            );
          }
        );
        // show the first tab content item, and hide the rest
        $tabControl.find("div.tab-content").each(
          function(pIndex, pElement){
           if(pIndex != 0){
             $(pElement).hide();
           }
           else{
             $(pElement).show();
           }
          }
        );
      }
    );

    // to avoid a bunch of lookups every 100ms, let's cache some elements in horrible
    // global vars for the properties table
    $propCurrentSrc = $("#propCurrentSrc");
    $propCurrentTime = $("#propCurrentTime");
    $propTime = $("#propTime");
    $propDefaultPlaybackRate = $("#propDefaultPlaybackRate");
    $propDuration = $("#propDuration");
    $propEnded = $("#propEnded");
    $propPaused = $("#propPaused");
    $propMuted = $("#propMuted");
    $propVolume = $("#propVolume");
    $propSeeking = $("#propSeeking");
    $propNetworkState = $("#propNetworkState");
    $propReadyState = $("#propReadyState");
    $propBufferedBytesStart = $("#propBufferedBytesStart");
    $propBufferedBytesEnd = $("#propBufferedBytesEnd");
    $propBytesTotal = $("#propBytesTotal");
    $propVideoWidth = $("#propVideoWidth");
    $propVideoHeight = $("#propVideoHeight");

}

function log(msg){
  try{
    console.log(msg);
  }
  catch(error){}
}

function setupAndPlayback(e) {
  var modal = angular.element(document.getElementById('ngModal')).scope();
  var video = angular.element(document.getElementById('ngVideo')).scope();

  console.log("Scope!");
  console.log(modal);
  console.log(video);

  createSWF(e);
  setTimeout(waitForSWF, 100);
}

function waitForSWF() {
  var vid = $("#videoPlayer")[0];
  log("Waiting for the SWF to be loaded...");
  if (vid.hasOwnProperty("vjs_setProperty")) {
    setProperties();
    setSource();
    playVideo();
  }
  else {
    setTimeout(waitForSWF, 100);
  }
}

function createSWF(e){
  $("#status").addClass('video-details-large')
  if (e) {
    e.preventDefault();
  }

  var flashvars = {
    // readyFunction: "onSWFReady",
    // eventProxyFunction: "onSWFEvent",
    // errorEventProxyFunction: "onSWFErrorEvent",
    src: "",
    autoplay: false,
    preload: 'none',
  };

  var params = {
    allowScriptAccess: "always",
    bgcolor: "#000000"
  };

  var attributes = {
    id: "videoPlayer",
    name: "videoPlayer"
  };

  swfobject.embedSWF("../../dist/video-js.swf", "videoPlayer", "100%", "100%", "10.3", "", flashvars, params, attributes);

}

function muteVideo(e) {
  var el = $("#videoPlayer")[0];
  var mute = !el.vjs_getProperty("muted");
  el.vjs_setProperty("muted", mute);
}

function enlargePlayer(){
  console.log("Enlarge!");
  // e.preventDefault();
  $("#videoPlayerWrapper").width(860).height(600);
  $("#status").css("left", 850);
  $(".controls").addClass('controls-large');
  $("#status").addClass('video-details-large')
}

function reducePlayer(e){
  e.preventDefault();
  $("#videoPlayerWrapper").width(480).height(270);
  $("#status").css("left", 550);
  $(".controls").removeClass('controls-large');
}

function onSWFReady(pObjectID){
  log("Function call: onSWFReady: " + pObjectID);

  setInterval(updatePlayerProperties, 250);
}

function setProperties(e){
  if (e) {
    e.preventDefault();
  }
  var el = $("#videoPlayer")[0];
  // el.vjs_setProperty("eventProxyFunction", "onSWFEvent");
  // el.vjs_setProperty("errorEventProxyFunction", "onSWFErrorEvent");
}

function setSource(e){
  if (e) e.preventDefault();
  var el = $("#videoPlayer")[0];
  var src = $("#video_href").val();
  // console.log(src);
  el.vjs_src(src);
}

function playVideo(e){
  if (e) {
    e.preventDefault();
  }
  var el = $("#videoPlayer")[0];
  el.vjs_play();
  enlargePlayer(e);
}

function pauseVideo(e){
  var el = $("#videoPlayer")[0];
  el.vjs_pause();
}

function resumeVideo(e){
  var el = $("#videoPlayer")[0];
  el.vjs_resume();
}

function seekVideo(seconds){
  var el = $("#videoPlayer")[0];
  var currentTime = $("#propCurrentTime").html();
  // console.log(currentTime);
  // el.vjs_setProperty("currentTime", seconds);
  var newTime = parseFloat(currentTime) + parseFloat(seconds);
  console.log(currentTime, newTime);

  el.vjs_setProperty("currentTime", parseFloat(newTime));
}

function replay(){
  var el = $("#videoPlayer")[0];
  el.vjs_pause();
  el.vjs_setProperty('currentTime', 0);
  el.vjs_pause();
}

function onSWFEvent(swfID, eventName){
  var $el = $("#events");
  var time = new Date();
  $el.append(pad2(time.getHours()) + ":" + pad2(time.getMinutes()) + ":" + pad2(time.getSeconds()) + " - " + eventName + "<br/>");
  $el[0].scrollTop = $el[0].scrollHeight;

  if(eventName == "playing" || eventName == "resume"){
    $("#control").show();
  }
  else if(eventName == "ended"){
    replay();
  }
}

function onSWFErrorEvent(swfID,eventName){
  var $el = $("#errorEvents");
  var time = new Date();
  $el.append(pad2(time.getHours()) + ":" + pad2(time.getMinutes()) + ":" + pad2(time.getSeconds()) + " - " + eventName + "<br/>");
  $el[0].scrollTop = $el[0].scrollHeight;
}

function toggleVideoDetails() {
  $("#status").toggle();
}

function pad2(num) {
   return (num < 10 ? '0' : '') + num;
}

function updatePlayerProperties(){
  console.log("updatePlayerProperties");
  var el = $("#videoPlayer")[0];

  var totalSec = el.vjs_getProperty("duration");
  var hours = parseInt( totalSec / 3600 ) % 24;
  var minutes = parseInt( totalSec / 60 ) % 60;
  var seconds = parseInt( totalSec % 60 );
  var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
  $("#videoDuration").html(result);

  totalSec = el.vjs_getProperty("currentTime");
  hours = parseInt( totalSec / 3600 ) % 24;
  minutes = parseInt( totalSec / 60 ) % 60;
  seconds = parseInt( totalSec % 60 );
  result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
  $("#videoCurrentTime").html(result);

  $propCurrentSrc.html(el.vjs_getProperty("currentSrc"));
  $propCurrentTime.html(el.vjs_getProperty("currentTime"));
  $propTime.html(el.vjs_getProperty("time"));
  $propDefaultPlaybackRate.html(el.vjs_getProperty("defaultPlaybackRate"));
  $propDuration.html(el.vjs_getProperty("duration")); // would normally be cached on durationchange
  $propEnded.html(el.vjs_getProperty("ended").toString());
  $propPaused.html(el.vjs_getProperty("paused").toString());
  $propMuted.html(el.vjs_getProperty("muted").toString());
  $propVolume.html(el.vjs_getProperty("volume"));
  $propSeeking.html(el.vjs_getProperty("seeking").toString());
  $propNetworkState.html(el.vjs_getProperty("networkState"));
  $propReadyState.html(el.vjs_getProperty("readyState"));
  $propBufferedBytesStart.html(el.vjs_getProperty("bufferedBytesStart"));
  $propBufferedBytesEnd.html(el.vjs_getProperty("bufferedBytesEnd"));
  $propBytesTotal.html(el.vjs_getProperty("bytesTotal")); // would normally be cached on metadata
  $propVideoWidth.html(el.vjs_getProperty("videoWidth"));  // would normally be cached on metadata or playstart
  $propVideoHeight.html(el.vjs_getProperty("videoHeight")); // would normally be cached on metadata or playstart
}

var videojs = {};
videojs.Flash = {};
videojs.Flash.onEvent = onSWFEvent;
videojs.Flash.onError = onSWFErrorEvent;
videojs.Flash.onReady = onSWFReady;

$(init);

$(window).load(function() { setupAndPlayback(); });
