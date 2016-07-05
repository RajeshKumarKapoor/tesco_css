var clubcard = clubcard || {};

clubcard.init = function() {
  clubcard.checkLayout();

  if ($(".datepicker").size()) {
    $(".datepicker").datepicker();
  }
  //add placeholder polyfill to form elements for Old IE 
  $('input, textarea').placeholder();

  $('.value-calculator input.quantity').addSubtract({precision: 0});
  $('.value-calculator input.value').addSubtract();

  $('#back-to-top').on('click', function() {
    $('html, body').animate({
      scrollTop: $('#top').offset().top
    }, 500);
    return false;
  });

  clubcard.listing.init();
  clubcard.description.init();
  clubcard.basket.init();
  clubcard.checkout.init();
  clubcard.locationSearch.init();

  //zakas skipto focus hack 
  $(window).bind("hashchange", function(event) {
    var element = document.getElementById(location.hash.substring(1));
    if (element) {
      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
        element.tabIndex = -1;
      }
      element.focus();
    }
  });

  //instantiate global page accordions
  clubcard.contentAccordion.init();
  clubcard.contactPageAccordion.init();
  clubcard.productBrowserAccordion.init();

  //functions to destroy other layout JS
  if (clubcard.mobileLayout) {
    clubcard.desktop.destroy();
    clubcard.tablet.destroy();
    clubcard.mobile.init();
  } else if (clubcard.tabletLayout) {
    clubcard.mobile.destroy();
    clubcard.desktop.destroy();
    clubcard.tablet.init();
  } else {
    clubcard.mobile.destroy();
    clubcard.tablet.destroy();
    clubcard.desktop.init();
  }

  // Resize
  $(window).resize(function() {
    clubcard.checkLayout();
    clubcard.reRenderPage();
  });
}

clubcard.checkLayout = function() {
  if ((typeof Modernizr != 'undefined') && Modernizr.mq('only screen and (max-width: 599px)')) {
    clubcard.mobileLayout  = true;
    clubcard.tabletLayout  = false;
    clubcard.desktopLayout = false;
  }
  else if ((typeof Modernizr != 'undefined') && Modernizr.mq('only screen and (min-width:600px) and (max-width: 959px)')) {
    clubcard.mobileLayout  = false;
    clubcard.tabletLayout  = true;
    clubcard.desktopLayout = false;
  } else {
    clubcard.mobileLayout  = false;
    clubcard.tabletLayout  = false;
    clubcard.desktopLayout = true;
  }
}

clubcard.reRenderPage = function() {
  if (clubcard.mobileLayout) {
    clubcard.desktop.destroy();
    clubcard.tablet.destroy();
    clubcard.mobile.resize();
  } else if (clubcard.tabletLayout) {
    clubcard.mobile.destroy();
    clubcard.desktop.destroy();
    clubcard.tablet.resize();
  } else {
    clubcard.mobile.destroy();
    clubcard.tablet.destroy();
    clubcard.desktop.resize();
  }
}

$(document).ready(function() {
  clubcard.init();
});