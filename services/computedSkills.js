const _ = require('lodash');
const moment = require('moment');
module.exports = {
    getExperiencesOrderedByStartDate(freelance){
        return _.orderBy(freelance.professionalExperiences, ['startDate'], ['asc']);
    },

    getComputedSkills(experiences){
        var totalSkills = [];

        for (let index = 0; index < experiences.length; index++) {
            var currentExperience         = experiences[index];
            var currentExperienceDuration = this.getExperienceDuration(currentExperience);
            // première iteration = initialisation des premiers skills
            if(index === 0){
                totalSkills = this.initFirstSkills(currentExperience.skills, currentExperienceDuration);
            } else {
                var durationToSubstract = this.getDurationToSubstract(experiences[index - 1], experiences[index]);
    
                currentExperience.skills.forEach(skill => {
                    var skillIndex = this.getSkillIndex(totalSkills, skill);
                    //If the skill doesn't exist, we create it
                    if (skillIndex === -1) {
                        var newSkill = skill;
                        newSkill.durationInMonth = currentExperienceDuration;
                        totalSkills.push(newSkill);
                    } else{
                        totalSkills[skillIndex].durationInMonth += currentExperienceDuration;
                        var previousSkillIndex = this.getSkillIndex(experiences[index - 1].skills, skill);
                        if(previousSkillIndex !== -1){
                            totalSkills[skillIndex].durationInMonth -= durationToSubstract;
                        }
                    }
                });
            }
        }

        return totalSkills;
    },

    getExperienceDuration(experience) {
        var startDate = moment(experience.startDate);
        var endDate = moment(experience.endDate);

        var duration = Math.round(endDate.diff(startDate, 'month', true));
        return duration;
    },

    initFirstSkills(skills, duration) {
        var firstSkills = _.map(skills, function (skill) {
            skill.durationInMonth = duration;
            return skill;
        });
        return firstSkills;
    },

    getDurationToSubstract(previousExperience, currentExperience){
        const previousExperienceEndDate = moment(previousExperience.endDate);
        const currentExperienceStartDate = moment(currentExperience.startDate);
        var durationToSubstract = 0;
        //If there is overlap, we change the duration to substract
        if (currentExperienceStartDate.isBefore(previousExperienceEndDate)) {
            var durationToSubstract = Math.round(previousExperienceEndDate.diff(currentExperienceStartDate, 'month', true));
        }
        return durationToSubstract;
    },

    getSkillIndex(skills, skillToFind){
        return _.findIndex(skills, function (skill) { 
            return skill.id == skillToFind.id;
        });
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