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
  .offset([-150, 80])
  .html("<p id = 'sName'></p><p id = 'obsty'></p></p><div id='chartImbed'></div><p id = 'leg1'></p><p id ='leg2'></p>");

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
        .scale(1300)
        .translate([width / 2, height / 2]);

    //path generator
    let path = d3.geoPath()
        .projection(projection);


    // Get the selected ranking option
	var sortType = document.querySelector('#year').value;

    //change each path's value based on selected year
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
        .on('mouseover.tip', tip.show)
        .on('mouseover.fact', function(d){
            current = d3.select(this)._groups[0][0].__data__.properties.name;
            currVal = d3.select(this)._groups[0][0].__data__.properties.value;
            let stackChart = {
                $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
                data: {"url" : "data/DataByState/DataByState - "+current+".csv"},
                background: "#D3D3D3",
                layer: [
                    {                  
                    mark: "bar",
                    encoding: {
                        x: {"field": "Year", "type": "ordinal"},
                        y: {field: "PopulationTotal", type: "quantitative", axis: {title:  "Population"}},
                        color: {value: "#c2a030 "},
                        opacity: {"value": 0.7}
                      }
                    },
                    {
                      mark: "bar",
                      encoding: {
                        x: {"field": "Year", "type": "ordinal"},
                        y: {field: "PopulationObese", type: "quantitative"},
                        color: {value: "#b55ebf"},
                      }
                    },
            
                ]
            };
            vegaEmbed('#chartImbed', stackChart);
            document.getElementById("sName").textContent = "Selected state: " + current;
            document.getElementById("obsty").textContent = currVal + "% obese in " + sortType;
            document.getElementById("leg1").textContent = "Non-Obese Population";
            document.getElementById("leg2").textContent = "Obese Population";
        })
        .on('mouseout', tip.hide)
        .style("fill", function(d) { 
            return ramp(d.properties.value) 
        })
        .merge(map)
    map.exit().remove();

 
    //legend creation

    legendSide = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20,80)");

    legendSide.append("text")
        .attr("x", 0)
        .attr("y", -15)
        .text("% Obese");

    var nums = ["20%", "24%", "28%", "32%", "36%", "40%", "44%", "48%"];
    var colors = ["#EACEED", "#DBB8DF", "#CCA1D1", "#BD8BC3",
                "#AE75B4", "#9F5FA6", "#904898", "#81328A"]

    var ordinal = d3.scaleOrdinal()
    .domain(nums)
    .range(colors);

    var legendOrdinal = d3.legendColor()
    .scale(ordinal)
    .shapePadding(10)
    .shapeWidth(25)
    .shapeHeight(25)
    .labelOffset(10)

    svg.select(".legend")
    .call(legendOrdinal);
}

/*
function selected(d){
    if (stateCount == 0) {
         if (d3.select(this).style('fill') == "red") {

            d3.select(this).style('fill', "606c76");
            stateToChange = d3.select(this);
            stateCount += 1;
            selectedState = stateToChange._groups[0][0].__data__.properties.name
            genChart(selectedState);
            console.log(stateToChange._groups[0][0].__data__.properties.name)
    } 
    else {
        if (d3.select(this).style('fill') == "red") {
        console.log(stateToChange);
        stateToChange.style('fill', function(d) { 
            stateCount = 0;
            return ramp(d.properties.value); 
        })
        stateToChange = null;
        selectedState = null;
    }
}
*/

/*
function showData(state){
    console.log(state);
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

            d3.select("#stackedChart").remove();
            d3.select("#stats")
                .append("div")
                .attr("id", "stackedChart")




                
            
        }
    }
}*/

/*
function genChart(state){
    //static bar charts at the bottom
    let stackChart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        data: {"url" : "data/DataByState/DataByState - "+state+".csv"},
        background: "#D3D3D3",
        layer: [
            {                  
             mark: "bar",
            encoding: {
                x: {"field": "Year", "type": "ordinal"},
                y: {field: "PopulationTotal", type: "quantitative", axis: {title:  "Population"}},
                color: {value: "#b55ebf"},
    
                
                // color: {
                //   field: "PopulationObese", "type": "quantitative",
                //   scale: {"range": ["#e377c2", "#1f77b4"]}
                // },
                opacity: {"value": 0.7}
              }
            },
    
            {
              mark: "bar",
              encoding: {
                x: {"field": "Year", "type": "ordinal"},
                y: {field: "PopulationObese", type: "quantitative"},
                color: {value: "#606c76"},
    
                
                // color: {
                //   field: "PopulationObese", "type": "quantitative",
                //   scale: {"range": ["#e377c2", "#1f77b4"]}
                // },
    
              }
            },
    
        ]
    
    };
    vegaEmbed('#stats', stackChart);
}*/

