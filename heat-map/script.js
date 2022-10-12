/* gloabl d3 */

var m = 100,
splitNo = 9,
colArray = ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027'];

d3.select('#infoBox').
style('margin-left', m + 'px');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').
then(data => {
  var w = 5 * Math.ceil(data.monthlyVariance.length / 12),
  h = 12 * 25;

  data.monthlyVariance.forEach(function (d) {
    d.month -= 1;
  });

  var xScale = d3.
  scaleBand().
  domain(data.monthlyVariance.map(d => d.year)).
  range([m, w + m]);

  var yScale = d3.
  scaleBand().
  domain(data.monthlyVariance.map(d => d.month)).
  range([0, h]);

  var colorScale = d3.
  scaleQuantize().
  domain([d3.min(data.monthlyVariance, d => d.variance), d3.max(data.monthlyVariance, d => d.variance)]).
  range(colArray);

  var legendScale = d3.
  scaleBand().
  domain(colorScale.range()).
  range([0, 22 * 9]);

  var legendSVG = d3.select('#legendArea').
  append('svg').
  attr('id', 'legendSVG').
  attr('width', w + 2 * m).
  attr('height', m);

  var legend = legendSVG.
  append('g').
  attr('id', 'legend').
  attr('transform', 'translate(' + m + ',0)').
  selectAll('rect').
  data(colorScale.range()).
  enter().
  append('rect').
  attr('x', d => legendScale(d)).
  attr('y', 0).
  attr('width', 20).
  attr('height', 20).
  attr('fill', d => d);

  var toolTip = legendSVG.
  append('text').
  attr('id', 'tooltip').
  attr('transform', 'translate(' + w / 2 + ',20)').
  style('opacity', 0);

  var graphSVG = d3.
  select('#graphArea').
  append('svg').
  attr('id', 'graphSVG').
  attr('width', w + 2 * m).
  attr('height', h + m);

  graphSVG.selectAll('rect').
  data(data.monthlyVariance).
  enter().
  append('rect').
  attr('class', 'cell').
  attr('x', d => xScale(d.year)).
  attr('y', d => yScale(d.month)).
  attr('width', 5).
  attr('height', 25).
  attr('fill', d => colorScale(d.variance)).
  attr('data-month', d => d.month).
  attr('data-year', d => d.year).
  attr('data-temp', d => d.variance + 8.66).
  on('mouseover', function (event, d) {
    toolTip.
    style('opacity', 0.9).
    attr('data-year', d.year).
    text(d3.format('.2f')(d.variance + 8.66) + 'C');
  }).
  on('mouseout', function () {
    toolTip.style('opacity', 0);
  });
  var xAxis = d3.axisBottom(xScale).
  tickValues(
  xScale.domain().filter(function (year) {
    return (year - 1) % 10 === 0;
  })).

  tickFormat(function (year) {
    var date = new Date(0);
    date.setUTCFullYear(year);
    var format = d3.timeFormat('%Y');
    return format(date);
  });
  graphSVG.append('g').
  attr('id', 'x-axis').
  attr('transform', 'translate(0,' + h + ')').
  call(xAxis);

  var yAxis = d3.axisLeft(yScale).
  tickValues(yScale.domain()).
  tickFormat(function (month) {
    var date = new Date(0);
    date.setUTCMonth(month + 1);
    var format = d3.timeFormat('%B');
    return format(date);
  });
  graphSVG.append('g').
  attr('id', 'y-axis').
  attr('transform', 'translate(' + m + ',0)').
  call(yAxis);

});