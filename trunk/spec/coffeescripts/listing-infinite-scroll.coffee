describe "Listing infinite scroll", ->
  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'listing-pagination.html', 'listing-row.html'
    clubcard.init()
    spyOn($.fn, 'scrollTop').andReturn(99999)
    spyOn(clubcard.listing, 'loadPage')

  describe "show all button", ->
    it "is added", ->
      expect($('.show-all a').length).toEqual 1

    describe "when clicked", ->
      beforeEach ->
        expect($('.paging-display')).not.toHaveClass('all')
        $('.show-all a').trigger 'click'

      it "toggles the pagination class", ->
        expect($('.paging-display')).toHaveClass('all')

      it "loads the first page", ->
        expect(clubcard.listing.loadPage).toHaveBeenCalled()

  describe "scrolling", ->
    describe "when there are more pages", ->
      it "loads the next set of results", ->
        clubcard.listing.infiniteScroll.scroll()
        expect(clubcard.listing.loadPage).toHaveBeenCalled()

    describe "when there are no more pages", ->
      beforeEach ->
        spyOn(clubcard.listing, 'getCurrentPage').andReturn 5

      it "does not load more results", ->
        clubcard.listing.infiniteScroll.scroll()
        expect(clubcard.listing.loadPage).not.toHaveBeenCalled()
