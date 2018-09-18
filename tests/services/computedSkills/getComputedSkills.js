var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var computedSkillsService = require('../../../services/computedSkills');
const _ = require('lodash');
const fs = require('fs');

//get inputs
const freelancerFiles = [
    './tests/examples/freelancer.json',
    './tests/examples/freelancer2.json',
    './tests/examples/freelancer3.json'
];
var freelancers = [];
freelancerFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log('File ' + file + ' does not exists');
    }

    let freelancer = fs.readFileSync(file, 'utf8');
    freelancers.push(JSON.parse(freelancer));
});

// get outputs
const outputFiles = [
    './tests/outputs/freelancer.json',
    './tests/outputs/freelancer2.json',
    './tests/outputs/freelancer3.json'
];
var outputs = [];
outputFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log('File ' + file + ' does not exists');
    }

    let output = fs.readFileSync(file, 'utf8');
    outputs.push(JSON.parse(output));
});


freelancers.forEach((freelancer, index) => {
    describe('computedSkillsService.getComputedSkills(experiences)', function () {
        var experiences = computedSkillsService.getExperiencesOrderedByStartDate(freelancer.freelance);
        var skills = computedSkillsService.getSkillsWithDates(experiences)
        var computedSkills = computedSkillsService.getComputedSkills(skills);
        
        const computedSkillsOutput = outputs[index].freelance.computedSkills;

        computedSkillsOutput.forEach(skill => {
            it('return true if durationInMonths of ' + skill.name + ' == ' + skill.durationInMonths, function () {
                var skillToCheck = _.find(computedSkills, ['id', skill.id]);
                expect(skillToCheck.durationInMonths).to.equal(skill.durationInMonths);
            });

        });
    });
});