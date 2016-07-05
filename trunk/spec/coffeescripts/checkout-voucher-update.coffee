describe "Updating voucher selection", ->

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'checkout-vouchers.html'
    clubcard.init()
    spyOn(clubcard.checkout, 'updateVoucherSummary')

  describe "selecting a voucher", ->
    it "updates the voucher payment summary", ->
      $('.payment-ctrl input').first().trigger('change')
      expect(clubcard.checkout.updateVoucherSummary).toHaveBeenCalled()
