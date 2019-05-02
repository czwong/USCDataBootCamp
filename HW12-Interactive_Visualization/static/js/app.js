function buildMetadata(sample) {
    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    var url = "/metadata/" + `${sample}`;

    // Use d3 to select the panel with id of `#sample-metadata`
    var meta_data = d3.select("#sample-metadata");

    d3.json(url).then(function (response) {
        // Use `.html("") to clear any existing metadata
        meta_data.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(response).forEach(function ([key, value]) {

            // tags for each key-value in the metadata.
            var cell = meta_data.append("p");
            cell.html('<b>' + key + '</b>' + ": " + value);
        });

        // BONUS: Build the Gauge Chart
        // buildGauge(data.WFREQ);
        buildGauge(response.WFREQ);
    });
}

function buildCharts(sample) {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = "/samples/" + `${sample}`;

    var bubble = d3.select("#bubble");

    // @TODO: Build a Bubble Chart using the sample data
    d3.json(url).then(function (data) {
        bubble.html("");

        var trace1 = {
            x: data.otu_ids,
            y: data.sample_values,
            text: data.otu_labels,
            mode: 'markers',
            marker: {
                color: data.otu_ids,
                size: data.sample_values
            },
        };

        var data1 = [trace1];

        var layout1 = {
            margin: {
                t: 5,
                l: 50,
                r: 50,
                b: 50
            },
            showlegend: false,
            height: bubble._groups[0][0].clientHeight,
            width: bubble._groups[0][0].clientWidth,
            xaxis: {
                title: {
                    text: "OTU ID",
                    size: 18
                }
            }
        };

        console.log(layout1);

        Plotly.newPlot("bubble", data1, layout1);
    });

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie = d3.select("#pie");

    d3.json(url).then(function (data) {
        pie.html("");

        var trace2 = {
            values: data.sample_values.slice(0, 10),
            labels: data.otu_ids.slice(0, 10),
            hovertext: data.otu_labels.slice(0, 10),
            type: 'pie'
        };

        var data2 = [trace2];

        var layout2 = {
            margin: {
                t: 10,
                l: 0,
                r: 0,
                b: 0
            },
            showlegend: true,
            height: pie._groups[0][0].clientWidth,
            width: pie._groups[0][0].clientWidth
        };

        Plotly.newPlot("pie", data2, layout2);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
