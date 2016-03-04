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
	    bottom:100,
	    right:30
	};
	let width = 600;
	let height = 600;

	function chart(parent){

		let plotWidth = width - (margin.left + margin.right);
		let plotHeight = height - (margin.top + margin.bottom);

// Annotation texts
		let anno0 = 'We ranked each of the S&P 500 companies according to how much they spent giving free personal flights on the company plane to their executives'
		let anno1 = 'This dot represents Freeport McRoran, the mining company that spent $1.2m, the most in 2014'
		let anno2 = 'This dot is Morgan Stanley, and the $240,000 it paid for a single emergency round trip flight to Australia for James Gorman, its chairman and chief executive'
		let anno3 = 'Kansas City Southern\'s dot is just above the SEC\'s disclosure minimum. Companies do not have to report the value of perquisites worth less than $25,000 a year'
		let anno4 = '173 companies disclosed jet perks in 2014. If you include all the 465 companies we looked at in the S&P 500, the chart would look like this instead'
		let anno5 = 'S&P 500 companies spent $39.5m in total in 2014. But a handful were a lot more generous with free flights than the others'
		let anno6 = 'The top 10 companies — or the top 2 per cent — accounted for a quarter of all spending in 2014. Many of these are companies where the founder or their family still exert control'
		let anno7 = 'The top 50 companies — or the top 11 per cent — accounted for two-thirds of the total'
		let anno8 = 'Corporate governance experts say high personal jet spending is a sign of a weak board and too powerful executives, and could be a harbinger of other problems'

		let annotations = [anno0, anno1, anno2, anno3, anno4, anno5, anno6, anno7, anno8];


	//needed for animation
		let storyState = 0;
		let maxState = annotations.length;

//Animations
		let animations = [
			function(){
				changeAnno(anno1);
				d3.select('#Freeport-McMoRan').attr('class','circles.highlight').attr('r','5');
				d3.select('#backButton[disabled]').attr('disabled', null);

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
				d3.select('rect.secLine').style('opacity','0.3');
			},
			function(){
				changeAnno(anno4);
				d3.select('#Kansas_City_Southern').attr('class','circles').attr('r','2');
				rescaleX(465);
			},
			function(){
				changeAnno(anno5);
				d3.select('.secLine').style('opacity','0');
				rescaleY();
				d3.selectAll('circle').transition().delay(function(d, i) {
				    return i * 10;
			  	})
		        	.attr({
		            'cx': function(d) { return dotxScale(d[4]) },
		            'cy': function(d) { return (d[5]*10)-40 },
		        });
		        d3.select('.chart-subtitle').html("% of $39.5m total spending in 2014")

			},
			function(){
				changeAnno(anno6);
				drawCumulativeDots(0,10);
			},
			function(){
				changeAnno(anno7);
				drawCumulativeDots(10,50);
			},

			function(){
				changeAnno(anno8);
				drawCumulativeDots(50,data.coords.length)
				d3.select('#forwardButton').attr('disabled','disabled');
			}
		]

		let backAnimations = [
			function() {},
			function() {
				changeAnno(anno0); 
				d3.select('#Freeport-McMoRan').attr('class','circles').attr('r','2');
				d3.select('#backButton').attr('disabled', 'disabled');
			},
			function() {
				changeAnno(anno1);
				d3.select('#Freeport-McMoRan').attr('class','circles.highlight').attr('r','5');
				d3.select('#Morgan_Stanley').attr('class','circles').attr('r', '2');
			},
			function() {
				changeAnno(anno2)
				d3.select('#Morgan_Stanley').attr('class','circles.highlight').attr('r','5');
				d3.select('#Kansas_City_Southern').attr('class','circles').attr('r','2');
				d3.select('rect.secLine').style('opacity','0');
			},
			function() {
				changeAnno(anno3);
				rescaleX(173);
				d3.select('#Kansas_City_Southern').attr('class','circles.highlight').attr('r','5');
			},
			function() {
				changeAnno(anno4);
				d3.select('.curvatureLine').remove();
			},
			function() {
				changeAnno(anno5);
				d3.select('.curvatureLine').style('opacity','1');
				d3.select('.secLine').style('opacity','0.3');
				d3.selectAll('.circles').remove();
				d3.select('.cumulativeRect').remove();
				resetYScale();
				drawCircles();
			},
			function() {
				changeAnno(anno6);
			},
			function() {changeAnno(anno7)},
			function() {changeAnno(anno8)},
		]

		console.log(data.coords[10])

		let dotSize = 4
		let dotsInRow = Math.floor( plotWidth / dotSize)

		let dotPos  = data.coords.map(function(d,i){
						return {
							dotRowX: (i % dotsInRow),
							dotRowY: Math.floor( i/dotsInRow )
						}
					});



		data.coords.forEach(function (d,i) {
	  		d.push(dotPos[i].dotRowX, dotPos[i].dotRowY);
		});



	//functions used to step through the viz
		function swipeForward() {
			if (storyState < 0) {

			} else if (storyState == maxState) {

			} else {
				animations[storyState]();
				slideCount.html(storyState+2)
				return storyState=storyState+1;
			}
			console.log(storyState)
		}

		function swipeBack() {	
			if (storyState > maxState) {

			} else if (storyState == 0) {

			} else {
				console.log(storyState);
				backAnimations[storyState]();
				slideCount.html(storyState)
				storyState-=1;
				return storyState;
			}
		}

		function changeAnno (newAnno) {
			d3.select(".annotation")
			  .html(newAnno)
		}

		function rescaleX(newDomainMax) {
            xScale.domain([0,newDomainMax])
            svg.select('.xAxis')
	            .transition().duration(1500).ease('sin-in-out')
	            .call(xAxis);
			d3.selectAll('.circles')
				.transition().duration(1500).ease('sin-in-out')
				.attr('cx', function(d) { return xScale(d[0])})
		}

		function rescaleY() {
			yScale.domain(data.y1Domain)
            svg.select('.yAxis')
	            .transition().duration(1500).ease('sin')
	            .call(yAxis);
		}
		function resetYScale() {
			yScale.domain(data.yDomain)
			svg.select('.yAxis')
				.call(yAxis);
		}

        //function to incrementally draw the cumulative dots

        function drawCumulativeDots(start,end) {

			plot.selectAll('circle')
				.filter(function (d,i){
					return i >= start && i < end;
				})
		        .transition().delay(function(d, i) {
				    return i * 50;
			  	})
	            .attr({
	                'cx': function(d) { return xScale(d[0]) },
	                'cy': function(d) { return yScale(d[3]) },
	            })
        }

	    //set up the scale we will use for plotting our scatter plot
	    var xScale = d3.scale.linear()
	        .domain(data.xDomain)
	        .range([0, width-(margin.left+margin.right)]);

	    var yScale = d3.scale.linear()
		    .domain(data.yDomain)
		    .range([height-(margin.top+margin.bottom),0]);

		var dotxScale = d3.scale.linear()
			.domain([0,dotsInRow])
			.range([0, width-(margin.left+margin.right)]);
   
	    //define axes based on the scale
	    var xAxis = d3.svg.axis()
	        .scale(xScale)
	        .orient('bottom');

	    var yAxis = d3.svg.axis()
		    .scale(yScale)
		    .orient('left')
		    .tickSize(-plotWidth, 0)

		//navigational buttons

		var slideCount = d3.select('#currentSlide')
			.html(storyState+1);

		var slideTotal = d3.select('#totalSlide')
			.html(annotations.length);

		d3.select("#forwardButton").on("click", function(){
			swipeForward();
		});

		d3.select("#backButton")
			.attr('disabled', 'disabled')
			.on("click",function(){
				swipeBack();
		});
	    
	    //set up document structure

	    parent.append('span')
			.attr('y',20)
			.attr('class','chart-title')
			.html(title);
	    
	    parent.append('span')
			.attr('y',40)
			.attr('class','chart-subtitle')
			.html(subtitle);

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

		svg.append('g')
			.attr({
				'class': 'dot-holder',
                'transform':'translate('+ margin.left +',20)',
			})

	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-15;
	            },
	            'x':function(){
	            	return width/2;
	            },
	            'class':'chart-xaxis-label-middle',
	            'text-anchor':'middle'
	        })
	        .text('Rank by spending');

	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-15;
	            },
	            'x':function(){
	            	return margin.left;
	            },
	            'class':'chart-xaxis-label',
	            'text-anchor':'start'
	        })
	        .text('◄ More generous');	

	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-15;
	            },
	            'x':function(){
	            	return margin.left + plotWidth;
	            },
	            'class':'chart-xaxis-label',
	            'text-anchor':'end'
	        })
	        .text('Less generous ►');			

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

	    var drawCircles = function() {plot.selectAll('circle')
		        .data(data.coords)
		        .enter()
		        .append('circle')
		        .attr({
		            'class':'circles',
		            'cx': function(d) { return xScale(d[0]) },
		            'cy': function(d) { return yScale(d[1]) },
		            'r': circleSize,
		            'id': function(d) { return d[2] },
		            'fill': 'purple',
		            'opacity': '0.9'
		        });
		    };
		drawCircles()

	// Draw shaded area showing SEC disclosure threshold
		d3.select('g#plot').append('rect')
			.attr({
				'class':'secLine',
				'x':0,
				'y':function(){ return yScale(0.025)},
				'width':plotWidth,
				'height':function(){ return plotHeight-yScale(0.025)},
			})

		//Set annotation to initial annotation
		changeAnno(anno0);

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
