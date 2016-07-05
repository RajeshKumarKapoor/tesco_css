describe "Checkout delivery details", ->

  summary = null
  forms = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'checkout-delivery.html'
    clubcard.init()
    summary = $('.checkout-delivery-details-summary')
    forms = $('.checkout-delivery-details-edit')
    spyOn(clubcard.checkout, 'updateDeliveryDetails')

  describe "default state", ->
    it "hides the forms", ->
      expect(forms).not.toHaveClass 'active'

    it "shows the summary", ->
      expect(summary).not.toHaveClass 'edit'

  describe "edit links", ->
    describe "when clicked", ->
      beforeEach ->
        $('a.edit-address').trigger 'click'

      it "shows the corresponding form", ->
        expect($('.checkout-delivery-details-edit-address')).toHaveClass 'active'
        expect($('.checkout-delivery-details-edit-email')).not.toHaveClass 'active'

      it "hides the summary", ->
        expect(summary).toHaveClass 'edit'

  describe "forms", ->
    beforeEach ->
      $('a.edit-address').trigger 'click'

    describe "submit button", ->
      button = null

      beforeEach ->
        button = forms.first().find('.btn-submit')

      it "is disabled by default", ->
        expect(button).toHaveClass 'disabled'
        expect(button.prop('disabled')).toBeTruthy()

      describe "when clicked", ->
        beforeEach ->
          forms.first().find('.confirm').prop('checked', true).trigger 'change'
          button.trigger 'click'

        it "updates the delivery details", ->
          expect(clubcard.checkout.updateDeliveryDetails).toHaveBeenCalled()


    describe "confirmation checkbox", ->
      describe "when clicked", ->
        it "enables the submit button", ->
          forms.first().find('.confirm').prop('checked', true).trigger 'change'
          button = forms.first().find('.btn-submit')
          expect(button).not.toHaveClass 'disabled'
          expect(button.prop('disabled')).toBeFalsy()


    describe "cancel button", ->
      describe "when clicked", ->
        beforeEach ->
          expect(forms.first()).toHaveClass 'active'
          expect(summary).toHaveClass 'edit'
          forms.first().find('.btn-cancel').trigger 'click'

        it "hides the form", ->
          expect(forms.first()).not.toHaveClass 'active'

        it "shows the summary", ->
          expect(summary).not.toHaveClass 'edit'


    describe "find address", ->
      beforeEach ->
        spyOn(clubcard.checkout, 'findAddressOptions')

      describe "when clicked", ->
        beforeEach ->
          $('#post_code').val('W1W 7PA')
          $('.find-address').trigger 'click'

        it "finds matching addresses", ->
          expect(clubcard.checkout.findAddressOptions).toHaveBeenCalled()

      describe "address matched", ->
        beforeEach ->
          $('#jasmine-fixtures').empty()
          loadFixtures 'checkout-delivery-address.html'

        describe "when selected", ->
          beforeEach ->
            expect($('#house').val()).toEqual '70'
            expect($('#street').val()).toEqual 'Lewis gardens'
            expect($('#town').val()).toEqual 'London'
            $('#selectAdress').val('result1').trigger 'change'

          it "populates the address fields", ->
            expect($('#house').val()).toEqual '66'
            expect($('#street').val()).toEqual 'Rosslyn Ave'
            expect($('#town').val()).toEqual 'Romford'

          it "hides the select box", ->
            expect($('.choose_address').length).toEqual 0