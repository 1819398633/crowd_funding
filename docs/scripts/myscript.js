// add your JavaScript/D3 to this file
// Create svg and initial bars

const w = 800;
const h = 600;
const margin = {top: 25, right: 0, bottom: 25,
    left: 25};
const innerWidth = w - margin.left - margin.right;
const innerHeight = h - margin.top - margin.bottom;

const bardata = [{category: "Dance", success_rate: 0.711, total: 263},
               {category: "Theater", success_rate: 0.677, total: 647},
               {category: "Music", success_rate: 0.630, total: 2724},
               {category: "Comics", success_rate: 0.595, total: 571},
               {category: "Film & Video", success_rate: 0.529, total: 3471},
               {category: "Art", success_rate: 0.528, total: 1361},
               {category: "Games", success_rate: 0.494, total: 1614},
               {category: "Design", success_rate: 0.459, total: 1436},
               {category: "Photography", success_rate: 0.407, total: 538},
               {category: "Food", success_rate: 0.405, total: 1106},
               {category: "Journalism", success_rate: 0.403, total: 72},
               {category: "Publishing", success_rate: 0.396, total: 2043},
               {category: "Crafts", success_rate: 0.380, total: 221},
               {category: "Fashion", success_rate: 0.359, total: 1023},
               {category: "Technology", success_rate: 0.357, total: 983}]

const sortedData = bardata.sort((a, b) => a.total - b.total);
const xScale = d3.scaleBand()
    .domain(bardata.map(d => d.category))
    .range([0, innerWidth])
    .paddingInner(.1);

const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0])

const xAxis = d3.axisBottom()
    .scale(xScale);

const yAxis = d3.axisLeft()
    .scale(yScale);

// add svg

const svg = d3.select("body")
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
    .attr("id", "plot")
    .attr("transform", `translate (${margin.left}, ${margin.top})`)
  .selectAll("rect")
    .data(bardata);

bars.enter().append("rect")
    .attr("x", d => xScale(d.category))
    .attr("y", d => yScale(1))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(1))
    .attr("fill", "lightpink");

bars.enter().append("rect")
    .attr("x", d => xScale(d.category))
    .attr("y", d => yScale(d.success_rate))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.success_rate))
    .attr("fill", "lightgreen");


// add axes

svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)
    .call(xAxis);

svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate (${margin.left}, ${margin.top})`)
    .call(yAxis);

