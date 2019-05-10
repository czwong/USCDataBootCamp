d3.select("#scatter").html("");

var svgWidth = 900;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .attr("class", "chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis= "poverty";
var chosenYAxis = "healthcare";

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]), d3.max(data, d => d[chosenXAxis])])
        .range([0, width]);

    return xLinearScale;
}

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]), d3.max(data, d => d[chosenYAxis])])
        .range([height, 0])

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, txtGroup, newScale, chosenAxis) {
    if (chosenAxis === "poverty" || chosenAxis === "age" || chosenAxis === "income") {
        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newScale(d[chosenAxis]));
        txtGroup.transition()
            .duration(1000)
            .attr("x", d => newScale(d[chosenAxis]));
    }
    else {
        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newScale(d[chosenAxis]));
        txtGroup.transition()
            .duration(1000)
            .attr("y", d => newScale(d[chosenAxis]) + 4);
    }

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
        var labelx = "In Poverty: ";
    }
    else if (chosenXAxis === "age") {
        var labelx = "Average Age: ";
    }
    else {
        var labelx = "Household Income: $";
    }

    if (chosenYAxis === "healthcare") {
        var labely = "Without Healthcare: ";
    }
    else if (chosenYAxis === "smokes") {
        var labely = "Smokers: ";
    }
    else {
        var labely = "Obesity: ";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, 0])
        .html(function (d) {
            if (chosenXAxis == "poverty") {
                return (`${d.state}<br>${labelx}${d[chosenXAxis]}%<br>${labely}${d[chosenYAxis]}%`);
            }
            else {
                return (`${d.state}<br>${labelx}${d[chosenXAxis]}<br>${labely}${d[chosenYAxis]}%`);
            }
        }
    );

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

d3.csv("assets/data/data.csv")
    .then(function (somedata) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        somedata.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = +data.obesity
        });

        // Step 2: Scale
        // ==============================
        var xLinearScale = xScale(somedata, chosenXAxis);
        var yLinearScale = yScale(somedata, chosenYAxis);

        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Step 5: Create Circles and Abbreviations
        // ==============================
        var group = chartGroup.selectAll("g.Circle")
            .data(somedata)
            .enter()
            .append("g");

        var txtGroup = group
            .append("text")
            .attr("class", "stateText")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .style("text-anchor", "middle");

        var circlesGroup = group
            .append("circle")
            .attr("class", "stateCircle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 12)
            .attr("fill", "blue")
            .attr("opacity", ".4");

        // Create group for x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${(width / 2)}, ${height + 20})`);

        // Create group for y-axis labels
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${0}, ${(height / 2)})`);

        // append x axis
        var povertyLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", "1em")
            .attr("value", "poverty")
            .classed("active", true)
            .text("In Poverty (%)");

        var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("dy", "1em")
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("dy", "1em")
            .attr("value", "income")
            .classed("inactive", true)
            .text("Household Income (Median)");

        // append y axis
        var healthcareLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -45)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Without Healthcare (%)");

        var smokeLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -65)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokes (%)");

        var obesityLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -85)
            .attr("dy", "1em")
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obesity (%)");

        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // x axis labels event listener
        xlabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    // replaces chosenXAxis with value
                    chosenXAxis = value;

                    // updates x scale for new data
                    xLinearScale = xScale(somedata, chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderXAxes(xLinearScale, xAxis);

                    // updates circles with new x values
                    circlesGroup = renderCircles(circlesGroup, txtGroup, xLinearScale, chosenXAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // changes classes to change bold text
                    if (chosenXAxis === "poverty") {
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "age") {
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });

        // y axis labels event listener
        ylabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {

                    // replaces chosenYAxis with value
                    chosenYAxis = value;

                    // updates y scale for new data
                    yLinearScale = yScale(somedata, chosenYAxis);

                    // updates y axis with transition
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // updates circles with new y values
                    circlesGroup = renderCircles(circlesGroup, txtGroup, yLinearScale, chosenYAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // changes classes to change bold text
                    if (chosenYAxis === "healthcare") {
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "smokes") {
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });
    });