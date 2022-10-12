/* global d3 */

var h = 600,
w = 1000,
m = 50;

d3.select('#headerDIV').
style('margin-left', m + 'px');

var visSVG = d3.
select('#visDIV').
append('svg').
attr('id', 'visSVG').
attr('width', w).
attr('height', h).
style('margin-left', m + 'px').
style('margin-right', m + 'px');

var infoSVG = d3.
select('#visDIV').
append('svg').
attr('id', 'infoSVG').
attr('width', w / 5).
attr('height', h);

var color = d3.scaleOrdinal().range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69']);

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').
then(data => {
  /*var categories = [];
  data.children.forEach(function(child){
    categories.push(child.name)
  });*/

  var root = d3.
  hierarchy(data).
  sum(d => d.value).
  sort((a, b) => b.value - a.value);

  var treeMap = d3.
  treemap().
  size([w, h]).
  paddingInner(1);

  treeMap(root);

  var categories = root.children.map(function (child) {
    return child.data.name;
  });

  var legendScale = d3.
  scaleBand().
  domain(categories).
  range([0, 30 * categories.length]);

  var legend = infoSVG.
  append('g').
  attr('id', 'legend').
  selectAll('rect').
  data(categories).
  enter().
  append('rect').
  attr('class', 'legend-item').
  attr('x', 0).
  attr('y', d => legendScale(d)).
  attr('width', 25).
  attr('height', 25).
  attr('fill', (d, i) => color(d[i]));

  infoSVG.selectAll('text').
  data(categories).
  enter().
  append('text').
  text(d => d).
  attr('x', 30).
  attr('y', (d, i) => i * 30 + 20);

  var cell = visSVG.
  selectAll('g').
  data(root.leaves()).
  enter().
  append('g').
  attr('class', 'group').
  attr('transform', function (d) {
    return 'translate(' + d.x0 + ',' + d.y0 + ')';
  });

  var toolTip = infoSVG.
  append('g').
  attr('id', 'tooltip').
  attr('transform', 'translate(0,' + h / 2 + ')').
  attr('opacity', 0).
  append('text');

  cell.
  append('rect').
  attr('class', 'tile').
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  attr('fill', d => color(d.data.category)).
  attr('data-name', d => d.data.name).
  attr('data-category', d => d.data.category).
  attr('data-value', d => d.data.value).
  on('mouseover', function (event, d) {
    toolTip.
    text(d.data.name + ': ' + d.data.value);
    d3.select('#tooltip').
    attr('data-value', d.data.value).
    style('opacity', 1);
  }).
  on('mouseout', function () {
    d3.select('#tooltip').
    style('opacity', 0);
  });

  cell.
  append('text').
  text(d => d.data.name).
  style('font-size', '0.8em').
  attr('transform', 'translate(0,10)');
});