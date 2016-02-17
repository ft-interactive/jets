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
	    top:120,
	    left:50,
	    bottom:50,
	    right:30
	};
	let width = 600;
	let height = 600;

	function chart(parent){

		let plotWidth = width - (margin.left + margin.right);
		let plotHeight = height - (margin.top + margin.bottom);

// Annotation texts
		let anno0 = 'We ranked each of the S&P 500 companies according to how much they gave their executives in free personal flights on the corporate airplane'
		let anno1 = 'This dot represents Freeport McRoran, the mining company that spent $1.2m, the most in 2014'
		let anno2 = 'This dot is Morgan Stanley, and the $240,000 it paid for a single emergency round trip flight to Australia for its chairman and chief executive, James Gorman'
		let anno3 = 'Kansas City Southern\'s dot is just above the $25,000 SEC minimum for disclosure. Companies do not have to disclose the value of perquisites worth less than that'
		let anno4 = 'We found 173 companies with discloseable jet perks. If you include all the companies, this chart would look like this instead'
		let anno5 = 'The chart\'s curvature indicates that a handful of companies were a lot more generous with free flights than the others'
		let anno6 = 'This becomes a lot apparent if we show the cumulative value'
		let anno7 = 'The top 10 companies accounted for a quarter of all spending in 2014'
		let anno8 = 'The top 50 companies &mdash; or the top ten percent &mdash; accounted for two-thirds'

		let annotations = [anno0, anno1, anno2, anno3, anno4, anno5, anno6, anno7, anno8];


	//needed for animation
		let storyState = 0;
		let maxState = annotations.length;

//Animations
		let animations = [
			function(){
				changeAnno(anno1);
				d3.select('#Freeport-McMoRan').attr('class','circles.highlight').attr('r','5');
				d3.select('.backbutton.hidden').attr('class','backbutton');
			},
			function(){
				changeAnno(anno2);
				d3.select('#Freeport-McMoRan').attr('class','circles').attr('r','2');
				d3.select('#Morgan_Stanley').attr('class','circles.highlight').attr('r', '5');
			},
			function(){
				changeAnno(anno3);
				d3.select('#Morgan_Stanley').attr('class','circles').attr('r','2');
				d3.select('#Kansas_City_Southern').attr('class','circles.highlight').attr('r','5');
				setTimeout(function(){
					d3.select('line.secLine').style('opacity','1');
				},500
				)
			},
			function(){
				changeAnno(anno4);
				d3.select('#Kansas_City_Southern').attr('class','circles').attr('r','2');
				rescaleX(465);

			},
			function(){changeAnno(anno5)},
			function(){changeAnno(anno6)},
			function(){changeAnno(anno7)},
			function(){changeAnno(anno8)}
		]

		let backAnimations = [

		]


	//functions used to step through the viz
		function swipeForward() {
			if (storyState < 0) {

			} else if (storyState == maxState) {

			} else {
				animations[storyState]();
				counter.html((storyState+2) + "/" + (annotations.length+1))
				return storyState=storyState+1;
			}
		}

		function swipeBack() {	
			if (storyState > maxState) {

			} else if (storyState == 0) {

			} else {
				backAnimations[storyState]();
				counter.html((storyState) + "/" + (annotations.length+1))
				storyState-=1;
				return storyState;
			}
		}
		function changeAnno (newAnno) {
			d3.select(".annotation")
				.style("opacity",0)
			setTimeout(function(){
				d3.select(".annotation").style("opacity",1).text(newAnno);
				wrap(d3.select('.annotation'), Math.min(300, width*2/5));
			},500)
		}

		function rescaleX(newDomainMax) {
            xScale.domain([0,newDomainMax])
            svg.select(".xAxis")
	            .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
	            .call(xAxis);
			d3.selectAll('.circles')
				.transition().duration(1500).ease("sin-in-out")
				.attr('cx', function(d) { return xScale(d[0])})
		}

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

	    parent.append('span')
			.attr('y',20)
			.attr('class','chart-title')
			.html(title);
	    
	    parent.append('span')
			.attr('y',40)
			.attr('class','chart-subtitle')
			.html(subtitle);

		var buttonHolder = parent.append("span")
			.attr("class","buttonHolder")
			.attr('y',60);

		var backBtn = d3.select(".buttonHolder").append("span")
			.attr("class","backbutton hidden")
			.html("&laquo; Back");

		var counter = buttonHolder.append('span')
			.attr({"class":"slideCounter"})
			.html((storyState+1) + "/" + (annotations.length+1));

		var forBtn = d3.select(".buttonHolder").append("span")
			.attr("class","animatebutton")
			.html("Next &raquo;");

		forBtn.on("click", function(){
			swipeForward();
		});
		backBtn.on("click",function(){
			swipeBack();
		});
	    
	    var svg = parent
	        .append('svg')
	            .attr({
	                'width': width,
	                'height': height
	            });

	    parent.append('span')
	        .attr({
	            'y':function(){
	                return height-5;
	            },
	            'class':'chart-source'
	        })
	        .html(source);

	    //axes

	    var axes = svg.append('g')
            .attr({ 
                'class':'axes',
                'id':'axes',
                'transform':'translate(0,' + margin.top + ')' 
            });

	    axes.append('g')
	        .attr({
	            'id': 'xAxis',
	            'class': 'xAxis',
	            'transform': 'translate('+margin.left+','+plotHeight+')'
	        })
	        .call(xAxis);


	    axes.append('g')
	        .attr({
	            'id': 'yAxis',
	            'class': 'yAxis',
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
					return 150;
				},
				'dy':0,
				'x':function(){
					return width*3/5;
				},
			})
			.text(annotations[0]);

		wrap(d3.select('.annotation'), Math.min(300, width*2/5))

	// Draw line showing SEC disclosure threshold
		d3.select('g#plot').append('line')
			.attr({
				'class':'secLine',
				'x1':0,
				'x2':plotWidth,
				'y1':function(){ return yScale(25000)},
				'y2':function(){ return yScale(25000)},
				'stroke-width':2,
				'stroke':'black'
			})

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
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}