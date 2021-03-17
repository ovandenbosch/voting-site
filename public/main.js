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

// Canvas JS implementation
let dataPoints = [
  { label: "Candidate A", y: 0 },
  { label: "Candidate B", y: 0 },
  { label: "Candidate C", y: 0 },
];

const chartContainer = document.querySelector("#chartContainer");

if (chartContainer) {
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "theme1",
    title: {
      text: "Vote Results",
    },
    data: [
      {
        type: "column",
        dataPoints: dataPoints,
      },
    ],
  });
  chart.render();

  // Enable pusher logging - don't include this in production
  Pusher.logToConsole = true;

  var pusher = new Pusher("c05df0740880d4b1eee9", {
    cluster: "us2",
  });

  var channel = pusher.subscribe("candidate-poll");
  channel.bind("candidate-vote", function (data) {
    dataPoints = dataPoints.map((x) => {
      if (x.label == data.language) {
        x.y += data.points;
        return x;
      } else {
        return x;
      }
    });
    chart.render();
  });
}
