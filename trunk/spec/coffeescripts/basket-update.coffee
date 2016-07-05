describe "Basket update", ->

  item = null
  form = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'basket-item.html'
    clubcard.init()
    item = $('.checkout-item')
    form = item.find('form.update')
    spyOn(clubcard.basket, 'update')

  describe "quantity control", ->
    describe "default state", ->
      it "hides the update button", ->
        expect(form).not.toHaveClass('enabled')

      it "cannot be submitted", ->
        form.trigger('submit')
        expect(clubcard.basket.update).not.toHaveBeenCalled

    describe "when quantity is altered", ->
      beforeEach ->
        form.find('.addition').trigger 'click'

      it "shows the update button", ->
        expect(form).toHaveClass('enabled')

      it "can be submitted", ->
        form.trigger('submit')
        expect(clubcard.basket.update).toHaveBeenCalled