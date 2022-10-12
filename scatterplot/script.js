/* global d3 */

var w = 800,
h = 600,
m = 50;

var graphSVG = d3.
select('#graphArea').
append('svg').
attr('id', 'graphSVG').
attr('width', w + 2 * m).
attr('height', h + 2 * m);

var legend = d3.
select('#graphSVG').
append('g').
attr('id', 'legend').
attr('transform', 'translate(' + (w - m) + ',' + m + ')').
append('text').
text('Legend Text');

var toolTip = d3.
select('#graphSVG').
append('g').
attr('id', 'tooltip').
attr('transform', 'translate(' + (w - m) + ',' + h / 2 + ')').
append('text').
style('opacity', 0);

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json').
then(data => {
  data.forEach(function (d) {
    var timeSec = new Date(d.Seconds * 1000);
    d.Seconds = timeSec;
  });
  var xScale = d3.scaleLinear().
  domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)]).
  range([m, w + m]);
  var yScale = d3.scaleTime().
  domain([d3.max(data, d => d.Seconds), d3.min(data, d => d.Seconds)]).
  range([h - m, 0]);

  graphSVG.selectAll('circle').
  data(data).
  enter().
  append('circle').
  attr('class', 'dot').
  attr('r', 6).
  attr('cx', d => xScale(d.Year)).
  attr('cy', d => yScale(d.Seconds) + m).
  attr('data-xvalue', d => d.Year).
  attr('data-yvalue', d => d.Seconds).
  on('mouseover', function (event, d) {
    toolTip.
    style('opacity', 0.9).
    attr('data-year', d.Year).
    text(d.Year);
  }).
  on('mouseout', function () {
    toolTip.
    style('opacity', 0);
  });

  var xAxis = d3.axisBottom(xScale).
  tickFormat(d3.format('d'));
  graphSVG.append('g').
  attr('id', 'x-axis').
  attr('transform', 'translate(0,' + h + ')').
  call(xAxis);
  var yAxis = d3.axisLeft(yScale).
  tickFormat(d3.timeFormat('%M:%S'));
  graphSVG.append('g').
  attr('id', 'y-axis').
  attr('transform', 'translate(' + m + ',' + m + ')').
  call(yAxis);
});