let sWidth = 1200,
sHeight = 600,
curr, sRamp;
var stateCount = 0;
var stateToChange;

let currData = null, sTopology = null;
let low = '#eaceed'; //low end
let high = '#81328a'; //high end
//let low = '#ffe799'; //low end
//let high = '#634d02'; //high end
let minV, maxV;


//create svg element and append map to the SVG
let newSvg = d3.select("#soc-area")
    .append("svg")
    .attr("width", sWidth)
    .attr("height", sHeight)
    .attr("class", "map");


//Load in multiple csv (right now, just Amaka's)
Promise.all([
    d3.csv("data/df_socioeconomic_cleaned.csv"),
    d3.json("data/us.json"),
]).then(function(data){
    currData = data[0]; //general currData data i filtered
    sTopology = data[1]; //for making the map
    console.log(currData.length);
    updateMap2();
});

//tip 
var sTip = d3.tip()
  .attr('class', 'd3-stip')
  .offset([-5, 0])

newSvg.call(sTip);


// Add Event Listener (ranking type)
document.querySelector('#eth').addEventListener("change", updateMap2);

function updateMap2(){
    let avgDataArray = []; //to be used for dealing with legend
    

    // Get the selected ranking option
    var sortType = document.querySelector('#eth').value;
    
    //convert string to float
    for (var i = 0; i < currData.length; i++){
        //convert values to float from string
        if (sortType === "Whites"){
            currData[i].PctWhite = parseFloat(currData[i].PctWhite);
            avgDataArray.push(currData[i].PctWhite);
        }
        else if (sortType === "Blacks"){
            currData[i].PctBlack = parseFloat(currData[i].PctBlack);
            avgDataArray.push(currData[i].PctBlack);
        }
        else if (sortType === "Hispanics"){
            currData[i].PctHisp = parseFloat(currData[i].PctHisp);
            avgDataArray.push(currData[i].PctHisp);
        }
        else if (sortType === "Asians"){
            currData[i].PctAsian = parseFloat(currData[i].PctAsian);
            avgDataArray.push(currData[i].PctAsian);
        }
        else if (sortType === "Natives"){
            currData[i].PctNative = parseFloat(currData[i].PctNative);
            avgDataArray.push(currData[i].PctNative);
        }
        else if (sortType === "Pacific-Islanders"){
            currData[i].PctPacI = parseFloat(currData[i].PctPacI);
            avgDataArray.push(currData[i].PctPacI);
        }
        else if (sortType === "Old"){
            currData[i].Pct65Old = parseFloat(currData[i].Pct65Old);
            avgDataArray.push(currData[i].Pct65Old);
        }
        else{
            currData[i].Pct18Young = parseFloat(currData[i].Pct18Young);
            avgDataArray.push(currData[i].Pct18Young);
        }
        currData[i].PctBlack = parseFloat(currData[i].PctBlack);
        currData[i].PctHisp = parseFloat(currData[i].PctHisp);
        currData[i].PctAsian = parseFloat(currData[i].PctAsian);
        currData[i].PctNative = parseFloat(currData[i].PctNative);
        currData[i].PctPacI = parseFloat(currData[i].PctPacI);
        currData[i].Pct65Old = parseFloat(currData[i].Pct65Old);
        currData[i].Pct18Young = parseFloat(currData[i].Pct18Young);
        //avgObArray.push(currData[i].AvgcurrData);
    }


    
    //change each path's value based on selected year
    for (let i = 0; i < currData.length; i++){
        let currState = currData[i].State;
        if (sortType === "Whites"){
            let sel = currData[i].PctWhite;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }
        }
        else if (sortType === "Blacks"){
            let sel = currData[i].PctBlack;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }            
        }
        else if (sortType === "Hispanics"){
            let sel = currData[i].PctHisp;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }        
        }
        else if (sortType === "Asians"){
            let sel = currData[i].PctAsian;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }        
        }
        else if (sortType === "Natives"){
            let sel = currData[i].PctNative;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }        
        }
        else if (sortType === "Pacific-Islanders"){
            let sel = currData[i].PctPacI;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }        
        }
        else if (sortType === "Old"){
            let sel = currData[i].Pct65Old;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }
        }
        else{
            let sel = currData[i].Pct18Young;
            for (let j = 0; j < sTopology.features.length; j++){
                let topoState = sTopology.features[j].properties.name;
                if (currState === topoState){
                    sTopology.features[j].properties.value = sel;
                    break;
                }
            }   
        } 
    }



    //min and max values of currData
    minV = d3.min(avgDataArray);
    maxV = d3.max(avgDataArray);
    sRamp = d3.scaleLinear() //encoding low and high vals with gradient
        .domain([minV, maxV])
        .range([low, high]);

    //d3 projection
    let projection = d3.geoAlbersUsa() 
        .scale(1300)
        .translate([sWidth / 2, sHeight / 2]);

    //path generator
    let path = d3.geoPath()
        .projection(projection);
    

    //bind data to svg, one path per geojson featuer
    let map = newSvg.selectAll("path")
        .data(sTopology.features, function(d){
            return d;
        });
    map.enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .on('mouseover.tip', sTip.show)
        .on('mouseout', sTip.hide)
        .style("fill", function(d) { 
            return sRamp(d.properties.value) 
        })
        .merge(map)
        sTip.html(function(d){
            return d.properties.name + " : " + d.properties.value +
                 "% of " + sortType + " are considered obese";
        });
    map.exit().remove();

 
    //legend creation
/*
    newSvg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20,80)");

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

    newSvg.select(".legend")
    .call(legendOrdinal);*/
}


