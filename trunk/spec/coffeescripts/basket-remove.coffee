describe "Basket remove", ->

  item = null
  form = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'basket-item.html'
    clubcard.init()
    item = $('.checkout-item')
    spyOn(clubcard.basket, 'remove')

  describe "remove button", ->
    describe "when clicked", ->
      beforeEach ->
        item.find('.remove-item a').trigger 'click'

      it "removes the item", ->
        expect(clubcard.basket.remove).toHaveBeenCalledWith('A3010')
