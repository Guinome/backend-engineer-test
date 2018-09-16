var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var computedSkillsService = require('../../../services/computedSkills');
const _ = require('lodash');
const fs = require('fs');
const freelancerFile = './tests/examples/freelancer.json';
const freelancer2File = './tests/examples/freelancer2.json';

if (!fs.existsSync(freelancerFile)) {
    console.log('File does not exists');
}

let freelancer = fs.readFileSync(freelancerFile, 'utf8');
freelancer = JSON.parse(freelancer);

if (!fs.existsSync(freelancer2File)) {
    console.log('File does not exists');
}

let freelancer2 = fs.readFileSync(freelancer2File, 'utf8');
freelancer2 = JSON.parse(freelancer2);


describe('computedSkillsService.getComputedSkills(experiences)', function () {

    // check edge case where one exp overlap all the others:
    // exp 1    --------------------
    // exp 2        -------
    // exp 3            --------
    // exp 4                            ----
    //
    // 1 : react, node, javascript
    // 2 : javascript, java
    // 3 : mysql, java, javascript
    // 4 : react, node, javascript
    //
    //react, node, javascript = 74
    //mysql = 32
    //java = 40
    var experiences = computedSkillsService.getExperiencesOrderedByStartDate(freelancer2.freelance);
    var skills = computedSkillsService.getSkillsWithDates(experiences)
    var computedSkills = computedSkillsService.getComputedSkills(skills);

    it('return true if react.durationInMonths == 74 ', function () {
        var react = _.find(computedSkills, ['name', 'React']);
        expect(react.durationInMonths).to.equal(6 * 12 + 2);
    });
    it('return true if node.durationInMonths == 74 ', function () {
        var node = _.find(computedSkills, ['name', 'Node.js']);
        expect(node.durationInMonths).to.equal(6 * 12 + 2);
    });
    it('return true if js.durationInMonths == 74 ', function () {
        var js = _.find(computedSkills, ['name', 'Javascript']);
        expect(js.durationInMonths).to.equal(6 * 12 + 2);
    });
    it('return true if java.durationInMonths == 40 ', function () {
        var java = _.find(computedSkills, ['name', 'Java']);
        expect(java.durationInMonths).to.equal(3 * 12 + 4);
    });
    it('return true if mysql.durationInMonths == 32 ', function () {
        var mysql = _.find(computedSkills, ['name', 'MySQL']);
        expect(mysql.durationInMonths).to.equal(2 * 12 + 8);
    });
});