var clubcard = clubcard || {};

clubcard.description = (function() {
  return {
    init: function() {
      $('.product-timer-container').countdown();
      clubcard.description.variants.init();

      // Calculate voucher cost
      $(document).on('change', '.product-variant-container .value-calculator input.quantity', function() {
        var value = parseFloat($(this).val() || 1) * parseFloat($(this).attr('data-unit-value'));
        $('.product-variant-container .product-value-amount span').html(value.toFixed(2));
      });
    },

    variants: (function() {
      var variants = $('.product-variant-container');

      return {
        init: function() {
          $(document).on('change', '.product-variant-controls select', function() {
            clubcard.description.variants.load();
          });
        },
        
        getSelectedVariants: function() {
          return variants.find('select,input').serializeObject();
        },

        load: function() {
          variants.removeClass('error');
          $('body').addClass('loading');
          variants.find('input,select,textarea').prop("disabled", true);
          
          $.ajax({
            url: '../partials/ajax-product-variant.html',
            data: clubcard.description.variants.getSelectedVariants(),
            error: function(request, status, error) {
              variants.addClass('error');
            },
            success: function(data) {
              variants.html(data);
              variants.find('.product-timer-container').countdown();
              variants.find('.value-calculator input.quantity').addSubtract({precision: 0});
              variants.find('.value-calculator input.value').addSubtract();
            },
            complete: function() {
              $('body').removeClass('loading');
              variants.find('input,select,textarea').prop("disabled", false);
            }
          });
        }
      }
    })()
  }
})();