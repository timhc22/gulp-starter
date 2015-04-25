//require ('src/javascript/_functions');
var $ = require('jquery');
//require('karma');

//describe 'page.js', ->
//it 'contains a love letter', ->
//loveLetter = $('.love-letter').length
//loveLetter.should.equal 1
//
describe("Our First Test", function() {
    it('should pass', function() {

        var one = 1;
        var two = 2;
        var three = one + two;

        three.should.equal(3);
    })
})