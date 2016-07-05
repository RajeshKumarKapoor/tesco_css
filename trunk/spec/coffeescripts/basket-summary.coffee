describe "Basket summary", ->

  button = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'basket-summary.html'
    clubcard.init()
    button = $('.dropdown-toggle.basket-btn')
    spyOn(clubcard.basket, 'remove')

  describe "desktop layout", ->
    it "enables the dropdown", ->
      clubcard.mobileLayout = false
      clubcard.tabletLayout  = false;
      clubcard.desktopLayout = true;
      clubcard.reRenderPage()
      expect(button).not.toHaveClass('disabled')

  describe "mobile layout", ->
    it "disables the dropdown", ->
      clubcard.mobileLayout = true
      clubcard.tabletLayout  = false;
      clubcard.desktopLayout = false;
      clubcard.reRenderPage()
      expect(button).toHaveClass('disabled')

  describe "tablet layout", ->
    it "disables the dropdown", ->
      clubcard.mobileLayout = false
      clubcard.tabletLayout  = true;
      clubcard.desktopLayout = false;
      clubcard.reRenderPage()
      expect(button).toHaveClass('disabled')

  describe "when button is active", ->
    beforeEach ->
      button.addClass 'active'

    describe "when clicked", ->
      beforeEach ->
        button.trigger 'click'

      it "does not show the dropdown", ->
        expect(button.parent()).not.toHaveClass 'open'