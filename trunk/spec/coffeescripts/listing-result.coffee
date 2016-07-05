describe "Listing result", ->
  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'listing-row.html'
    clubcard.init()
    spyOn(clubcard.listing, 'redirect')

  describe "clicking the item", ->
    url = null

    beforeEach ->
      url = $('.listing-item .listing-title a').attr('href')
      $('.listing-item').trigger('click')

    it "redirects to the product description page", ->
      expect(clubcard.listing.redirect).toHaveBeenCalledWith(url)