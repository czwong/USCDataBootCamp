function buildGauge(wfreq) {
    var gauge = d3.select('#gauge');
    gauge.html("")

    var level = 180 - ((180 / 9) * wfreq);

    // Trig to calc meter point
    var degrees = level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
        type: 'scatter',
        x: [0], y: [0],
        marker: { size: 28, color: '850000' },
        showlegend: false,
        name: 'frequency',
        text: wfreq,
        hoverinfo: 'text+name'
    },
    {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7',
            '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['rgba(14, 127, 0, .8)', 'rgba(14, 127, 0, .6)',
                'rgba(110, 154, 22, .8)', 'rgba(110, 154, 22, .6)',
                'rgba(170, 202, 42, .8)', 'rgba(170, 202, 42, .6)',
                'rgba(210, 206, 145, 1)', 'rgba(232, 226, 202, .8)',
                'rgba(232, 226, 202, .5)', 'rgba(255, 255, 200, 0)']
        },
        hoverinfo: 'none',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    var layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
        }],
        margin: {
            t: 100,
            l: 0,
            r: 0,
            b: 0
        },
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week',
        height: gauge._groups[0][0].clientWidth,
        width: gauge._groups[0][0].clientWidth,
        xaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        }
    };

    console.log(d3.select('#gauge'));

    Plotly.newPlot('gauge', data, layout);
};