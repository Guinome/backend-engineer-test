const fs = require('fs');
<<<<<<< HEAD
const _ = require('lodash');
const computedSkillsService = require('./services/computedSkills');

// const freelancerFile = './exercise/freelancer.json';
const freelancerFile = './examples/freelancer.json';
=======

const freelancerFile = './exercise/freelancer.json'
>>>>>>> 43fc818a003ab31de6e3edf1ad0af031f11f7b51

if (!fs.existsSync(freelancerFile)) {
	console.log('File does not exists');
}

let freelancer = fs.readFileSync(freelancerFile, 'utf8');

freelancer = JSON.parse(freelancer);

<<<<<<< HEAD
//order professional experiences by startdate
var experiences    = computedSkillsService.getExperiencesOrderedByStartDate(freelancer.freelance)
var computedSkills = computedSkillsService.getComputedSkills(experiences);
// compute all skills duration
const jsonReturn = {
		"freelance": {
			"id": 			  freelancer.freelance.id,
			"computedSkills": computedSkills
		}
	};
console.log(JSON.stringify(jsonReturn));
=======
// compute all skills duration

>>>>>>> 43fc818a003ab31de6e3edf1ad0af031f11f7b51
// output result