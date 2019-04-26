// from data.js
var tableData = data;

// Select the submit and clear button
var submit = d3.select("#filter-btn");
var clear = d3.select("#clear-btn");

// Select dropdown field
var dropDownField = d3.select("#dataSet");

dropDownField.on("click", function () {
    currentSel = d3.event.target.value;
    // Test
    console.log("On change, the current dropdown selection is : " + currentSel);
});

// Select table body
var tbody = d3.select("tbody");

tableData.forEach(function(UFOReport) {
    var row = tbody.append("tr");
    Object.values(UFOReport).forEach(function(value) {
        // Append a cell to the row for each value
        var cell = tbody.append("td");
        cell.attr("class", "text-center");
        cell.text(value);
    });
});

// Show original data when "Clear Filter" is pressed
clear.on("click", function () {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Remove all previous rows
    var row = d3.select("tbody").selectAll("td");
    row.remove();

    // Show original data
    tableData.forEach(function (UFOReport) {
        var row = tbody.append("tr");
        Object.values(UFOReport).forEach(function (value) {
            // Append a cell to the row for each value
            var cell = tbody.append("td");
            cell.attr("class", "text-center");
            cell.text(value);
        });
    });
});

// Filtered data when "Filter Table" is pressed
submit.on("click", function () {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Remove all previous rows
    var row = d3.select("tbody").selectAll("td");
    row.remove();

    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#input");

    // Get the value property of the input element
    var inputValue = inputElement.property("value");

    // Filter data based on input
    var filteredData = tableData.filter(report => report[currentSel] === inputValue);

    // If input is empty return original data
    if (inputValue === "") {
        tableData.forEach(function (UFOReport) {
            var row = tbody.append("tr");
            Object.values(UFOReport).forEach(function (value) {
                // Append a cell to the row for each value
                var cell = tbody.append("td");
                cell.attr("class", "text-center");
                cell.text(value);
            });
        });
    }

    // Else filter data based on input
    else {
        filteredData.forEach(function (UFOReport) {
            console.log(UFOReport);
            var row = tbody.append("tr");
            Object.values(UFOReport).forEach(function (value) {
                // Append a cell to the row for each value
                var cell = tbody.append("td"); 
                cell.attr("class", "text-center");
                cell.text(value);
            });
        });
    }
});