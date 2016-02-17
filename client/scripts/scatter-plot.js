//scatter plot

import d3 from 'd3';

export default function(){

	let title = 'Title';
	let subtitle = 'Subtitle';
	let source = 'Source';
	let data = [];
	let circleSize = 2;

//general layout information
	let margin = {
	    top:80,
	    left:50,
	    bottom:50,
	    right:30
	};
	let width = 600;
	let height = 600;

// Annotation texts
	let anno1 = 'We ranked each of the S&P 500 companies according to how much they gave their executives in free personal flights on the corporate airplane'
	let anno2 = 'This dot represents Freeport McRoran, the mining company that spent the most in 2014 &mdash; $1.2m'
	let anno3 = 'This dot is Morgan Stanley, and the $240,000 it paid for a single emergency round trip flight to Australia for its chairman and chief executive, James Gorman'
	let anno4 = 'Kansas City Southern\'s dot is just above the $25,000 SEC minimum for disclosure. Companies do not have to disclose the value of perquisites worth less than that'
	let anno5 = 'We found 173 companies with discloseable jet perks. If you include all the companies, this chart would look like this instead'
	let anno6 = 'The chart\'s curvature indicates that a handful of companies were a lot more generous with free flights than the others'
	let anno7 = 'This becomes a lot apparent if we show the cumulative value'
	let anno8 = 'The top 10 companies accounted for a quarter of all spending in 2014'
	let anno9 = 'The top 50 companies &mdash; or the top ten percent &mdash; accounted for two-thirds'

	function chart(parent){

		let plotWidth = width - (margin.left + margin.right);
		let plotHeight = height - (margin.top + margin.bottom);

	    //set up the scale we will use for plotting our scatter plot
	    var xScale = d3.scale.linear()
	        .domain(data.xDomain)
	        .range([0, width-(margin.left+margin.right)]);

	    var yScale = d3.scale.linear()
		    .domain(data.yDomain)
		    .range([height-(margin.top+margin.bottom),0]);
   
	    //define axes based on the scale
	    var xAxis = d3.svg.axis()
	        .scale(xScale)
	        .orient('bottom');

	    var yAxis = d3.svg.axis()
		    .scale(yScale)
		    .orient('left')
		    .tickFormat(d3.format('s'));
	    
	    //set up document structure
	    var svg = parent
	        .append('svg')
	            .attr({
	                'width': width,
	                'height': height
	            });
	    
	    //title
	    svg.append('text')
	        .attr('y',20)
	        .attr('class','title')
	        .text(title);
	    
	     svg.append('text')
	        .attr('y',40)
	        .attr('class','subtitle')
	        .text(subtitle);
	    
	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-5;
	            },
	            'class':'source'
	        })
	        .text(source);

	    //axes

	    var axes = svg.append('g')
            .attr({ 
                'class':'axes',
                'id':'axes',
                'transform':'translate(0,' + margin.top + ')' 
            });

	    axes.append('g')
	        .attr({
	            'id': 'x-axis',
	            'class': 'x axis',
	            'transform': 'translate('+margin.left+','+plotHeight+')'
	        })
	        .call(xAxis);


	    axes.append('g')
	        .attr({
	            'class': 'y axis',
	            'id': 'y-axis',
	            'transform': 'translate('+margin.left+',0)'
	        })
	        .call(yAxis)    

	    var plot = svg.append('g')
            .attr({ 
                'id':'plot',
                transform:'translate(' + margin.left + ',' + margin.top + ')' 
            });

	    var circles = plot.selectAll('circle')
	        .data(data.coords)
	        .enter()
	        .append('circle')
	            .attr({
	                'class':'circles',
	                'cx': function(d) { return xScale(d[0]) },
	                'cy': function(d) { return yScale(d[1]) },
	                'r': circleSize,
	                'id': function(d) { return d[2] },
	                'fill': '#F00'
	            });

		// Draw annotations

		svg.append('text')
			.attr({
				'class':'annotation',
				'y':function(){
					return 100;
				},
				'dy':0,
				'x':function(){
					return width-400;
				},
			})
			.text(anno1);

		wrap(d3.select('.annotation'),300)


	}

	chart.title = function(string){
		title = string;
		return chart;
	};

	chart.data = function(array){
		data = array;
		return chart;
	};

	chart.subtitle = function(string){
		subtitle = string;
		return chart;
	};

	chart.source = function(string){
		source = string;
		return chart;
	};

	chart.circleSize = function(x){
		circleSize = x;
		return chart;
	}

	chart.height = function(x){
		height = x;
		return chart;
	}

	chart.width = function(x){
		width = x;
		return chart;
	}

	chart.margin = function(o){
		margin = o;
		return chart;
	}

	return chart;
}

//utility functions
function sortFunction(a,b)    {
    return a-b;   
}

function daydiff(a,b)   {
    return Math.round((b-a)/(1000 * 60 * 60 * 24));   
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      console.log(width);
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}