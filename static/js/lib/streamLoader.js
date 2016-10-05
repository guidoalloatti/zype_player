videojs.options.flash.swf = "/static/js/lib/video-js.swf";

function userSubmit() {
    loadStream(document.getElementById('userInput').value);
}

function loadStream(url) {
    var $vid_obj = _V_("hls_player");
    
    $vid_obj.src(url);
    $vid_obj.on('loadstart',function(){
      $vid_obj.play();
    });
}
