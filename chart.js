const urlEducation = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const urlCounties = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

// width and height of svg
const h = 600
const w = 1000

// append svg
const svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

// define projection
const proj = d3.geoAlbersUsa()

// create paths
const path = d3.geoPath()
    .projection(proj)

// get data
d3.queue()
    .defer(d3.json, urlCounties)
    .defer(d3.json, urlEducation)
    .await(makeMap);

// make the map with the data
function makeMap(error, us, education) {
    // add counties layer
    g = svg.append('g')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', d => d.id)
        .attr('d', d3.geoPath())

    // console.log(topojson.feature(us, us.objects.counties).features)

}