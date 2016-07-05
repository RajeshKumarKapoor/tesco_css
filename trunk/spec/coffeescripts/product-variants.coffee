describe "Product variants", ->

  controls = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'product-variants.html'
    clubcard.init()
    controls = $('.product-variant-controls')
    spyOn(clubcard.description.variants, 'load')

  describe "select input", ->
    describe "changing", ->
      it "updates the variant controls", ->
        controls.find('select').first().trigger('change')
        expect(clubcard.description.variants.load).toHaveBeenCalled()