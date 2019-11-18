
//static bar charts at the bottom
let restSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {"url" : "data/NumRest.csv"},
    background: "#D3D3D3",
    hconcat: [
        {
            title: "Number of Fast Food Restaurants",
            titleColor: "green",
            mark: 'bar',
            width: 500,
            encoding: {
                x: {field: "Year", type: "nominal", axis: {title:  "Year"}, sort: "y"},
                y: {field: "NumberRest", type: "quantitative", axis: {title: "Number of Restaurants"}},
                color: {
                    field: "NumMC", 
                    type: "quantitative",
                    legend: null,
                    scale: {range: ['#ebaef2', '#b55ebf']}
                }
            }
        },
        {
            title: "Number of McDonald's In the US",
            mark: "bar",
            width: 500,
            color: "#D3D3D3",
            encoding: {
                x: {field: "Year", type: "nominal", axis: {title:  "Year"}, sort: "y"},
                y: {field: "NumMC", type: "quantitative", axis: {title: "Number of McDonalds",}},
                color: {
                    field: "NumMC", 
                    type: "quantitative",
                    legend: null,
                    scale: {range: ['#ebaef2', '#b55ebf']}
                }
            }
        }
    ]
};
vegaEmbed('#vega-area', restSpec);



