const form = document.getElementById("vote-form");

// Form submit event
form.addEventListener("submit", (e) => {
  const choice = document.querySelector("input[name=candidate]:checked").value;
  const data = { candidate: choice };

  fetch("http://localhost:3000/vote", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  e.preventDefault();
});

fetch("http://localhost:3000/vote")
  .then((res) => res.json())
  .then((data) => {
    const votes = data.votes;
    const totalVotes = votes.length;
    document.querySelector(
      "#chartTitle"
    ).textContent = `Total Votes: ${totalVotes}`;
    // Count points for each candidate - acc = accumulate
    let voteCounts = {
      CandidateA: 0,
      CandidateB: 0,
      CandidateC: 0
    }
    
    voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.candidate] =
          (acc[vote.candidate] || 0) + parseInt(vote.points)),
        acc
      ),
      {}
    );

    // Canvas JS implementation
    let dataPoints = [
      { label: "Candidate A", y: voteCounts.CandidateA },
      { label: "Candidate B", y: voteCounts.CandidateB },
      { label: "Candidate C", y: voteCounts.CandidateC },
    ];

    const chartContainer = document.querySelector("#chartContainer");

    if (chartContainer) {
      // Listen for the event.
      document.addEventListener("votesAdded", function (e) {
        document.querySelector(
          "#chartTitle"
        ).textContent = `Total Votes: ${e.detail.totalVotes}`;
      });

      const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "theme1",

        data: [
          {
            type: "column",
            dataPoints: dataPoints,
          },
        ],
      });
      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = false;

      var pusher = new Pusher("c05df0740880d4b1eee9", {
        cluster: "us2",
      });

      var channel = pusher.subscribe("candidate-poll");
      channel.bind("candidate-vote", function (data) {
        dataPoints = dataPoints.map((x) => {
          if (x.label == data.candidate) {
            x.y += data.points;
            return x;
          } else {
            return x;
          }
        });
        chart.render();
      });
    }
  });
