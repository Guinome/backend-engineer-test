const _ = require('lodash');
const moment = require('moment');
module.exports = {
    getExperiencesOrderedByStartDate(freelance){
        return _.orderBy(freelance.professionalExperiences, ['startDate'], ['asc']);
    },

    getSkillsWithDates(experiences){
        var skills = [];
        for (let index = 0; index < experiences.length; index++) {
            var dates = {
                'startDate': experiences[index].startDate,
                'endDate': experiences[index].endDate
            };
            experiences[index].skills.forEach(skill => {
                newSkill = _.find(skills, ['id', skill.id]);
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
        return skills;
    },

    getComputedSkills(skills){
        // console.log(JSON.stringify((skills), null, 2)); 
        var computedSkills = [];

        _.forEach(skills, skill => {
            let newSkill = {
                'id': skill.id,
                'name': skill.name,
                'durationInMonths': 0
            };
            const periods = this.cleanPeriods(skill.dates);
            durationInMonths = 0;
            periods.forEach(period => {
                const duration = this.getPeriodeDuration(period);
                durationInMonths += duration;
            });
            newSkill.durationInMonths = Math.round(durationInMonths);
            computedSkills.push(newSkill);
        });
        return computedSkills;
    },

    cleanPeriods(periods){
        let orderedPeriods = _.orderBy(periods, ['startDate'], ['asc']);
        let cleanedPeriods = _.take(orderedPeriods);

        _.forEach(orderedPeriods, period => {
            if(!cleanedPeriods.length){
                cleanedPeriods.push(period);
                return;
            }
            var newStartDate = period.startDate;
            var newEndDate = period.endDate;
            var oldStartDate = cleanedPeriods[cleanedPeriods.length - 1].startDate;
            var oldEndDate = cleanedPeriods[cleanedPeriods.length - 1].endDate;

            //oldDates:       -----
            //newDates:   ---
            //add: 
            //theoretically impossible, cleanedPeriods are reordered by start date
            if(newEndDate <= oldStartDate) {
                let newImpossibleDate = {
                    'startDate': newStartDate,
                    'endDate': newEndDate
                };
                cleanedPeriods.unshift(newImpossibleDate);
            }

            //oldDates:     ---[
            //newDates:   -----[
            //add:        --
            if (newStartDate < oldStartDate && newEndDate < oldEndDate){
                let newFirstDate = {
                    'startDate': newStartDate,
                    'endDate': oldStartDate
                };
                cleanedPeriods.unshift(newFirstDate);
            }

            //oldDates:     ]--
            //newDates:     ]------
            //add:             ----
            if(newStartDate <= oldEndDate && newEndDate > oldEndDate) {
                let newLastDate = {
                    'startDate': oldEndDate,
                    'endDate': newEndDate
                };
                cleanedPeriods.push(newLastDate);
            }

            //oldDates:     ]-
            //newDates:        ----[
            //add:             ----[
            if (newStartDate >= oldEndDate) {
                let newLastDate = {
                    'startDate': newStartDate,
                    'endDate': newEndDate
                };
                cleanedPeriods.push(newLastDate);
            }
            cleanedPeriods.sort((a, b) => {
                return a - b;
            });
        });
        return cleanedPeriods;
    },

    getPeriodeDuration(dates) {
        var startDate = moment(dates.startDate);
        var endDate = moment(dates.endDate);

        var duration = Math.round(endDate.diff(startDate, 'month', true));
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