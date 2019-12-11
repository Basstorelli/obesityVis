//Work done by Amaka NNaeto


let margin = {top: 40, right: 20, bottom: 40, left: 90},
    widthrace = document.querySelector('#racechart-area').clientWidth - margin.left - margin.right,
    heightrace = 400 - margin.top - margin.bottom;

//width = width > 600 ? 600 : width;

let svgrace = d3.select("#racechart-area").append("svg")
    .attr("width", widthrace + margin.left + margin.right)
    .attr("height", heightrace + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x = d3.scaleBand()
    .range([0, widthrace])
    .paddingInner(0.5)
    .paddingOuter(.5);

let y = d3.scaleLinear()
    .range([heightrace, 0]);

let xAxis = d3.axisBottom()
    .scale(x)
    //.tickFormat(function(d) { return shortenString(d, 20); });

let yAxis = d3.axisLeft()
    .scale(y);

let xAxisGroup = svgrace.append("g")
    .attr("class", "x-axis axis");

let yAxisGroup = svgrace.append("g")
    .attr("class", "y-axis axis");

d3.csv("data/DatabyRace.csv", d=>{
    d.Data_Value= +d.Data_Value;
    return d;
}).then(function(data){
    data2 = data.slice(0,7);
    data2.sort((a,b)=>b.Data_Value-a.Data_Value);
    renderBarChart(data2);
});

document.querySelector('#raceEth').addEventListener("change", FilterData);

function FilterData(){
    d3.csv("data/DatabyRace.csv", d=>{
        //d.dataval = +d.dataval;
        return d; 
    }).then(function(data){
    console.log(data)
    let selectBox = document.querySelector("#raceEth");
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    
    if (selectedValue=="veg"){
		data = data.filter(d => d.Question == "Percent of adults who report consuming vegetables less than one time daily");
        console.log(data)
        renderBarChart(data);
	}else if (selectedValue=="nophys"){
		data = data.filter(d => d.Question == "Percent of adults who engage in no leisure-time physical activity");
        renderBarChart(data);
        console.log(data)
		//console.log(dataWater)
	}else if (selectedValue=="obese"){
		data = data.filter(d => d.Question == "Percent of adults aged 18 years and older who have obesity");
		renderBarChart(data);
		//console.log(dataMus)
    }
    else if (selectedValue=="overweight"){
		data = data.filter(d => d.Question == "Percent of adults aged 18 years and older who have an overweight classification");
		renderBarChart(data);
	}else if (selectedValue == 'activity'){
        data = data.filter(d => d.Question == "Percent of adults who achieve at least 150 minutes a week of moderate-intensity aerobic physical activity or 75 minutes a week of vigorous-intensity aerobic activity (or an equivalent combination)");
		renderBarChart(data);
	}

    renderBarChart(data)})
}



function renderBarChart(data){
    x.domain(data.map(function(d) { return d.race; }));
    y.domain([0, d3.max(data, function(d) { return d.Data_Value; })]);

    data.sort((a,b)=>b.Data_Value-a.Data_Value);

    let bars = svgrace.selectAll(".bar")
        .remove()
        .exit()
        .data(data)

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", "rgb(170,115,170)")
        .merge(bars)
        .attr("x", function(d){ return x(d.race); })
        .attr("y", function(d){ return (y(d.Data_Value)); })
        .transition().duration(800)
        .attr("height", function(d){ return heightrace - y(d.Data_Value); })
        .attr("width", x.bandwidth())
        //.transition().duration(500)
        .attr("fill", "rgb(178,122,184)")

    xAxisGroup = svgrace.select(".x-axis")
        .attr("transform", "translate(0," + heightrace + ")")
        .call(xAxis);

    yAxisGroup = svgrace.select(".y-axis")
        .call(yAxis);

    svgrace.select("text.axis-title").remove();
}