describe "Adding a voucher to checkout", ->

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'checkout-vouchers.html'
    clubcard.init()
    spyOn(clubcard.checkout, 'addVoucher')

  describe "adding a voucher", ->
    it "updates the voucher payment summary", ->
      $('#add-voucher').trigger('submit')
      expect(clubcard.checkout.addVoucher).toHaveBeenCalled()