const form = document.getElementById("vote-form");
const votechart = document.getElementById("titleandchart");
const rad_buttons = document.getElementsByName("candidate");
const error_message = document.getElementById("errormessage");
const hasvoted = window.localStorage.getItem("voted");
var event;

// Hide chart until submission
function Showchart() {
  votechart.style.display = "block";
  window.localStorage.setItem("voted", true);
}

// Checking if someone has already voted
if (window.localStorage.getItem("voted") == "true") {
  votechart.style.display = "block";
  button.className = "btn disabled";
  // Alert message
  alert("You have already voted!");
  error_message.innerHTML = "You have already voted";
  // Disables all buttons
  rad_buttons.forEach((rad_button) => {
    rad_button.setAttribute("disabled", "disabled");
  });
}

// Form submit event
form.addEventListener("submit", (e) => {
  const choice = document.querySelector("input[name=candidate]:checked").value;
  const data = { candidate: choice };
  // What happens if there is a vote
  fetch("http://192.168.1.106:3000/vote", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));

  e.preventDefault();
});

// What happens if there is a vote that needs to be counted
fetch("http://192.168.1.106:3000/vote")
  .then((res) => res.json())
  .then((data) => {
    let votes = data.votes;
    let totalVotes = votes.length;
    document.querySelector(
      "#chartTitle"
    ).textContent = `Total Votes: ${totalVotes}`;

    let voteCounts = {
      CandidateA: 0,
      CandidateB: 0,
      CandidateC: 0,
    };

    // Count points for each candidate - acc = accumulate

    voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.candidate] =
          (acc[vote.candidate] || 0) + parseInt(vote.points)),
        acc
      ),
      {}
    );

    // Canvas JS implementation
    let dataPointsreal = [
      { label: "Candidate A", y: voteCounts.CandidateA, id: "CandidateA" },
      { label: "Candidate B", y: voteCounts.CandidateB, id: "CandidateB" },
      { label: "Candidate C", y: voteCounts.CandidateC, id: "CandidateC" },
    ];

    // Auto-update title
    const chartContainer = document.querySelector("#chartContainer");

    if (chartContainer) {
      // Listen for vote event
      document.addEventListener("votesAdded", function (e) {
        document.querySelector(
          "#chartTitle"
        ).textContent = `Total Votes: ${e.detail.totalVotes}`;
      });

      // Canvas JS chart creation
      const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "theme1",
        title: {
          text: "Voting system",
        },
        data: [
          {
            type: "column",
            dataPoints: dataPointsreal,
          },
        ],
      });
      chart.render();

      ///////////////////////
      // Pusher integration//
      ///////////////////////
      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = false;

      var pusher = new Pusher("c05df0740880d4b1eee9", {
        cluster: "us2",
      });

      var channel = pusher.subscribe("candidate-poll");

      channel.bind("candidate-vote", function (data) {
        dataPointsreal.forEach((point) => {
          if (point.id == data.candidate) {
            point.y += data.points;
            totalVotes += data.points;
            event = new CustomEvent("votesAdded", {
              detail: { totalVotes: totalVotes },
            });
            // Dispatch
            document.dispatchEvent(event);
          }
        });
        chart.render();
      });
    }
  });
