const assignmentGroup = {
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
      }
  ]
};

const submissions = [
  {
      learner_id: 125,
      assignment_id: 1,
      submission: {
          submitted_at: "2023-01-25",
          score: 47
      }
  }
];

function transformData(assignmentGroup, submissions) {
  const result = [];
  const assignments = assignmentGroup.assignments.reduce((acc, assignment) => {
      acc[assignment.id] = assignment;
      return acc;
  }, {});

  const learners = submissions.reduce((acc, submission) => {
      const { learner_id, assignment_id, submission: { score } } = submission;
      if (!acc[learner_id]) {
          acc[learner_id] = { id: learner_id, totalScore: 0, totalPossible: 0, assignments: {} };
      }
      const assignment = assignments[assignment_id];
      if (new Date(assignment.due_at) <= new Date()) {
          acc[learner_id].totalScore += score;
          acc[learner_id].totalPossible += assignment.points_possible;
          acc[learner_id].assignments[assignment_id] = (score / assignment.points_possible) * 100;
      }
      return acc;
  }, {});

  for (const learnerId in learners) {
      const learner = learners[learnerId];
      result.push({
          id: learner.id,
          avg: (learner.totalScore / learner.totalPossible) * 100,
          ...learner.assignments
      });
  }

  return result;
}

console.log(transformData(assignmentGroup, submissions));