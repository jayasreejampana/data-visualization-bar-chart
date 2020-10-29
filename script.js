let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

//to import json Data after initiating the http request
let req = new XMLHttpRequest();

//thats is where we store the response we get
let data;

//as response we get a way little more so.. we store the info which we need in this case data i.e., array(gdp, date) in values
let values = [];

//Creating scales

// to determine the height of the bars
let heightScale;

// used to determine where the bars are placed on canvas
let xScale;

// used to draw x axis at the bottom with the dates and y axis at the left
// reason for two extra scales is to make things easier when we do inverting out graph in later point of time
let xAxisScale;
let yAxisScale;

//dimensions of canvas & here padding gives a room around our chart so to make the extreme points lie in the scope
let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");

let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height',height)
}
let generateScales = () => {
  heightScale = d3.scaleLinear()
                  .domain([0,d3.max(values,(d)=>d[1])])
                  .range([0,height-2 * padding])

  xScale = d3.scaleLinear()
              .domain([0,values.length-1])
              .range([padding,width-padding])

  let datesArray = values.map((d)=>{ return new Date(d[0])})

  xAxisScale = d3.scaleTime()
           .domain([d3.min(datesArray),d3.max(datesArray)])
           .range([padding,width-padding])
  yAxisScale = d3.scaleLinear()
           .domain([0,d3.max(values,(d)=>d[1])])
           .range([height - padding , padding])
}
let drawBars = () => {

  let tooltip = d3.select('body')
                  .append('div')
                  .attr('id','tooltip')
                  .style('visibility','hidden')
                  .style('width','auto')
                  .style('height','auto')
  svg.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('class','bar')
          .attr('width',(width - (2* padding))/values.length)
          .attr('data-date',(d)=>d[0])
          .attr('data-gdp',(d)=>d[1])
          .attr('height',(d)=> heightScale(d[1]))
          .attr('x',(d,i)=> xScale(i))
          .attr('y',(d)=>((height-padding)-heightScale(d[1])))
          .on('mouseover',(d)=>{
            tooltip.transition().style('visibility','visible')
            tooltip.text(d[0])
            document.querySelector('#tooltip').setAttribute('data-date',d[0])
          })
          .on('mouseout',(d)=>{
            tooltip.transition().style('visibility','hidden')
          })

}
let generateAxis = () => {
        let xAxis = d3.axisBottom(xAxisScale);
        let yAxis = d3.axisLeft(yAxisScale);
        svg.append('g')
           .call(xAxis)
           .attr('id','x-axis')
           .attr('transform','translate(0,' + (height-padding) + ')')
        svg.append('g')
           .call(yAxis)
           .attr('id','y-axis')
           .attr('transform','translate(' + padding + ',0)')
}
req.open('GET',url,true)
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  console.log(values);
  drawCanvas();
  generateScales();
  drawBars();
  generateAxis();
}
req.send();
