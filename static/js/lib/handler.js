$( document ).ready(function() {
    $(".openVideo").click(function(){
        $.getScript( "static/js/lib/video.js" )
          .done(function( script, textStatus ) {
            console.log( textStatus );
            // var scope = angular.element(document.getElementById('ngModal')).scope();
            // console.log("Scope!");
            // console.log(scope);
            setupAndPlayback();
            // enlargePlayer();
          })
          .fail(function( jqxhr, settings, exception ) {
            console.log("Error loading video script"); 
            //$( "div.log" ).text( "Triggered ajaxError handler." );
        });
    })
});


