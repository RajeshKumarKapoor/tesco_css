var clubcard = clubcard || {};

clubcard.checkout = (function() {
  return {
    init: function() {
      $(document).on('click', '.delivery-change-action a', function() {
        var target = $(this).hasClass('edit-address') ? $('.checkout-delivery-details-edit-address') : $('.checkout-delivery-details-edit-email');
        $('.checkout-delivery-details-summary').removeClass('edit');
        $('.checkout-delivery-details-edit').removeClass('active');

        target.addClass('active');
        $(this).parents('.checkout-delivery-details-summary').addClass('edit');
        return false;
      });

      $('.checkout-delivery-details-edit .btn-cancel').on('click', function() {
        $('.checkout-delivery-details-summary').removeClass('edit');
        $('.checkout-delivery-details-edit').removeClass('active');
        return false;
      });

      $('.find-address').on('click', function() {
        clubcard.checkout.findAddressOptions($('post_code').val());
        return false;
      });

      $('.checkout-delivery-details').each(function() {
        $(this).find('.btn-submit').addClass('disabled').prop('disabled', true);
      });

      $(document).on('change', '.checkout-delivery-details input.confirm', function(event) {
        if (event.handled !== true) {
          event.handled = true;
          var submit_button = $(this).parents('.checkout-delivery-details').find('.btn-submit');

          if (submit_button.hasClass('disabled')) {
            submit_button.removeClass('disabled').prop('disabled', false);
          } else {
            submit_button.addClass('disabled').prop('disabled', true);
          }
        }
      });

      $('.checkout-delivery-details-edit .btn-submit').on('click', function() {
        if (!$(this).parents('.checkout-delivery-details-edit').hasClass('loading')) clubcard.checkout.updateDeliveryDetails();
        return false;
      });

      $(document).on('change', '#selectAdress', function() {
        var option = $(this).find(':selected');
        var house = option.attr('data-house');
        var street = option.attr('data-street');
        var town = option.attr('data-town');

        $(this).parents('.control-group.choose_address').detach();
        $('.control-group.address').removeClass('hidden');
        $('#house').val(house);
        $('#street').val(street);
        $('#town').val(town);

        return false;
      });

      clubcard.checkout.toggleSubmitButton();

      $(document).on('change', '.payment-ctrl input', function() {
        clubcard.checkout.updateVoucherSummary();
      });

      $(document).on('click', 'input[name="add_voucher"]', function() {
        clubcard.checkout.addVoucher();
        return false;
      });
    },

    findAddressOptions: function() {
      var form = $('.checkout-delivery-details-edit-address');
      form.find('.control-group.choose_address').detach();

      form.removeClass('error');
      $('body').addClass('loading');
      form.find('input,select,textarea').prop('disabled', true);

      $.ajax({
        url: '../partials/ajax-checkout-find-address.html',
        data: form.find('#post_code').val(),
        error: function(request, status, error) {
          form.addClass('error');
        },
        success: function(data) {
          form.find('.control-group.address').addClass('hidden');
          form.find('.control-group.find_address').after($(data));
        },
        complete: function() {
          $('body').removeClass('loading');
          form.find('input,select,textarea').prop('disabled', false);
        }
      });
    },

    updateDeliveryDetails: function() {
      var form = $('.checkout-delivery-details-edit.active');

      form.removeClass('error');
      $('body').addClass('loading');
      form.find('input,select,textarea').prop('disabled', true);

      $.ajax({
        url: '../partials/ajax-checkout-update-delivery-details.html',
        data: form.parents('form').serialize(),
        error: function(request, status, error) {
          form.addClass('error');
        },
        success: function(data) {
          $('.checkout-delivery-details-edit').removeClass('active');
          $('.checkout-delivery-details-edit .confirm').prop('checked', false);
          $('.checkout-delivery-details-edit .btn-submit').addClass('disabled').prop('disabled', true);
          $('.checkout-delivery-details-summary').removeClass('edit').html(data);
        },
        complete: function() {
          $('body').removeClass('loading');
          form.find('input,select,textarea').prop('disabled', false);
        }
      });
    },

    updateVoucherSummary: function() {
      var container = $('.voucher-payment-container');

      container.removeClass('error');
      $('body').addClass('loading');
      container.find('input,select,textarea').prop('disabled', true);
      clubcard.checkout.toggleSubmitButton();

      $.ajax({
        url: '../partials/ajax-checkout-vouchers.html',
        data: clubcard.checkout.selectedVouchers(),
        type: 'POST',
        error: function(request, status, error) {
          container.addClass('error');
        },
        success: function(data) {
          container.html(data);
        },
        complete: function() {
          $('body').removeClass('loading');
          container.find('input,select,textarea').prop('disabled', false);
          clubcard.checkout.toggleSubmitButton();
        }
      });
    },

    addVoucher: function() {
      var container = $('.voucher-payment-container');

      container.removeClass('error');
      $('body').addClass('loading');
      container.find('input,select,textarea').prop('disabled', true);
      clubcard.checkout.toggleSubmitButton();

      $.ajax({
        url: '../partials/ajax-checkout-vouchers.html',
        data: container.parents('form').serialize(),
        type: 'POST',
        error: function(request, status, error) {
          container.addClass('error');
        },
        success: function(data) {
          container.html(data);
        },
        complete: function() {
          $('body').removeClass('loading');
          container.find('input,select,textarea').prop('disabled', false);
          clubcard.checkout.toggleSubmitButton();
        }
      });
    },

    selectedVouchers: function() {
      return $.map($('.payment-voucher input'), function(value, index) {
        return $(value).attr('data-voucher-code');
      });
    },

    balanceRemaining: function() {
      return parseFloat($('#balance_remaining').attr('data-amount'));
    },

    toggleSubmitButton: function() {
      var submit_button = $('.checkout-review-review input');
      if (!$('.voucher-payment-container').is('.loading, .error') && (clubcard.checkout.balanceRemaining() <= 0)) {
        submit_button.removeClass('disabled').prop('disabled', false);
      } else {
        submit_button.addClass('disabled').prop('disabled', true);
      }
    }
  }
})();