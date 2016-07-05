describe "Listing sort control", ->
  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'listing-sort.html'
    clubcard.init()
    spyOn(clubcard.listing, 'loadPage')

  describe "changing the sort order", ->
    beforeEach ->
      $('#sort-select').val('option3').trigger('change')

    it "sets the sort order", ->
      expect(clubcard.listing.getSortOrder()).toEqual 'option3'

    it "updates the listing", ->
      expect(clubcard.listing.loadPage).toHaveBeenCalled