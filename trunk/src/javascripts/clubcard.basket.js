var clubcard = clubcard || {};

clubcard.basket = (function() {
  var basket = $('#basket');
  return {
    init: function() {
      $('.basket-btn.active').off('click').on('click', function() {
        return false;
      })

      $(document).on('change', '.checkout-amount .value-calculator input', function() {
        $(this).parents('form.update').addClass('enabled');
      });

      $(document).on('submit', '.checkout-item form.update', function() {
        var form = $(this);
        if (form.hasClass('enabled')) clubcard.basket.update(form);
        return false;
      });

      $(document).on('click', '.checkout-item .remove-item', function() {
        var item = $(this).parents('.checkout-item').find('input[name="product_id"]').val();
        if (!basket.hasClass('loading')) clubcard.basket.remove(item);
        return false;
      });
    },
    update: function(form) {
      basket.removeClass('error');
      $('body').addClass('loading');

      $.ajax({
        url: '../partials/ajax-basket.html',
        data: form.serialize(),
        type: 'POST',
        error: function(request, status, error) {
          basket.addClass('error');
        },
        success: function(data) {
          basket.html(data);
          basket.find('.value-calculator input.quantity').addSubtract({precision: 0});
          basket.find('.value-calculator input.value').addSubtract();
        },
        complete: function() {
          $('body').removeClass('loading');
        }
      });
    },
    remove: function(item) {
      basket.removeClass('error');
      $('body').addClass('loading');

      $.ajax({
        url: '../partials/ajax-basket.html',
        type: 'POST',
        data: item,
        error: function(request, status, error) {
          basket.addClass('error');
        },
        success: function(data) {
          basket.html(data);
          basket.find('.value-calculator input.quantity').addSubtract({precision: 0});
          basket.find('.value-calculator input.value').addSubtract();
        },
        complete: function() {
          $('body').removeClass('loading');
        }
      });
    },
    summary: {
      disable: function() {
        $('.dropdown-toggle.basket-btn').addClass('disabled');
      },
      enable: function() {
        $('.dropdown-toggle.basket-btn').removeClass('disabled');
      }
    }
  }
})();