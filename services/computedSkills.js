const _ = require('lodash');
const moment = require('moment');
module.exports = {
    getExperiencesOrderedByStartDate(freelance){
        return _.orderBy(freelance.professionalExperiences, ['startDate'], ['asc']);
    },

    getSkillsWithDates(experiences){
        var skills = [];
        // format ↓
        // {
        //     skills: [
        //         {
        //             id: 0,
        //             name: 'name',
        //             dates: [
        //                 {
        //                     startDate: 'date',
        //                     endDate: 'date'
        //                 }
        //             ]
        //         }
        //     ]
        // }
        for (let index = 0; index < experiences.length; index++) {
            var dates = {
                'startDate': experiences[index].startDate,
                'endDate': experiences[index].endDate
            };
            // console.log(experiences)
            experiences[index].skills.forEach(skill => {
                newSkill = _.find(skills, ['id', skill.id]);
                // console.log(newSkill);
                if(newSkill === undefined){
                    newSkill = skill;
                    newSkill.dates = [];
                    newSkill.dates.push(dates);
                    skills.push(newSkill);
                } else {
                    newSkill.dates.push(dates);
                }
            });
        }
        // console.log(JSON.stringify(skills));
        return skills;
    },

    getComputedSkills(skills){
        var computedSkills = [];
        // format ↓
        // {
        //     computedSkills: [
        //         {
        //             id: 0,
        //             name: 'name',
        //             durationInMonths: 0
        //         }
        //     ]
        // }
        skills.forEach(skill => {
            var newSkill = {
                'id': skill.id,
                'name': skill.name,
                'durationInMonths': 0
            };

            var periods = this.cleanPeriods(skill.dates);
            durationInMonths = 0;
            periods.forEach(period => {
                var duration = this.getPeriodeDuration(period);
                durationInMonths += duration;
            });
            newSkill.durationInMonths = Math.round(durationInMonths);
            computedSkills.push(newSkill);
        });
        return computedSkills;
    },

    cleanPeriods(periods){
        // format ↓
        // {
        //     periods : [
        //         {
        //             startDate: 'date',
        //             endDate: ''
        //         }
        //     ]
        // }
        var orderedPeriods = _.orderBy(periods, ['startDate'], ['asc']);
        // console.log(orderedPeriods);
        var cleanedPeriods = [];
        cleanedPeriods.push(orderedPeriods[0]);
        for (let index = 1; index < orderedPeriods.length; index++) {

            // if newStartDate < previousStartDate
            if (orderedPeriods[index].startDate < cleanedPeriods[cleanedPeriods.length - 1].startDate) {
                //previousStartDate = newStartDate
                cleanedPeriods[cleanedPeriods.length - 1].startDate = orderedPeriods[index].startDate;
            }
            // if newStartDate <= previousEndDate && newEndDate > previousEndDate
            if (orderedPeriods[index].startDate <= cleanedPeriods[cleanedPeriods.length - 1].endDate &&
                orderedPeriods[index].endDate > cleanedPeriods[cleanedPeriods.length - 1].endDate ) {
                //previousEndDate = newEndDate
                cleanedPeriods[cleanedPeriods.length - 1].endDate = orderedPeriods[index].endDate;
            }
            // if newStartDate > previousEndDate
            if (orderedPeriods[index].startDate > cleanedPeriods[cleanedPeriods.length - 1].endDate){
                cleanedPeriods.push(orderedPeriods[index])
            }
        }
        // console.log(cleanedPeriods);
        return cleanedPeriods;
    },

    getPeriodeDuration(dates) {
        var startDate = moment(dates.startDate);
        var endDate = moment(dates.endDate);

        var duration = endDate.diff(startDate, 'month', true);
        return duration;
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