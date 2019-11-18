let width = 1200,
height = 600,
current, ramp;
var stateCount = 0;
var stateToChange;

let obesity = null, topology = null, stats = null;
let lowColor = '#eaceed'; //low end
let highColor = '#81328a'; //high end
let minVal, maxVal;


//create svg element and append map to the SVG
let svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");


//Load in multiple csv (right now, just Amaka's)
Promise.all([
    d3.csv("data/MainData.csv"),
    d3.json("data/us.json"),
    d3.csv("data/Filtered.csv")
]).then(function(data){
    obesity = data[0]; //general obesity data i filtered
    topology = data[1]; //for making the map
    stats = data[2];
    console.log(stats);
    updateMap();
});

//tip 
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])

svg.call(tip);

// Add Event Listener (ranking type)
document.querySelector('#year').addEventListener("change", updateMap);

function updateMap(){

    let avgObArray = []; //to be used for dealing with legend

    //convert string to float
    for (var i = 0; i < obesity.length; i++){
        //convert values to float from string
        obesity[i].AvgObesity = parseFloat(obesity[i].AvgObesity);
        avgObArray.push(obesity[i].AvgObesity);
    }
    //min and max values of obesity
    minVal = d3.min(avgObArray);
    maxVal = d3.max(avgObArray);
    ramp = d3.scaleLinear() //encoding low and high vals with gradient
        .domain([minVal, maxVal])
        .range([lowColor, highColor]);
    
    //test what the values are
    //console.log(obesity);
    //console.log(topology);

    //d3 projection
    let projection = d3.geoAlbersUsa() 
        .scale(1250)
        .translate([width / 2, height / 2]);

    //path generator
    let path = d3.geoPath()
        .projection(projection);


    // Get the selected ranking option
	var sortType = document.querySelector('#year').value;


    for (let i = 0; i < obesity.length; i++){
        if (obesity[i].Year == parseInt(sortType, 10)){ //placeholder for now
            //current state in our csv
            let currState = obesity[i].State;
            let currObesity = obesity[i].AvgObesity;
            for (let j = 0; j < topology.features.length; j++){
                let topoState = topology.features[j].properties.name;
                if (currState === topoState){
                    topology.features[j].properties.value = currObesity;
                    break;
                }
            }
        }
    }


    //append div for tooltip to svg
    let div = d3.select("body")
        .append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    //bind data to svg, one path per geojson featuer
    let map = svg.selectAll("path")
        .data(topology.features, function(d){
            return d;
        });
    map.enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("click", selected)
        .style("fill", function(d) { 
            return ramp(d.properties.value) 
        })
        .merge(map)
        //.style("opacity", 0.5)
        .transition()
        //.style("opacity", 1)
        .duration(1000)
        tip.html(function(d) {
            return d.properties.name + " : " +
                d.properties.value + "% obese";
        })

    map.exit().remove();

         //legend creation
    let legW = 140, legH = 300;
    let legKey = d3.select("#legend-area")
        .append("svg")
        .attr("width", legW)
        .attr("height", legH)
        .attr("class", "legend");
    let linGrad = legKey.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");
    linGrad.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", highColor);
    linGrad.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", lowColor);

    legKey.append("rect")
        .attr("width", legW - 100)
        .attr("height", legH)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)");
    let y = d3.scaleLinear()
        .range([legH, 0])
        .domain([minVal + 1, maxVal]);
    let yAxis = d3.axisRight()
        .scale(y);
    legKey.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(41,10)")
			.call(yAxis);
}

function selected(){

    if (stateCount == 0) {
        // if (d3.select(this).style('fill') == "red") {

            d3.select(this).style('fill', "black");
            stateToChange = d3.select(this);
            stateCount += 1;
            selectedState = stateToChange._groups[0][0].__data__.properties.name
            showData(selectedState);
            //console.log(stateToChange._groups[0][0].__data__.properties.name)
    } 
    else {
        // if (d3.select(this).style('fill') == "red") {
        console.log(stateToChange);
        stateToChange.style('fill', function(d) { 
            stateCount = 0;
            return ramp(d.properties.value); 
        })
        stateToChange = null;
        selectedState = null;
    }
}

function showData(state){
    for (let i = 0; i < stats.length; i++){
        if (stats[i].State === state){

            d3.select("#selected").remove();
            d3.select("#stats")
              .append("p")
              .attr("id", "selected")
              .text("Selected State: " + state)

            d3.select("#pop").remove();
            d3.select("#stats")
              .append("p")
              .attr("id", "pop")
              .text("Total Population in 2015: " + stats[i].Population2015)

            d3.select("#insec").remove();
            d3.select("#stats")
            .append("p")
            .attr("id", "insec")
            .text("Food insecurity measure: " + stats[i].Insecurity1315)

            d3.select("#obese").remove();
            d3.select("#stats")
              .append("p")
              .attr("id", "obese")
              .text("Number of obese: " + stats[i].NumberThicc2015)

            d3.select("#rank").remove();
            d3.select("#stats")
            .append("p")
            .attr("id", "rank")
            .text("Obesity Rank Out of 51: " + stats[i].RankObese2015)
            
        }
    }
}

