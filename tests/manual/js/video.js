function init(){

        // control
        $("#btnEnlarge").click(enlargePlayer);
        $("#btnReduce").click(reducePlayer);
        $("#btnPause").click(pauseVideo);
        $("#btnResume").click(resumeVideo);
        $("#btnSeek5").click(
          function(){
            seekVideo(5);
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

      function enlargePlayer(e){
        e.preventDefault();
        $("#videoPlayerWrapper").width(1920).height(1080);
        $("#status").css("left", 1050);
      }

      function reducePlayer(e){
        e.preventDefault();
        $("#videoPlayerWrapper").width(640).height(480);
        $("#status").css("left", 850);
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
        if (e) {
          e.preventDefault();
        }
        var el = $("#videoPlayer")[0];
        el.vjs_src("http://bad-videos.dev.zype.com/good-video2/sintel-2048-stereo.mp4");
      }

      function playVideo(e){
        if (e) {
          e.preventDefault();
        }
        var el = $("#videoPlayer")[0];
        el.vjs_play();
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
        el.vjs_setProperty("currentTime", seconds);
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

      function pad2(num) {
         return (num < 10 ? '0' : '') + num;
      }

      function updatePlayerProperties(){

        var el = $("#videoPlayer")[0];
        
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

      $(window).load(function() { setupAndPlayback() });
