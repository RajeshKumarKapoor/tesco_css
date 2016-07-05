$(document).ready(function() {

  var widget = $('#tesco_cookie_widget');

  var accept = function() {
    document.cookie = 'tesco_cookie_accepted=1; path=/; expires=Mon, 18 Jan 2038 01:23:45 GMT';
    widget.detach();
  }

  if (widget.length > 0) {
    var existing_cookie = document.cookie.match ('(^|;) ?tesco_cookie_accepted=([^;]*)(;|$)');

    if ((existing_cookie) && (1 == unescape(existing_cookie[2]))) accept();

    widget.find('#tesco_cookie_accept').on('click', function() {
      accept();
      return false;
    });
  }
});