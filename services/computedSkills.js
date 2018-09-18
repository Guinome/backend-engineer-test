const _ = require('lodash');
const Moment = require('moment');
const momentRange = require('moment-range');
const moment = momentRange.extendMoment(Moment);
module.exports = {
    getExperiencesOrderedByStartDate(freelance){
        return _.orderBy(freelance.professionalExperiences, ['startDate'], ['asc']);
    },

    getSkillsWithRanges(experiences){
        var skills = [];
        for (let index = 0; index < experiences.length; index++) {
            const timeInterval = experiences[index].startDate + '/' + experiences[index].endDate;
            startDate = moment(experiences[index].startDate);
            endDate = moment(experiences[index].endDate);
            const range = moment.range(startDate,endDate);
            experiences[index].skills.forEach(skill => {
                newSkill = _.find(skills, ['id', skill.id]);
                if(newSkill === undefined){
                    newSkill = skill;
                    newSkill.ranges = [];
                    skills.push(newSkill);
                }
                newSkill.ranges.push(range);
            });
        }
        return skills;
    },

    getComputedSkills(skills){
        console.log(JSON.stringify((skills), null, 2)); 
        var computedSkills = [];

        _.forEach(skills, skill => {
            let newSkill = {
                'id': skill.id,
                'name': skill.name,
                'durationInMonths': 0
            };
            const cleanedRanges = this.cleanRanges(skill.ranges);
            const durationInMonths = this.getDuration(cleanedRanges);
            // durationInMonths = 0;
            // periods.forEach(period => {
            //     const duration = this.getPeriodeDuration(period);
            //     durationInMonths += duration;
            // });
            newSkill.durationInMonths = Math.round(durationInMonths);
            computedSkills.push(newSkill);
        });
        return computedSkills;
    },

    cleanRanges(ranges){
        let finalRanges = [];
        ranges.forEach((range, index) => {
            if (!index) {
                finalRanges.push(range);
                return;
            }
            const previousRange = finalRanges[finalRanges.length - 1];
            const currentRange = range;

            if (previousRange.overlaps(currentRange, { adjacent: true })) {
                finalRanges[finalRanges.length - 1] = finalRanges[finalRanges.length - 1].add(currentRange);
            } else {
                finalRanges.push(currentRange);
            }
        });
        return finalRanges;
    },

    getDuration(ranges) {
        let duration = 0;
        ranges.forEach((range,index) => {
            duration += range.diff('months', true);
        });
        return Math.round(duration);
    },

    //check if we have the same properties and types of values than in `[examples | exercice]/freelancer.json`
    checkJsonFile(freelancer){
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
        var isJsonOk = this.recursiveCheck(freelancer, emptyFreelancer);
        return isJsonOk;
    },

    recursiveCheck(sourceToCheck, goodSource){
        for(key in goodSource){
            if (!sourceToCheck.hasOwnProperty(key)) {
                return false;
            }
            if (typeof sourceToCheck[key] !== typeof goodSource[key]) {
                return false;
            }
            if (Array.isArray(goodSource[key])){
                var goodSubSource = goodSource[key][0];
                for (subKey of sourceToCheck[key]){
                    var ok = this.recursiveCheck(subKey, goodSubSource);
                    if (!ok) {
                        return false;
                    }
                }
            } else if (typeof goodSource[key] === "object"){
                var ok = this.recursiveCheck(sourceToCheck[key], goodSource[key]);
                if(!ok){
                    return false;
                }
            }
        }
        return true;
    }

};