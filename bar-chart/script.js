/* global d3 */

var w = 800,
h = 400,
barW = w / 275,
padd = 50;

var chartSVG = d3.
select('#chartArea').
append("svg").
attr("id", "chartSVG").
attr("height", h).
attr("width", w);

var tooltip = d3.
select('#chartArea').
append("div").
attr("id", "tooltip").
style("opacity", 0);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').
then(data => {
  var gdpDate = data.data.map(function (item) {
    return new Date(item[0]);
  });

  var xScale = d3.scaleTime().
  domain([d3.min(gdpDate), d3.max(gdpDate)]).
  range([padd, w - padd]);
  var yScale = d3.scaleLinear().
  domain([0, d3.max(data.data, d => d[1])]).
  range([h - padd, padd]);

  chartSVG.selectAll("rect").
  data(data.data).
  enter().
  append("rect").
  attr("class", "bar").
  attr("x", (d, i) => xScale(gdpDate[i])).
  attr("y", d => yScale(d[1])).
  attr("width", barW).
  attr("height", d => h - yScale(d[1]) - padd).
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  attr("index", (d, i) => i).
  on("mouseover", function (event, i) {
    var i = this.getAttribute('index');
    tooltip.style("opacity", 1);
    tooltip.attr("data-date", data.data[i][0]);
  }).
  on("mouseout", function (event) {
    tooltip.style("opacity", 0);
  });

  var xAxis = d3.axisBottom(xScale);
  chartSVG.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + (h - padd) + ")").
  call(xAxis);
  var yAxis = d3.axisLeft(yScale);
  chartSVG.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + padd + ",0)").
  call(yAxis);
});