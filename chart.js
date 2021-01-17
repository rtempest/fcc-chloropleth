const urlEducation = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const urlCountry = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

// width and height of svg
const h = 600
const w = 700

// append svg
const svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)


// get data
d3.queue()
    .defer(d3.json, urlEducation)
    .defer(d3.json, urlCountry)
    .await(makeMap);

// make the map with the data
function makeMap(error, education, country) {
    console.log(country)
}