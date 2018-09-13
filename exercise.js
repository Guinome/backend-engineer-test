const fs = require('fs');

const freelancerFile = './exercise/freelancer.json'

if (!fs.existsSync(freelancerFile)) {
	console.log('File does not exists');
}

let freelancer = fs.readFileSync(freelancerFile, 'utf8');

freelancer = JSON.parse(freelancer);

var freelanceId = freelancer.freelance.id;

var jsonReturn = {
	"id": 			  freelancer.freelance.id,
	"computedSkills": []
}
// compute all skills duration

// output result