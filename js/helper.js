
//static bar charts at the bottom
let restSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {"url" : "data/NumRest.csv"},
    background: "#D3D3D3",
            title: "Number of Fast Food Restaurants",
            mark: {type: 'line', point: {filled: false, fill: "white"}, tooltip: true},
            width: 600,
            height: 600,
            encoding: {
                x: {field: "Year", type: "temporal", axis: {title:  "Year"}, sort: "y"},
                y: {field: "NumberRest", type: "quantitative", 
                        axis: {title: "Number of Restaurants"}, format: ",", scale: {domain: [220000, 250000]}},
                color: {value: "#BD8BC3"}
            }
};
vegaEmbed('#vega-area', restSpec);



