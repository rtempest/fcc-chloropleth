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


// get data
d3.queue()
    .defer(d3.json, urlCounties)
    .defer(d3.json, urlEducation)
    .await(makeMap);

// make the map with the data
function makeMap(error, us, education) {
    const maxEd = d3.max(education.map(x => x.bachelorsOrHigher))
    const minEd = d3.min(education.map(x => x.bachelorsOrHigher))
    // create colour scale
    var threshold = d3.scaleThreshold()
        .domain([10, 20, 30, 40, 50, maxEd])
        .range(['#370617', "#9D0208", "#DC2F02", "#E85D04", "#F48C06", '#FFBA08'])

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
            console.log(ed.bachelorsOrHigher)
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

    // legend

    const legendScale = d3.scaleLinear().domain([0, maxEd]).range([0, 230])

    const legendAxis = d3.axisBottom()
        .scale(legendScale)
        .tickValues([10, 20, 30, 40, 50])

    const legend = svg.append('g')
        .attr('id', 'legend')
        .style('font-size', '6pt')
        .attr('transform', 'translate(620,30)')
        .call(legendAxis)

    // legend label
    svg.append('text')
        .attr('x', 620)
        .attr('y', 20)
        .style('font-size', '7pt')
        .text('Percentage of people with a bachelors degree or higher')

    legend.selectAll('rect')
        .data(threshold.range().map(c => {
            const d = threshold.invertExtent(c);
            if (d[0] == null) d[0] = legendScale.domain()[0]
            if (d[1] == null) d[1] = legendScale.domain()[1]
            return d
        }))
        .enter()
        .append('rect')
        .attr('class', 'legend-rect')
        .attr('x', (d) => legendScale(d[0]))
        .attr('y', 20)
        .attr('height', 20)
        .style('opacity', 0.7)
        .attr('width', (d) => legendScale(d[1]) - legendScale(d[0]))
        .attr('fill', (d) => threshold(d[0]))
}

