describe "Product voucher cost calculation", ->

  controls = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'product-value.html'
    clubcard.init()
    controls = $('.product-variant-controls')
    spyOn(clubcard.description.variants, 'load')

  describe "changing quantity", ->
    it "updates the required voucher value", ->
      expect(controls.find('.product-value-amount span').html()).toEqual '5.00'
      controls.find('.addition').trigger('click')
      expect(controls.find('.product-value-amount span').html()).toEqual '10.00'
      controls.find('.subtract').trigger('click')
      expect(controls.find('.product-value-amount span').html()).toEqual '5.00'
