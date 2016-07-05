describe "Listing page controls", ->
  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'listing-pagination.html'
    clubcard.init()
    spyOn(clubcard.listing, 'loadPage')

  describe "changing the page", ->
    beforeEach ->
      $('.pagination a[data-page="5"]').trigger('click')

    it "sets the sort order", ->
      expect(clubcard.listing.getCurrentPage()).toEqual 5

    it "updates the listing", ->
      expect(clubcard.listing.loadPage).toHaveBeenCalled