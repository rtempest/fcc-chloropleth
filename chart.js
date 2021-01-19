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

// create tooltip
const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')

// create colour scale
var threshold = d3.scaleThreshold()
    .domain([10, 15, 20, 25, 30, 40, 60])
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
            return findFips(d, education).bachelorsOrHigher
        })
        .style('fill', d => {
            const e = findFips(d, education)
            // console.log(e.bachelorsOrHigher)
            return threshold(e.bachelorsOrHigher)
        })
        .attr('d', path) // don't need a projection?
        // append tooltip on mouseover
        .on('mouseover', (d) => {
            const ed = findFips(d, education)
            tooltip.style('visibility', 'visible')
                .style('left', d3.event.pageX + 20 + "px")
                .style('top', `${d3.event.pageY}px`)
                .attr('data-education', ed.bachelorsOrHigher)
                .html(`<p>${ed.area_name}, ${ed.state}</p><p>${ed.bachelorsOrHigher}%`)
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'))

    // append state boundary paths
    svg.append('path')
        .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
        .style('fill', 'none')
        .attr("stroke", "black")
        .style('stroke-width', '1.5px')
        .attr("stroke-linejoin", "round")
        .attr("d", path);

}

