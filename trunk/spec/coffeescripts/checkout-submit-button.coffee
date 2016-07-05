describe "Checkout submit button", ->

  button = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'checkout-vouchers.html', 'checkout-submit.html'
    button = $('.checkout-review-review input')
    clubcard.init()

  describe "when insufficient vouchers are selected", ->
    it "is disabled", ->
      expect(button).toHaveClass 'disabled'
      expect(button.prop('disabled')).toBeTruthy()
      
  describe "when sufficient vouchers are selected", ->
    beforeEach ->
      $('#balance_remaining').attr('data-amount', '0.00')
      clubcard.checkout.toggleSubmitButton()

    it "is enabled", ->
      expect(button).not.toHaveClass 'disabled'
      expect(button.prop('disabled')).toBeFalsy()