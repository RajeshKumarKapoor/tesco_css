var clubcard = clubcard || {};

clubcard.locationSearch = (function() {

  var form = null;
  var perPage = 5;
  var totalPages = 0;
  var currentPage = 1;

  return {
    init: function() {
      form = $('#map-search');
      if (form.length > 0) {
        clubcard.locationSearch.paginate(1);
        form.on('submit', clubcard.locationSearch.getResults);
      }
      $(document).on('click', '.map-search-pagination .next a', clubcard.locationSearch.nextPage);
      $(document).on('click', '.map-search-pagination .prev a', clubcard.locationSearch.prevPage);
    },

    getResults: function() {
      form.removeClass('error');
      $('body').addClass('loading');
      form.find('input,select,textarea').prop('disabled', true);

      $.ajax({
        url: '../partials/ajax-location-search-results.html',
        data: form.serialize(),
        success: function(data) {
          $('.map-search-display').html(data);
          clubcard.locationSearch.paginate(1);
          clubcard.map.init();
        },
        error: function(request, status, error) {
          form.addClass('error');
        },
        complete: function() {
          $('body').removeClass('loading');
          form.find('input,select,textarea').prop('disabled', false);
        }
      });

      return false;
    },

    paginate: function(page) {
      var results = $('.map-search-results li');
      totalPages = Math.ceil(results.length / perPage);

      if ((page > 0) && (totalPages >= page)) {
        currentPage = page;
        results.removeClass('visible');
        results.slice(((page - 1) * perPage), (perPage * page)).addClass('visible');
        //pagination requires 
        $('.map-search-count').html(((page - 1) * perPage) + 1 + ' to ' + (perPage * page) + ' of ' + results.length);


      }

      $('.map-search-pagination-controls a').removeClass('disabled');
      if (page >= totalPages) $('.map-search-pagination .next a').addClass('disabled');
      if (page <= 1) $('.map-search-pagination .prev a').addClass('disabled');
    },

    nextPage: function() {
      if (totalPages > currentPage) clubcard.locationSearch.paginate(currentPage+1);
      return false;
    },

    prevPage: function() {
      if (currentPage > 1) clubcard.locationSearch.paginate(currentPage-1);
      return false;
    }
  }
})();