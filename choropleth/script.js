/* global d3, topojson */

var h = 600,
w = 1000,
m = 50;

d3.select('#headerBox').
style('margin-left', m + 'px');

var mapSVG = d3.
select('#mapDIV').
append('svg').
attr('id', 'mapSVG').
attr('width', w).
attr('height', h).
style('margin-left', m + 'px').
style('margin-right', m + 'px');

var infoSVG = d3.
select('#mapDIV').
append('svg').
attr('id', 'infoSVG').
attr('width', w / 5).
attr('height', h);

var countyJSON = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
educationJSON = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
Promise.all([d3.json(countyJSON), d3.json(educationJSON)]).
then(data => dataParse(data[0], data[1])).
catch(err => console.log(err));

function dataParse(geo, edu) {
  var newGEO = topojson.feature(geo, geo.objects.counties).features;
  newGEO.forEach(function (feat) {
    var areaName = '';
    var bachelorsOrHigher = -1;
    var result = edu.filter(function (obj) {
      return obj.fips === feat.id;
    });
    if (result[0]) {
      areaName = result[0].area_name;
      bachelorsOrHigher = result[0].bachelorsOrHigher;
    }
    Object.defineProperty(feat, 'areaName', { value: areaName });
    Object.defineProperty(feat, 'bachelorsOrHigher', { value: bachelorsOrHigher });
  });

  var eduScale = d3.
  scaleQuantize().
  domain([d3.min(edu, d => d.bachelorsOrHigher), d3.max(edu, d => d.bachelorsOrHigher)]).
  range(['#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']);

  var legendScale = d3.
  scaleBand().
  domain(eduScale.range()).
  range([0, w / 8]);

  var legend = infoSVG.
  append('g').
  attr('id', 'legend').
  attr('transform', 'translate(0,0)').
  selectAll('rect').
  data(eduScale.range()).
  enter().
  append('rect').
  attr('x', d => legendScale(d)).
  attr('y', 0).
  attr('width', w / 32).
  attr('height', w / 32).
  attr('fill', d => d);

  var toolTip = infoSVG.
  append('g').
  attr('id', 'tooltip').
  attr('transform', 'translate(0,' + m + ')').
  attr('opacity', 0).
  append('text');

  mapSVG.selectAll('path').
  data(newGEO).
  enter().
  append('path').
  attr('class', 'county').
  attr('data-fips', d => d.id).
  attr('data-education', d => d.bachelorsOrHigher).
  attr('fill', d => eduScale(d.bachelorsOrHigher)).
  on('mouseover', function (event, d) {
    toolTip.
    text(d.areaName + ': ' + d.bachelorsOrHigher);
    d3.select('#tooltip').
    attr('data-education', d.bachelorsOrHigher).
    style('opacity', 1);
  }).
  on('mouseout', function () {
    d3.select('#tooltip').
    style('opacity', 0);
  }).
  attr('d', d3.geoPath());

  mapSVG.append('path').
  datum(topojson.mesh(geo, geo.objects.states, function (a, b) {
    return a !== b;
  })).

  attr('d', d3.geoPath()).
  attr('stroke', 'white').
  attr('fill', 'none');


}