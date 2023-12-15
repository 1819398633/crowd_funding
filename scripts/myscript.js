	// Create svg and initial bars

	const w = 800;
	const h = 500;
	const margin = {top: 25, right: 10, bottom: 25,
		left: 40};
	const innerWidth = w - margin.left - margin.right;
	const innerHeight = h - margin.top - margin.bottom;
	const transitionDuration = 1000;

	const rowConverter = function (d) {
	return {
		category: d.Top_Category,
		success_rate: +d.success_rate,
		total: +d.total
		}
	};

	d3.csv("https://raw.githubusercontent.com/1819398633/crowd_funding/master/categories_d3.csv", rowConverter)
  		.then(function(bardata) {

		// stuff that requires the loaded data
		console.log(bardata);

		let xScale = d3.scaleBand()
			.domain(bardata.map(d => d.category))
			.range([0, innerWidth])
			.paddingInner(.1);

		let yScale = d3.scaleLinear()
			.domain([0, 1])
			.range([innerHeight, 0])

		let xAxis = d3.axisBottom()
			.scale(xScale);

		let yAxis = d3.axisLeft()
			.scale(yScale);

		// add svg

		const svg = d3.select("body")
			.select("div#plot")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		// add background rectangle

		svg.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", w)
			.attr("height", h)
			.attr("fill", "aliceblue");

		// add bars as a group

		const bars = svg.append("g")
			.attr("id", "failed")
			.attr("transform", `translate (${margin.left}, ${margin.top})`)
			.selectAll("rect")
			.data(bardata, d => d.category);

		bars.enter().append("rect")
			.attr("class", "failed")
			.attr("x", d => xScale(d.category))
			.attr("y", d => yScale(1))
			.attr("width", xScale.bandwidth())
			.attr("height", d => innerHeight - yScale(1));

		const bars2 = svg.append("g")
			.attr("id", "success")
			.attr("transform", `translate (${margin.left}, ${margin.top})`)
			.selectAll("rect")
			.data(bardata, d => d.category);

		bars2.enter().append("rect")
			.attr("class", "success")
			.attr("x", d => xScale(d.category))
			.attr("y", d => yScale(d.success_rate))
			.attr("width", xScale.bandwidth())
			.attr("height", d => innerHeight - yScale(d.success_rate));


		// add axes

		svg.append("g")
			.attr("class", "xAxis")
			.attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)
			.call(xAxis);

		svg.append("g")
			.attr("class", "yAxis")
			.attr("transform", `translate (${margin.left}, ${margin.top})`)
			.call(yAxis);


		let chart_type = "proportions";
		let order = "success_rate";

		d3.select("div#charts")
		.selectAll("input")
		.on("click", function() { chart_type = d3.select(this).node().value;
		console.log(chart_type);
		update_all();
		});

		d3.select("div#orders")
		.selectAll("input")
		.on("click", function() { order = d3.select(this).node().value;
			update_all();
		console.log(order);
		});



		function update_prop(data) {

			xScale.domain(bardata.map(d => d.category));

			yScale.domain([0, 1]);

			xAxis = d3.axisBottom()
			.scale(xScale);

			yAxis = d3.axisLeft()
			.scale(yScale);

			const bars = svg.select("#failed")
				.selectAll("rect")
				.data(data, d => d.category);

			bars.transition().duration(transitionDuration).attr("x", d => xScale(d.category))
			.attr("y", d => yScale(1))
			.attr("width", xScale.bandwidth())
			.attr("height", d => innerHeight - yScale(1));

			const bars2 = svg.select("#success")
				.selectAll("rect")
				.data(data, d => d.category);

			bars2.transition().duration(transitionDuration).attr("x", d => xScale(d.category))
			.attr("y", d => yScale(d.success_rate))
			.attr("width", xScale.bandwidth())
			.attr("height", d => innerHeight - yScale(d.success_rate));

			svg.select(".xAxis")
				.transition()
				.duration(transitionDuration)
				.call(xAxis);

			svg.select(".yAxis")
				.transition()
				.duration(transitionDuration)
				.call(yAxis);

		}

		function update_count(data) {

			xScale.domain(bardata.map(d => d.category))

			yScale.domain([0, d3.max(bardata, d => d.total)]);

			xAxis = d3.axisBottom()
			.scale(xScale);

			yAxis = d3.axisLeft()
			.scale(yScale);

			const bars = svg.select("#failed")
				.selectAll("rect")
				.data(data, d => d.category);

			bars.transition().duration(transitionDuration).attr("x", d => xScale(d.category))
			.attr("y", d => yScale(d.total))
			.attr("width", xScale.bandwidth())
			.attr("height", d => innerHeight - yScale(d.total));

			const bars2 = svg.select("#success")
				.selectAll("rect")
				.data(data, d => d.category);

			bars2.transition().duration(transitionDuration).attr("x", d => xScale(d.category))
			.attr("y", d => yScale(d.success_rate*d.total))
			.attr("width", xScale.bandwidth())
			.attr("height", d => innerHeight - yScale(d.success_rate*d.total));

			svg.select(".xAxis")
				.transition()
				.duration(transitionDuration)
				.call(xAxis);

			svg.select(".yAxis")
				.transition()
				.duration(transitionDuration)
				.call(yAxis);

		}

		function update_all(){
			if (order == "success_rate"){
				var sortedData = bardata.sort((a, b) => b.success_rate - a.success_rate);
				console.log('sort by success rate');
			} else{
				var sortedData = bardata.sort((a, b) => b.total - a.total);
				console.log('sort by total');
			}
			if (chart_type=="proportions"){
				update_prop(bardata);
				console.log('updated by proportions');
			} else{
				update_count(bardata);
				console.log('updated by count');
			}
		};

	})
	.catch(function(error) {

		// error handling
		d3.select("body")
			.select("div#plot")
			.append("p")
			.attr('x', w/2)
			.attr('y', h/2)
			.text("Error loading data !");

	});
