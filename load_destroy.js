//https://stackoverflow.com/questions/43887415/pace-js-never-reaches-100

var initDestroyTimeOutPace = function() {
    var counter = 0;

    var refreshIntervalId = setInterval( function(){
        var progress; 

        if( typeof $( '.pace-progress' ).attr( 'data-progress-text' ) !== 'undefined' ) {
            progress = Number( $( '.pace-progress' ).attr( 'data-progress-text' ).replace("%" ,'') );
        }

        if( progress === 98 ) {
            counter++;
        }

        if( counter > 10 ) {
            clearInterval(refreshIntervalId);
            Pace.stop();
        }
    }, 100);
}
initDestroyTimeOutPace();
