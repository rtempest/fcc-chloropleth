const urlEducation = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const urlCounties = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

// width and height of svg
const h = 600
const w = 1000
const ptop = 50

// append svg
const svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)


// create path
const path = d3.geoPath()

// create function to join fips from both datasets
const findFips = (d, ed) => {
    for (e of ed) {
        if (e.fips === d.id) {
            return e
        }
    }
}

// create colour scale
var threshold = d3.scaleThreshold()
    .domain([10, 25, 30, 35, 40, 45, 50])
    .range(["#6A040F", "#9D0208", "#D00000", "#DC2F02", "#E85D04", "#F48C06", "#FAA307"])

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
        .attr('data-education', d => {
            return findFips(d, education)
        })
        .style('fill', d => {
            const e = findFips(d, education)
            // console.log(e.bachelorsOrHigher)
            return threshold(e.bachelorsOrHigher)
        })
        .attr('d', path) // don't need a projection?

    // joinData(us, education)

}

