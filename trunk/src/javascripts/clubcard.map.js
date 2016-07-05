var clubcard = clubcard || {};

// Callback initiated by Bing Maps AJAX control, as specified by onscriptload parameter in script tag.
function loadMap() {
  clubcard.map.init();
}

var bingApiKey = "AhpCRJmtdXCWiiS8lZFuoUbkZgk8Mn-hFuhFfomrXmARkYT-VflqQA79Ly92eu0C";

clubcard.map = (function() {
  var map = null;
  var map_element = null;
  var pins = null;
  var infoBoxes = null;
  var listing_selector = '.map-search-results li';

  return {
    init: function() {
      map_element = $('#location-map');

      if (map_element.length > 0) {
        map = new Microsoft.Maps.Map(map_element[0], { credentials: bingApiKey });

        $(document).on('click', listing_selector, function(event) {
          var index = $(listing_selector).index(this);
          clubcard.map.pinClickHandler(index);
          return false;
        });

        clubcard.map.addPins();
      }
    },

    addPins: function() {
      map.entities.remove(pins);
      map.entities.remove(infoBoxes);

      pins = new Microsoft.Maps.EntityCollection();
      infoBoxes = new Microsoft.Maps.EntityCollection();
      
      clubcard.map.addOriginPin();
      clubcard.map.addResultPins();
      clubcard.map.setBounds();

      map.entities.push(pins);
      map.entities.push(infoBoxes);
    },

    addOriginPin: function() {
      var origin_latitude  = map_element.data('origin-latitude');
      var origin_longitude = map_element.data('origin-longitude');
      var origin_location  = new Microsoft.Maps.Location(origin_latitude, origin_longitude);

      pins.push(new Microsoft.Maps.Pushpin(origin_location)); 
    },

    addResultPins: function() {


      $(listing_selector).each(function(index, result) {

        var latitude         = $(result).data('latitude');
        var longitude        = $(result).data('longitude');
        var pinLabel         = String(index+1);
        var popupTitle       = $(result).find('h3').html();
        var popupTitleTxt       = $(result).find('h3').text();
        var popupTxtParagraphs        = $(result).find('.location');
        var location         = new Microsoft.Maps.Location(latitude, longitude);
        var CHARS_INLINE     = 22   //approx 24 char to a line 


        //calculate required height of popup pin determined by number of characters in the title and text
        var noOfLines = Math.ceil(popupTitleTxt.length / CHARS_INLINE);

        //for each p tag in result item need to determine how may lines it will occupy
        popupTxtParagraphs.each(function(i, v) {
          noOfLines = noOfLines + Math.ceil($(this).text().length / CHARS_INLINE);
        })

        var infoBoxHeight = (noOfLines * 20) + 20;
        console.log(infoBoxHeight)

        var pin = new Microsoft.Maps.Pushpin(location, {
          text: pinLabel,
          icon: '../img/interface/icon-map-pin.png',
          width: 24,
          height: 29,
          typeName: 'pinStyle'
        }); 
        pins.push(pin);

        infoBoxes.push(new Microsoft.Maps.Infobox(pin.getLocation(), {
          description: $(result).html(),
          visible: false,
          offset: new Microsoft.Maps.Point(0, 30),
          width: 290,
          height: infoBoxHeight
        }));

        Microsoft.Maps.Events.addHandler(pin, 'click', function() {
          clubcard.map.pinClickHandler(index);
        });
      });

    },

    setBounds: function() {
      var locations = [];
      for (var i = 0; i < pins.getLength(); i++) locations.push(pins.get(i).getLocation());
      map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations(locations) });
    },

    pinClickHandler: function(pinIndex) {
      clubcard.map.hideInfoBoxes();
      var infoBox = infoBoxes.get(pinIndex);
      infoBox.setOptions({ visible: true });
      map.setView({ center: infoBox.getLocation() });
      $(listing_selector + ':eq(' + pinIndex + ')').addClass('active');
    },

    hideInfoBoxes: function() {
      for (var i = 0; i < infoBoxes.getLength(); i++) infoBoxes.get(i).setOptions({ visible: false });
      $(listing_selector).removeClass('active');
    }
  }
})();