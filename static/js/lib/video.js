var video = angular.element(document.getElementById('ngVideo')).scope();

function init() {

  /*
   * Controls definitions
   */
  $("#btnMute").click(muteVideo);
  $("#btnEnlarge").click(enlargePlayer);
  $("#btnReduce").click(reducePlayer);
  $("#btnPause").click(pauseVideo);
  $("#btnResume").click(resumeVideo);
  $("#btnSeek10").click(function(){ seekVideo(10); });

  $(".tab-control").each(
    function(){
      var $tabControl = $(this);
      $tabControl.find("ul.tabs a").click(
        function(e){
          e.preventDefault();
          var $this = $(this);
          var targetID = $this.attr("href").substring(1);
          $this.parent().siblings().each(
            function(){ $(this).find("a").toggleClass("selected", false); }
          );
          $this.toggleClass("selected", true);
          $tabControl.find("div.tab-content").each(
            function(){
              if($(this).attr("id") == targetID) $(this).show();
              else $(this).hide();
            }
          );
        }
      );
      // show the first tab content item, and hide the rest
      $tabControl.find("div.tab-content").each(
        function(pIndex, pElement){
         if(pIndex != 0) $(pElement).hide();
         else $(pElement).show();
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
  try {
    console.log(msg);
  }
  catch(error){}
}

function setupAndPlayback(e) {
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
  if (e) e.preventDefault();

  var flashvars = {
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

  swfobject.embedSWF("/static/js/lib/video-js.swf", "videoPlayer", "100%", "100%", "10.3", "", flashvars, params, attributes);

}

function muteVideo(e) {
  var el = $("#videoPlayer")[0];
  var mute = !el.vjs_getProperty("muted");
  el.vjs_setProperty("muted", mute);
}

function enlargePlayer(){
  $("#videoPlayerWrapper").width(1024).height(640);
  $("#status").css("left", 1024);
  $(".controls").addClass('controls-large');
  $("#status").addClass('video-details-large')
}

function reducePlayer(e){
  $("#videoPlayerWrapper").width(800).height(500);
  $("#status").css("left", 800);
  $(".controls").removeClass('controls-large');
}

function onSWFReady(pObjectID){
  log("Function call: onSWFReady: " + pObjectID);

  setInterval(updatePlayerProperties, 250);
}

function setProperties(e){
  if (e) e.preventDefault();
  var el = $("#videoPlayer")[0];
  // console.log("setProperties done!");
}

function setSource(e){
  if (e) e.preventDefault();
  var el = $("#videoPlayer")[0];
  var src = $("#video_href").val();
  el.vjs_src(src);
  // console.log("setSource done!")
}

function playVideo(e){
  if (e) e.preventDefault();
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
  // console.log(el);
  el.vjs_resume();
}

function seekVideo(seconds){
  var el = $("#videoPlayer")[0];
  var currentTime = $("#propCurrentTime").html();
  var newTime = parseFloat(currentTime) + parseFloat(seconds);
  // console.log(currentTime, newTime);

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

  if(eventName == "playing" || eventName == "resume") $("#control").show();
  else if(eventName == "ended") replay();
  
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

/*
 * This method runs every time and updates the video properties 
 */
function updatePlayerProperties(){
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

  /* 
   * Checking if there are fails in the video and skipping forward if the fail is reached
   */
  if(video.currentVideo.fails.length > 0) {
    $.each(video.currentVideo.fails, function(fail) {
      var fail_time = (this.hour < 10 ? "0" + this.hour : this.hour) 
              + ":" + (this.min < 10 ? "0" + this.min : this.min) 
              + ":" + (this.sec  < 10 ? "0" + this.sec : this.sec);
      if(result == fail_time) seekVideo(30);

    });
  }

  var bufferKB = parseInt(el.vjs_getProperty("bufferedBytesEnd")/1024);
  var bufferMB = parseInt(bufferKB/1024);
  $("#currentBuffer").html("Buffered: " + bufferMB + " MB");

  /*
   * This are the video properties being refreshed in the frontend
   */
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
