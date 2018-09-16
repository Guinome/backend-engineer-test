var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var computedSkillsService = require('../../../services/computedSkills');
const fs = require('fs');
const freelancerFile = './tests/examples/freelancer.json';

if (!fs.existsSync(freelancerFile)) {
    console.log('File does not exists');
}

let freelancer = fs.readFileSync(freelancerFile, 'utf8');
freelancer = JSON.parse(freelancer);

//I think the best way would be to parse metadata of each orm model
var date = new Date();
const emptyFreelancer = {
    "freelance": {
        "id": 0,
        "user": {
            "firstName": "string",
            "lastName": "string",
            "jobTitle": "string"
        },
        "status": "string",
        "retribution": 0,
        "availabilityDate": date.toISOString(),
        "professionalExperiences": [
            {
                "id": 0,
                "companyName": "string",
                "startDate": date.toISOString(),
                "endDate": date.toISOString(),
                "skills": [
                    {
                        "id": 0,
                        "name": "string"
                    }
                ]
            }
        ]
    }
};
describe('computedSkillsService.checkJsonFile(freelancer)', function () {
    //check DATES !!!
    for (key in emptyFreelancer.freelance) {
        if (typeof emptyFreelancer.freelance[key] !== "object"){
            it('return false if freelancer.' + key + ' doesn\'t exist', function () {
                freelancerTest = freelancer;
                delete freelancerTest.freelance[key];
                var isJsonOk = computedSkillsService.checkJsonFile(freelancerTest);
                expect(isJsonOk).to.equal(false);
            });
            it('return false if typeof freelancer.' + key + ' !== ' + typeof freelancer.freelance[key], function () {
                freelancerTest = freelancer;
                freelancerTest.freelance[key] = typeof freelancerTest.freelance[key] == 'number' ? 'A' : 42;
                var isJsonOk = computedSkillsService.checkJsonFile(freelancerTest);
                expect(isJsonOk).to.equal(false);
            });
        }
    }
    it('return false if user is empty', function () {
        freelancerTest = freelancer;
        freelancerTest.freelance.user = {};
        var isJsonOk = computedSkillsService.checkJsonFile(freelancerTest);
        expect(isJsonOk).to.equal(false);
    });
    it('return false if user doesnt exist', function () {
        freelancerTest = freelancer;
        delete freelancerTest.freelance.user;
        var isJsonOk = computedSkillsService.checkJsonFile(freelancerTest);
        expect(isJsonOk).to.equal(false);
    });
    //and all the other objects
});