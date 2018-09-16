Unit tests with mocha & chai
 1. `npm install mocha -g`
 2. `mocha tests --recursive [--watch]`

Todo :
 - [x] unit tests :white_check_mark:
 - [x] modify computedSkills :white_check_mark:
    - [x] class each skills with pairs of durations,
	- [x] merge all durations
 the point is to avoid "extreme" cases
 - [ ] test dates (checkJson / unitTest)

Hi !
This is an off-site test for Backend Engineer in the process of joining the comet team.

# Context

At comet, we handle thousands of freelancers, each freelancers has several professional experiences populated in their profile.

We use these professional experiences in our matching algorithm to match the freelancer with the most relevant experience to the mission.

You can find an example of a mission and of a freelancer data model in the `/examples` folder.

# Exercise

In our matching algorithm, we use the total months of experience of each skill for each freelancer.

If you look at the example `example/freelancer.json`, you will see that the freelancer has 3 professional experiences, you can see that he has been doing Javascript since his first professional experience, in may 2013 and kept doing Javascript until his last professional experience in may 2018.

We would like to compute the total number of months the freelancer has worked with each skill.

In this case, we would have :

React: **29 months**

Node.js: **29 months**

Javascript: 29 months + 15 months + 14 months = **58 months**

MySQL: **15 months**

Java: 15 months + 14 months = **29 months**

You will have to read a json file `exercise/freelancer.json`, with the same structure as the example `example/freelancer.json`.

You will have to compute all of his professional experiences, and output a json with this exact structure :

```
"freelance": {
	"id": 42,
	"computedSkills": [
		{
			"id": 241,
			"name": "React",
			"durationInMonths": 28
		},
		{
			"id": 270,
			"name": "Node.js",
			"durationInMonths": 28
		},
		{
			"id": 370,
			"name": "Javascript",
			"durationInMonths": 58
		},
		{
			"id": 470,
			"name": "MySQL",
			"durationInMonths": 16
		},
		{
			"id": 400,
			"name": "Java",
			"durationInMonths": 30
		}
	]
}
```

# Rules

1. Overlapping months of experience with the same skill(s) should not be counted twice, see [assets/months-overlap.png](./assets/months-overlap.png)
2. All professional experiences `startDate` and `endDate` values will be on the first day of the month.
3. You script will be executed like this : `node exercise.js`
4. We're using node 8.4 for the execution
5. You can use any npm package you want
6. If there's an error in the json file, exit without printing anything
7. The duration in months should be rounded

# How to

1. Fork the repo or clone it if you don't have a Github account
2. Do the exercise
3. Give us your fork URL or send us an archive file containing your work