(function () {
  'use strict'
  ///
  // variables 
  ///
  // This needs to be 'global' in this context
	var chart;
	var period = 'm';
	var chartElement = document.getElementById('chart_div'); // so we dont have to look it up more than once
	var data = {}; // indexed array {<code>: [ [date, stockValue], ...], ...}
  
  ///
  // functions 
  ///
	var changedCodeValue = function(e) {
		// prevent script injection
		var value = e.target.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");;
		// code will keep track of previous value
		var code = e.target.getAttribute('code');
		// if they match do anything
		if(value === code)
			return;
		if(value) {
			// remove old value
			delete data[code];
			//redraw with new values
			e.target.setAttribute('code', value);
			processDataAndDrawChart(value);
			return;
		}
		// if no old value and empty do nothing.
		if(!code)
			return;
		// new value is empty, so remove data
		delete data[code];
		e.target.setAttribute('code', '');
		drawChart();
	};
	var processDataAndDrawChart = function(codeValue) {
		// if we have code in memory dont call again
		if(!data[codeValue])
			getCodeDataAndDraw(codeValue)
		else
			drawChart();
	};
	var getCodeDataAndDraw = function(codeValue, dontDrawChart) {
		// NEVER DO THIS, we are exposing a token. But this is just an example
		var sandboxUrl = "https://sandbox.iexapis.com/stable/stock/" + codeValue + "/batch?types=chart&range=1" + period + "&last=5&token=Tpk_7b0af25b7162438aa060d045b219f2dc";
		return $.ajax({
			url: sandboxUrl,
			type: "GET",
			headers : {
				'accepts' : 'application/json' 
			},
			dataType: "jsonp",
			success: function  (response) {
				if(!response.chart.length) {
					showAlert(codeValue, 'No data found for "' + codeValue + '"');
					return;
				}
				// parse response data and save it to memory
				data[codeValue] = [].concat(response.chart.map(function(x) {
					return [new Date(x.date), parseInt(x.close)];
				}));
				if(!dontDrawChart)
					drawChart();
			},
			error: function  (err) {
				// in this example just handle 404 error
				if(err.status !== 404)
					return;
				showAlert(codeValue, '"' + codeValue + '" is not a valid code');
			}
		});
	};
	var showAlert = function(codeValue, message) {
		var errorElement = $("[code='"+codeValue+"']").prev();
		// when changing text we are changing html content, so save childs info and reapend
		var crossButton = errorElement.children();
		errorElement.text(message)
			.append(crossButton)
			.show();
		// add a new listener after append
		crossButton.on("click", function(e){
			$(e.currentTarget.parentElement).hide();
		});
	};
	var drawChart = function() {
		var options = {
		  title: 'Historical market ',
		  legend: { position: 'none' },
		  height: 300
		};
		// if isnt initalize then do it
		if(!chart)
			chart = new google.visualization.LineChart(chartElement);
		// if no data in memory hide chart
		if(isDataInMemory()){
			$(chartElement).removeClass('d-none');
			chart.draw(getChartData(), options);
			return;
		}
		$(chartElement).addClass('d-none');
	};
	var getChartData = function() {
		// create data table for google chart
		var dataTable = new google.visualization.DataTable();
		dataTable.addColumn('date', 'Month');
		var stockData = [];
		Object.keys(data).forEach(function(key, index) {
			// every key is a column header (new line in the chart)
			dataTable.addColumn('number', key);
			// data stored should be ordered by date (thats what we asume here)
			// but we should make sure api returns sorted data or do it here. That should go inside the success callback
			// here we should check for same dates (in case any is missing) using underscore would make things easier
			// anyway, first time we create the array of rows its gonna be [time, valueOfFirstLine, valueOfSecondLine]
			// so index 0 adds the time and first value, then we dont, im merging the arrays basicly
			if(index === 0)
				stockData = data[key].slice();
			else
				stockData = stockData.map(function(x, indx) {	
					return x.concat(data[key][indx][1]);
				});
		});
		dataTable.addRows(stockData);
		return dataTable;
	};
	var isDataInMemory = function() {
		return !!Object.keys(data).length;
	};
	var changePeriod = function(e) {
		if(e.target.value === period)
			return;
		period = e.target.value;
		// if no data no need to update current data
		if(!isDataInMemory())
			return;
		$(document.getElementById('spinner')).show();
		// would be better not to chain promises
		// but just to show off
		// also failure should be handled but you can see an example for http 404 on failure for wrong code
		var promise = $.when();
		Object.keys(data).forEach(function(key, index) {
			promise = promise.then(function() {
				return getCodeDataAndDraw(key, true);
			});
		});
		// draw chart
		promise.then(drawChart).always(function() {
			$(document.getElementById('spinner')).hide();
		});
	};
  ///
  // events & executions
  ///
	// redraw grid when resized. Try changing the browser to mobile in the consolo. Or just resize manually
	window.addEventListener("resize", drawChart);
	window.addEventListener('load', function () {
		// append to search and blur events
		$(document.getElementById('inputContainer')).children().each(function(i, stockCodeElement) {
			stockCodeElement.lastElementChild.addEventListener('search', changedCodeValue);
			stockCodeElement.lastElementChild.addEventListener('focusout', changedCodeValue);
		});
		// this is super ugly and generic. But its just to make the example work.
		$('input[type="radio"]').each(function(i, radioButton) {
			radioButton.addEventListener('click', changePeriod);
		});
	})
}())
