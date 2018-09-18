const fs = require('fs');
const _ = require('lodash');
const computedSkillsService = require('./services/computedSkills');

// const freelancerFile = './exercise/freelancer.json';
// since './exercise/freelancer.json' is empty, i used './exercise/freelancer.json'
const freelancerFile = './examples/freelancer.json';

if (!fs.existsSync(freelancerFile)) {
	console.log('File does not exists');
}

let freelancer = fs.readFileSync(freelancerFile, 'utf8');

freelancer = JSON.parse(freelancer);

const isJsonOk = computedSkillsService.checkJsonFile(freelancer);
if(!isJsonOk){
	return false;
}
//order professional experiences by startdate
var experiences    = computedSkillsService.getExperiencesOrderedByStartDate(freelancer.freelance)
// get skills with dates
var skills 		   = computedSkillsService.getSkillsWithDates(experiences)
// compute all skills duration
var computedSkills = computedSkillsService.getComputedSkills(skills);

const jsonReturn = {
		"freelance": {
			"id": 			  freelancer.freelance.id,
			"computedSkills": computedSkills
		}
	};
// output result
console.log(JSON.stringify(jsonReturn, null, 2));