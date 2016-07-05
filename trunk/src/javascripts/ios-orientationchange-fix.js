/*! A fix for the iOS orientationchange zoom bug.
Script by @scottjehl, rebound by @wilto.
MIT / GPLv2 License.
*/

/*
  Used a combonation of Scott's code from
  https://github.com/scottjehl/iOS-Orientationchange-Fix/blob/master/ios-orientationchange-fix.js
  and added in mixed in some code from
  https://github.com/jquery/jquery-mobile/blob/master/js/jquery.mobile.zoom.iosorientationfix.js
  and an OsVersion function from http://jsfiddle.net/ThinkingStiff/LJrEW/
*/

(function(window){

  function getOsVersion(){
    var agent = window.navigator.userAgent,
        start = agent.indexOf( 'OS ' );
    if( ( agent.indexOf( 'iPhone' ) > -1 || agent.indexOf( 'iPad' ) > -1 ) && start > -1 ){
        return window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
    } else {
        return 0;
    };
  };

  // This fix addresses an iOS bug, so return early if the UA claims it's something else or above iOS 6.0
  if (!(/iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1) && getOsVersion() >= 6.0){
    return;
  }

  if( !document.querySelector ){ return; }

  var meta = document.querySelector( "meta[name=viewport]" ),
      initialContent = meta && meta.getAttribute( "content" ),
      disabledZoom = initialContent + ",maximum-scale=1",
      enabledZoom = initialContent + ",maximum-scale=10",
      enabled = true,
      x, y, z, aig;

  // Check if there is a meta viewport and that it doesn't already have max scale added.
  if( !meta || !initialContent || initialContent.indexOf( "maximum-scale" ) !== -1 ){ return; }

  function restoreZoom(){
    meta.setAttribute( "content", enabledZoom );
    enabled = true;
  }

  function disableZoom(){
    meta.setAttribute( "content", disabledZoom );
    enabled = false;
  }

  function checkTilt(e){
    aig = e.accelerationIncludingGravity;
    x = Math.abs( aig.x );
    y = Math.abs( aig.y );
    z = Math.abs( aig.z );
    if ( !window.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ) {
      if ( enabled ) {
        disableZoom();
      }
    } else if ( !enabled ) {
      restoreZoom();
    }
  }

  try{
    window.addEventListener( "orientationchange", restoreZoom, false );
    window.addEventListener( "devicemotion", checkTilt, false );
  }catch(e){
    // fail silently?
  }
})(window);