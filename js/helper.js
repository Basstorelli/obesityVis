
//static bar charts at the bottom
let restSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {"url" : "data/NumRest.csv"},
    background: "#D3D3D3",
    hconcat: [
        {
            title: "Number of Fast Food Restaurants",
            mark: {type: 'line', point: true, tooltip: true},
            width: 500,
            encoding: {
                x: {field: "Year", type: "temporal", axis: {title:  "Year"}, sort: "y"},
                y: {field: "NumberRest", type: "quantitative", 
                        axis: {title: "Number of Restaurants"}, scale: {domain: [220000, 250000]}},
                color: {value: "#BD8BC3"}
            }
        },
        {
            title: "Number of McDonald's In the US",
            mark: {type: 'line', point: true, tooltip: true},
            width: 500,
            encoding: {
                x: {field: "Year", type: "temporal", axis: {title:  "Year"}, sort: "y"},
                y: {field: "NumMC", type: "quantitative", 
                        axis: {title: "Number of McDonalds",}, scale: {domain: [32000, 39000]}},
                color: {value: "#BD8BC3"}
            }
            
        }
    ]
};
vegaEmbed('#vega-area', restSpec);



