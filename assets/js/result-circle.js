// Overall
let dataset = [
  {
    name: 'Pass',
    percent: 0, // Initialize to 0
  },
  {
    name: 'Fail',
    percent: 0, // Initialize to 0
  }
];

const quizScore2 = localStorage.getItem("quizScore");
if (quizScore2) {
  const totalQuestions = 4; // Set the total number of questions
  const correctAnswers = parseInt(quizScore2);
  const incorrectAnswers = totalQuestions - correctAnswers;
  const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
  const incorrectPercentage = ((incorrectAnswers / totalQuestions) * 100).toFixed(2);

  const totalQuestionsElement = document.getElementById("total-questions");
  const correctAnswersElement = document.getElementById("correct-answers");
  const correctPercentageElement = document.getElementById("correct-percentage");
  const positiveResultElement = document.querySelector(".positive");
  const negativeResultElement = document.querySelector(".negative");

  if (totalQuestionsElement) {
    totalQuestionsElement.textContent = totalQuestions;
  }

  if (correctAnswersElement) {
    correctAnswersElement.textContent = correctAnswers;
  }

  if (correctPercentageElement) {
    correctPercentageElement.textContent = correctPercentage + "%";
  }

  if (positiveResultElement) {
    positiveResultElement.textContent = correctPercentage + "%";
  }

  if (negativeResultElement) {
    negativeResultElement.textContent = incorrectPercentage + "%";
  }

  dataset[0].percent = correctPercentage;
  dataset[1].percent = incorrectPercentage;
}

let pie = d3.layout.pie()
  .value(function (d) {
    return d.percent;
  })
  .sort(null)
  .padAngle(.03);

let w = 300,
  h = 300;

let outerRadius = w / 2;
let innerRadius = 100;

let color = d3.scale.ordinal().range(["#00FFFF", "#C2118D"]);

let arc = d3.svg.arc()
  .outerRadius(outerRadius)
  .innerRadius(innerRadius);

let svg = d3.select("#chartO")
  .append("svg")
  .attr({
    width: w,
    height: h,
    class: 'shadow'
  })
  .append('g')
  .attr({
    transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
  });
let path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr({
    d: arc,
    fill: function (d, i) {
      return color(d.data.name);
    }
  });

path.transition()
  .duration(1000)
  .attrTween('d', function (d) {
    let interpolate = d3.interpolate({
      startAngle: 0,
      endAngle: 0
    }, d);
    return function (t) {
      return arc(interpolate(t));
    };
  });

let restOfTheData = function () {
  var text = svg.selectAll('text')
    .data(pie(dataset))
    .enter()
    .append("text")
    .transition()
    .duration(200)
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("dy", ".4em")
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.data.percent + "%";
    })
    .style({
      fill: 'black',
      'font-size': '14px'
    });

  let legendRectSize = 20;
  let legendSpacing = 7;
  let legendHeight = legendRectSize + legendSpacing;

  let legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr({
      class: 'legend',
      transform: function (d, i) {
        // Just a calculation for x & y position
        return 'translate(-35,' + ((i * legendHeight) - 65) + ')';
      }
    });
  legend.append('rect')
    .attr({
      width: legendRectSize,
      height: legendRectSize,
      rx: 20,
      ry: 20
    })
    .style({
      fill: color,
      stroke: color
    });

  legend.append('text')
    .attr({
      x: 30,
      y: 15
    })
    .text(function (d) {
      return d;
    }).style({
      fill: '#00FFFF',
      'font-size': '16px'
    });
};

setTimeout(restOfTheData, 1000);
