$( document ).ready(function() {
    $(".openVideo").click(function(){
        if($("#format").val() == "MP4") {
            $.getScript( "static/js/lib/video.js" )
              .done(function( script, textStatus ) {
                // console.log( textStatus );
                setupAndPlayback();
              })
              .fail(function( jqxhr, settings, exception ) {
                console.log("Error loading video script"); 
            });
        }
    });
});


