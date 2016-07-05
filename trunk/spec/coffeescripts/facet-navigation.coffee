describe "Facet navigation", ->

  facet = null
  heading = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'facet-navigation.html'
    clubcard.init()
    facet = $('.facet-items').first()
    heading = $('.facet-nav-heading')
    spyOn(clubcard.listing, 'loadPage')

  describe "checking facets", ->
    checkbox = null

    beforeEach ->
      checkbox = facet.find('input[type="checkbox"]')

    it "updates the listing results", ->
      checkbox.prop('checked', true).trigger('change')
      expect(clubcard.listing.loadPage).toHaveBeenCalled()

    describe "when not already checked", ->
      beforeEach ->
        checkbox.prop('checked', false).trigger('change')
        expect(facet.find('.clear-btn').length).toEqual 0
        expect(heading.find('.clear-btn').length).toEqual 0
        checkbox.prop('checked', true).trigger('change')

      it "shows the clear button", ->
        expect(facet.find('.clear-btn').length).toEqual 1

      it "shows the clear all button", ->
        expect(heading.find('.clear-btn').length).toEqual 1

    describe "when already checked", ->
      beforeEach ->
        checkbox.prop('checked', true).trigger('change')
        expect(facet.find('.clear-btn').length).toEqual 1
        expect(heading.find('.clear-btn').length).toEqual 1
        checkbox.prop('checked', false).trigger('change')

      it "hides the clear button", ->
        expect(facet.find('.clear-btn').length).toEqual 0

      describe "when no other facets are checked", ->
        beforeEach ->
          expect($('.facet-items').not(facet).find('input[type="checkbox"]:checked').length).toEqual 0

        it "hides the clear all button", ->
          expect(heading.find('.clear-btn').length).toEqual 0

      describe "when other facets are checked", ->
        beforeEach ->
          $('.facet-items').not(facet).find('input[type="checkbox"]').prop('checked', true).trigger('change')
          expect($('.facet-items').find('input[type="checkbox"]:checked').length).toBeGreaterThan 0

        it "does not hide the clear all button", ->
          expect(heading.find('.clear-btn').length).toEqual 1

  describe "clear button", ->
    beforeEach ->
      facet.find('input[type="checkbox"]').prop('checked', true).trigger('change')
      facet.find('.clear-btn').trigger('click')

    it "unchecks all facets in the group", ->
      expect(facet.find('input[type="checkbox"]:checked').length).toEqual(0)

    it "disappears", ->
      expect(facet.find('.clear-btn').length).toEqual(0)

    it "updates the listing results", ->
      expect(clubcard.listing.loadPage).toHaveBeenCalled()

    describe "when other facets are checked", ->
      beforeEach ->
        $('.facet-items').find('input[type="checkbox"]').prop('checked', true).trigger('change')

      it "does not uncheck facets outside of the group", ->
        expect($('.facet-items').find('input[type="checkbox"]:checked').length).toBeGreaterThan 0

      it "does not hide the clear all button", ->
        expect(heading.find('.clear-btn').length).toEqual 1

    describe "when no other facets are checked", ->
      beforeEach ->
        expect($('.facet-items').not(facet).find('input[type="checkbox"]:checked').length).toEqual 0

      it "hides the clear all button", ->
        expect(heading.find('.clear-btn').length).toEqual 0

  describe "clear all button", ->
    beforeEach ->
      $('.facet-items').find('input[type="checkbox"]').prop('checked', true).trigger('change')
      heading.find('.clear-btn').trigger('click')

    it "unchecks all facets in all groups", ->
      expect($('.facet-items').find('input[type="checkbox"]:checked').length).toEqual 0

    it "disappears", ->
      expect(heading.find('.clear-btn').length).toEqual 0

    it "hides all clear buttons", ->
      expect($('.facet-items').find('.clear-btn').length).toEqual 0

    it "updates the listing results", ->
      expect(clubcard.listing.loadPage).toHaveBeenCalled()

  describe "sub-filter headings", ->
    link = null
    headings = null

    beforeEach ->
      headings = $('#facet-region')

    describe "when inactive", ->
      it "hides the sub-filter facets", ->
        expect($('.sub-facet:visible')).not.toHaveClass 'active'

    describe "when clicked", ->
      beforeEach ->
        link = headings.find('a[data-child="facet-region-eastmidlands"]')
        link.trigger('click')

      it "disappears", ->
        expect(headings).toHaveClass('child-open')

      it "shows the sub-filter facets", ->
        expect($('.sub-facet#facet-region-eastmidlands')).toHaveClass 'active'

      it "shows the sub-filter back button", ->
        expect($('.sub-facet#facet-region-eastmidlands .back-btn').length).toEqual 1

  describe "sub-filter back button", ->
    beforeEach ->
      $('#facet-region a[data-child="facet-region-eastmidlands"]').trigger('click')
      $('.sub-facet#facet-region-eastmidlands').find('.back-btn').trigger('click')

    it "hides the sub-filter facets", ->
      expect($('.sub-facet#facet-region-eastmidlands')).not.toHaveClass 'active'

    it "shows the sub-filter headings", ->
      expect($('#facet-region')).not.toHaveClass('child-open')
