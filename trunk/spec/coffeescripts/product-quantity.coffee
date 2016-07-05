describe "Product quantity control", ->

  input        = null
  minus_button = null
  plus_button  = null

  beforeEach ->
    jasmine.getFixtures().fixturesPath = 'spec/fixtures'
    loadFixtures 'product-quantity.html'
    clubcard.init()
    input = $('input.quantity')
    minus_button = input.siblings('.subtract')
    plus_button = input.siblings('.addition')


  it "creates the control buttons", ->
    expect(minus_button.length).toBe 1
    expect(plus_button.length).toBe 1


  describe "minus button", ->
    beforeEach ->
      input.val(5).trigger 'change'
      minus_button.click()

    it "reduces the input value", ->
      expect(input.val()).toEqual '4'


  describe "plus button", ->
    beforeEach ->
      input.val(5).trigger 'change'
      plus_button.click()

    it "increases the input value", ->
      expect(input.val()).toEqual '6'


  describe "minimum value", ->
    describe "when reached", ->
      beforeEach ->
        input.val(1).trigger 'change'

      it "disables the minus button", ->
        expect(minus_button).toHaveClass 'disabled'

      describe "clicking the minus button", ->
        beforeEach ->
          minus_button.click()

        it "does not change the value", ->
          expect(input.val()).toEqual '1'

    describe "entering values", ->
      it "disallows lower values", ->
        input.val(-100).trigger 'change'
        expect(input.val()).toEqual '1'


  describe "maximum value", ->
    describe "when reached", ->
      beforeEach ->
        input.val(10).trigger 'change'

      it "disables the plus button", ->
        expect(plus_button).toHaveClass 'disabled'

      describe "clicking the plus button", ->
        beforeEach ->
          plus_button.click()

        it "does not change the value", ->
          expect(input.val()).toEqual '10'

    describe "entering values", ->
      it "disallows higher values", ->
        input.val(100).trigger 'change'
        expect(input.val()).toEqual '10'
