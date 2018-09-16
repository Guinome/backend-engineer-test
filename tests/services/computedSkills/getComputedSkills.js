var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var computedSkillsService = require('../../../services/computedSkills');
const _ = require('lodash');
const fs = require('fs');
const freelancerFile = './tests/examples/freelancer.json';

if (!fs.existsSync(freelancerFile)) {
    console.log('File does not exists');
}

let freelancer = fs.readFileSync(freelancerFile, 'utf8');
freelancer = JSON.parse(freelancer);


describe('computedSkillsService.getComputedSkills(experiences)', function () {

    // check edge case where one exp overlap all the others:
    // exp 1    --------------------------------
    // exp 2        -------
    // exp 3            --------
    // 1 : react, node, javascript
    // 2 : javascript, java
    // 3 : mysql, java, javascript
    //react, node, javascript = 72
    //mysql = 32
    //java = 40
    var experiences = computedSkillsService.getExperiencesOrderedByStartDate(freelancer.freelance)
    var skills = computedSkillsService.getComputedSkills(experiences);
    it('return true if react.durationInMonth == 72 ', function () {
        var react = _.find(skills, ['name', 'React']);
        expect(react.durationInMonth).to.equal(6*12);
    });
    it('return true if node.durationInMonth == 72 ', function () {
        var node = _.find(skills, ['name', 'Node.js']);
        expect(node.durationInMonth).to.equal(6 * 12);
    });
    it('return true if js.durationInMonth == 72 ', function () {
        var js = _.find(skills, ['name', 'Javascript']);
        expect(js.durationInMonth).to.equal(6 * 12);
    });
    it('return true if java.durationInMonth == 40 ', function () {
        var java = _.find(skills, ['name', 'Java']);
        expect(java.durationInMonth).to.equal(3 * 12 + 4);
    });
    it('return true if mysql.durationInMonth == 32 ', function () {
        var mysql = _.find(skills, ['name', 'MySQL']);
        expect(mysql.durationInMonth).to.equal(2 * 12 + 8);
    });
});