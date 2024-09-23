// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  },
  /**
   * 
   * Testing new learner_id's
   */
  // {
  //   learner_id: 140,
  //   assignment_id: 1,
  //   submission: {
  //     submitted_at: "2023-03-07",
  //     score: 95
  //   }
  // },
  // {
  //   learner_id: 140,
  //   assignment_id: 2,
  //   submission: {
  //     submitted_at: "2023-03-07",
  //     score: 140
  //   }
  // }
  
];

LearnerSubmissions.splice(2, 1);
//Removed assignment with future due date

function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.
  
  /**
   * Throws error if assignment isn't part of course
   */
  
  try {
    if (ag.course_id !== course_id) {
      throw new Error(`Invalid. Assignment not part of course.`)
    }
    console.log('Assignment not part of course');
  }
  catch {}

  //Results array
  const result = [];

  // Made an object to store learner information
  const learnerDataObject = {};

  // Process submissions using forEach
  submissions.forEach((submission) => {
    const { learner_id, assignment_id, submission: { submitted_at, score } } = submission;
    //Testing to see that all submissions are appearing before removing due to assignment not being due. **Just ended up splicing it out***
  

    // Is the work late?
    const assignment = ag.assignments.find((a) => a.id === assignment_id);
    const dueOn = new Date(assignment.due_at); //Adjusts for strings
    const submittedOn = new Date(submitted_at); //Adjusts for strings
    const lateWork = submittedOn > dueOn;

    
    // Take off 10% if late (? operator for true : false)
    const adjustedScore = lateWork ? Math.max(score - 0.1 * assignment.points_possible, 0) : score;


    // Update learner data
    if (!learnerDataObject[learner_id]) {
      learnerDataObject[learner_id] = {
        id: learner_id,
        totalScore: 0,
        totalWeight: 0,
        assignmentScores: {},
      };
    }
    const learnerData = learnerDataObject[learner_id];
    learnerData.totalScore += adjustedScore;
    learnerData.totalWeight += assignment.points_possible;
    learnerData.assignmentScores[assignment_id] = adjustedScore;
  });

  //Calculate averages
  /**
   * 
   * This loop insures that the properties in the learnerDataObject exist and won't cause errors for the object
   */
  for (const learner_id in learnerDataObject) {
    if (Object.hasOwn(learnerDataObject, learner_id)) {
      const learnerData = learnerDataObject[learner_id];
      const avg = learnerData.totalScore / learnerData.totalWeight;
      const learnerResult = {
        id: learner_id,
        avg: avg
      };
      // Add learner assignment scores
      for (const assignment of ag.assignments) {
        if (learnerData.assignmentScores.hasOwnProperty(assignment.id)) {
          learnerResult[`assignment_${assignment.id}`] = learnerData.assignmentScores[assignment.id] / assignment.points_possible;
          //Changed learnerResult to log "assignment_(assignment.id) for clarity"
        }
      }
      result.push(learnerResult);
      // console.log(learnerResult)
    }
  }

  return result;
}

// Final:
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);