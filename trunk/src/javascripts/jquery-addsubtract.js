/*!
 * jQuery addsubtract plugin
 * Author: @stevelorek
 * Licensed under the MIT license
 */
(function($) {
  $.fn.extend({
    addSubtract: function(params) {


      return this.each(function() {

        var options = $.extend({
          step: 1,
          minimum: 0,
          maximum: null,
          precision: 2
        }, params);
        
        var input = $(this);

        if (input.is('input[type="text"]')) {

          var parsedValue = function() {
            return parseFloat(input.val() || 1);
          };

          var getOptions = function(input) {
            var inputOptions = options;
            if (input.attr('data-step')) inputOptions.step = parseFloat(input.attr('data-step'));
            if (input.attr('data-min')) inputOptions.minimum = parseFloat(input.attr('data-min'));
            if (input.attr('data-max')) inputOptions.maximum = parseFloat(input.attr('data-max'));
            if (input.attr('data-precision')) inputOptions.precision = parseFloat(input.attr('data-precision'));
            return inputOptions;
          }

          inputOptions = getOptions(input);
          
          input.after('<a class="addition">Add</a>');

          (input.siblings('.currency-symbol')[0] ? $(input.siblings('.currency-symbol')[0]) : input).before('<a class="subtract">Subtract</a>');

          if ((inputOptions.minimum != null) && (parsedValue() == inputOptions.minimum)) input.siblings('a.subtract').addClass('disabled');
          if ((inputOptions.maximum != null) && (parsedValue() == inputOptions.maximum)) input.siblings('a.addition').addClass('disabled');

          // Allow only numeric input
          input.bind('keypress', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);

            //todo: add decimal point as char inside accepted regex

            if ((e.charCode != 0) && !/^(\d+)?(\.(\d+)?)?$/.test(input.val() + String.fromCharCode(code))) e.preventDefault();
          });

          input.bind('keypress', function(e) {
            if (e.keyCode == 13){
              input.trigger('validate');
              input.trigger('change');
              e.preventDefault();
              e.stopPropagation();
            } 

          });

          input.bind('blur', function() {
            inputOptions = getOptions(input);
            input.trigger('validate');
            if (isNaN(parsedValue())) input.val(inputOptions.minimum).trigger('change');
          });

          input.bind('validate', function(){
            inputOptions = getOptions(input);
            //users shouldn't be allowed to enter values which are not in multiples of the voucher cost
            //add in clause to detect if the current value is a multiple of the unit (modulus)
            var modulusVal = input.val() % inputOptions.step;
            if( modulusVal != 0 ){
              input.val(input.val()-modulusVal).trigger('change'); //subtracting modulus to round down every time
            }

            //need to detect whether a product is money exchange 
            if(input.siblings('.currency-symbol')[0]){

              //prompt decimal place and display as a monetary value
              input.val(Number(input.val()).toFixed(2));

            }else{
              //strip back decimals to integer value only
              input.val(parseInt(input.val()));
            }

          });

          input.bind('change', function() {
            inputOptions = getOptions(input);
            if (input.val() == '' ||  isNaN(input.val())) return input.val(1).trigger('change');
            if ((inputOptions.minimum != null) && (parsedValue() < inputOptions.minimum)) input.val(inputOptions.minimum).trigger('change');
            if ((inputOptions.maximum != null) && (parsedValue() > inputOptions.maximum)) input.val(inputOptions.maximum).trigger('change');

            input.siblings('a.addition, a.subtract').removeClass('disabled');
            if ((inputOptions.minimum != null) && (parsedValue() == inputOptions.minimum)) input.siblings('a.subtract').addClass('disabled');
            if ((inputOptions.maximum != null) && (parsedValue() == inputOptions.maximum)) input.siblings('a.addition').addClass('disabled');


            //add clause to detect for precision? how to enforce decimal?
          });

          input.siblings('a.subtract').click(function() {
            inputOptions = getOptions(input);
            var newValue = parsedValue() - inputOptions.step;
            if ((input.prop('disabled') == false) && ((inputOptions.minimum == null) || ((inputOptions.minimum != null) && (newValue >= inputOptions.minimum)))) input.val(newValue.toFixed(inputOptions.precision)).trigger('change');
            return false;
          });

          input.siblings('a.addition').click(function() {
            inputOptions = getOptions(input);
            var newValue = parsedValue() + inputOptions.step;
            if ((input.prop('disabled') == false) && ((inputOptions.maximum == null) || ((inputOptions.maximum != null) && (newValue <= inputOptions.maximum)))) input.val(newValue.toFixed(inputOptions.precision)).trigger('change');
            return false;
          });
        }
      });
    }
  });
})(jQuery);