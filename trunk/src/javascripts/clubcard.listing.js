var clubcard = clubcard || {};

clubcard.listing = (function() {
  var listing = $('.product-listings');
  var currentPage = 1;
  var totalPages = 1;

  return {
    init: function() {

      clubcard.listing.setTotalPages($('.product-listings').attr('data-total-pages'));

      // Make whole row clickable.
      $(document).on('click', '.listing-item', function(e) {
        $(this).find('.listing-title a').first().trigger('click');
      });

      // Re-implement the anchor click event as it may be triggered by the listing-item click event.
      $(document).on('click', '.listing-item .listing-title a', function(e) {
        e.stopPropagation(); // Don't bubble back up to the listing-item
        e.preventDefault();
        clubcard.listing.redirect($(this).attr('href'));
      });

      // Show all link on pagination
      if ($('.pagination').length > 0) {
        clubcard.listing.infiniteScroll.init();
      }

      // Sort listing
      $(document).on('change', '#sort-select', function(e) {
        clubcard.listing.sort();
      });

      // Page links
      $(document).on('click', '.pagination li a', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!$(this).parent().hasClass('disabled')) {
          clubcard.listing.setCurrentPage($(this).attr('data-page'));
        }
      });

      clubcard.listing.facetNav.init();
    },
    redirect: function(url) {
      window.location = url;
    },
    sort: function() {
      clubcard.listing.reset();
    },
    filter: function() {
      clubcard.listing.reset();

      // Add facet clear buttons
      if (($('.facet-nav-heading .clear-btn').length == 0) && ($('input[name^="facets[]"]:checked').length > 0)) {
        $('.facet-nav-heading p').after('<a href="#" class="clear-btn">Clear all</a>');
      }
      $('.facet-nav .facet').each(function() {
        var facet = $(this);
        if ((facet.find('.clear-btn').length == 0) && (facet.find('input[name^="facets[]"]:checked').length > 0)) {
          facet.find('.facet-items').prepend('<div class="clear-facet"><a href="#" class="clear-btn">Clear</a></div>');
        }
      });
    },
    reset: function() {
      $('.pagination li').removeClass('selected');
      $('.pagination li.first').addClass('selected');
      clubcard.listing.setCurrentPage(1);
    },
    getSortOrder: function() {
      return $('#sort-select').val();
    },
    getTotalPages: function() {
      return totalPages;
    },
    setTotalPages: function(new_total) {
      totalPages = parseInt(new_total) || 1;
    },
    getCurrentPage: function() {
      return currentPage;
    },
    setCurrentPage: function(new_page) {
      currentPage = parseInt(new_page);
      clubcard.listing.loadPage();
    },
    getSelectedFacets: function() {
      return $('.facet-items input').serializeObject();
    },
    loadPage: function() {
      listing.removeClass('error');

      var loading_element = $('.paging-display').hasClass('all') ? listing : $('body');
      loading_element.addClass('loading');

      $.ajax({
        url: '../partials/ajax-listing-page.html',

        data: $.extend({
          order: clubcard.listing.getSortOrder()
        }, clubcard.listing.getSelectedFacets()),

        error: function(request, status, error) {
          listing.addClass('error');
        },
        success: function(data) {
          var newTotalPages = $(data).find('.product-listings').attr('data-total-pages');
          clubcard.listing.setTotalPages(newTotalPages);

          if ($('.paging-display').hasClass('all')) {
            var rows = $(data).find('.listing-item');
            if (clubcard.listing.getCurrentPage() == 1) listing.children(':not(.load-message)').detach();
            if (listing.find('ul').length == 0) listing.prepend('<ul></ul>')
            listing.find('ul').append(rows);
          } else {
            $('#content').html($(data).html());
            listing = $('.product-listings');

            clubcard.listing.facetNav.createAccordion();

            if (clubcard.desktopLayout) {
              clubcard.listing.facetNav.openPanels();
            } else {
              clubcard.listing.facetNav.openPanels(clubcard.listing.facetNav.panels().first());
              clubcard.mobileFacet.init();
              clubcard.mobileFacet.close();
            }
          }

        },
        complete: function() {
          loading_element.removeClass('loading');
        }
      });
    },
    facetNav: (function() {
      var accordion = null;

      return {
        init: function() {

          clubcard.listing.facetNav.createAccordion();

          // Facet checkboxes
          $(document).on('change', '.facet-items input', function(e) {
            var facet = $(this).parents('.facet');
            var option = $(this).parents('li');

            if ($(this).attr('type') == 'radio') facet.find('li').removeClass('selected');
            ($(this).prop('checked') == true) ? option.addClass('selected') : option.removeClass('selected');

            if (facet.find('input[name^="facets[]"]:checked').length == 0) facet.find('.clear-facet .clear-btn').parent().detach();
            if ($('input[name^="facets[]"]:checked').length == 0) $('.facet-nav-heading .clear-btn').detach();
            clubcard.listing.filter();
          });

          // Facet clear buttons
          $(document).on('click', '.facet-nav-heading .clear-btn', function(e) {
            $('input[name^="facets[]"]').prop('checked', false);
            $(this).detach();
            $('.facet .clear-btn').each(function() {
              $(this).parent().detach();
            });
            
            $('.facet.sub-facet').removeClass('active');
            $('.facet').removeClass('child-open');
            $('.facet li').removeClass('selected');
            clubcard.listing.filter();
          });

          $(document).on('click', '.facet .clear-btn', function(e) {
            var facet = $(this).parents('.facet');
            facet.find('li').removeClass('selected');
            facet.find('input[name^="facets[]"]').prop('checked', false);
            $(this).parent().detach();
            if ($('input[name^="facets[]"]:checked').length == 0) $('.facet-nav-heading .clear-btn').detach();
            clubcard.listing.filter();
          });

          // Sub-facets
          $(document).on('click', '.facet a[data-child]', function() {
            var child = $('.sub-facet#' + $(this).attr('data-child'));
            if (child.length == 0) return console.error("Can't find element with selector .sub-facet#" + $(this).attr('data-child'))
            $('.sub-facet').removeClass('active');
            child.addClass('active');
            $(this).parents('.facet').addClass('child-open');
            return false;
          });

          $(document).on('click', '.facet.sub-facet .back-btn', function(e) {
            var facet = $(this).parents('.facet');
            var parent = $('.facet#' + facet.attr('data-parent'));
            if (parent.length == 0) return console.error("Can't find element with selector .facet#" + facet.attr('data-parent'))
            facet.removeClass('active');
            parent.removeClass('child-open');
            e.preventDefault();
          });
        },
        createAccordion: function() {
          accordion = $(".facet-accordion");
          accordion.accordion({
            groupElems: '.facet', 
            headingElems: '.facet-heading',
            bodyElems: '.facet-items',
            innerElems: '.facet-inner' 
          });
        },
        panels: function() {
          return accordion.find('.facet');
        },
        openPanels: function(panels) {
          if (typeof panels === "undefined") panels = clubcard.listing.facetNav.panels();
          if (accordion.length > 0) {
            accordion.data("accordion").closePanel(clubcard.listing.facetNav.panels().filter(':not(.sub-facet)'));
            accordion.data("accordion").openPanel(panels);
            accordion.data("accordion").openPanel(accordion.find('.facet.sub-facet'));
          }
        }
      }
    })(),
    infiniteScroll: (function() {
      return {
        init: function() {
          $(document).on('click', '.pagination .show-all a', function(e) {
            if (!$('.paging-display').hasClass('all')) {
              e.stopPropagation();
              e.preventDefault();
              $('.paging-display').addClass('all');
              $(window).on('scroll', clubcard.listing.infiniteScroll.scroll);
              clubcard.listing.reset();
            }
          });
        },
        scroll: function() { 
          var page = clubcard.listing.getCurrentPage();
          if ((page < clubcard.listing.getTotalPages()) && ($(window).scrollTop() > ($('.listing-item:last').offset().top - $(window).height() - 100))) {
            clubcard.listing.setCurrentPage(page + 1);
          }
        }
      }
    })()
  }
})();