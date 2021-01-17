const urlEducation = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const urlCountry = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'


d3.queue()
    .defer(d3.json, urlEducation)
    .defer(d3.json, urlCountry)
    .await(makeMap);


function makeMap(error, education, country) {
    console.log('it worked')
}