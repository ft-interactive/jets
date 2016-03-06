//scatter plot

import d3 from 'd3';

export default function(){

	let title = 'Title';
	let subtitle = 'Subtitle';
	let source = 'Source';
	let data = [];
	let circleSize = 2;
	let viewportW = undefined;

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


// Annotation texts
		let anno0 = 'We ranked each of the S&P 500 companies according to how much they spent giving free personal flights on the company plane to their executives'
		let anno1 = 'The large dot represents Freeport-McMoRan, the mining company that spent $1.2m, the most in 2014'
		let anno2 = 'This is Morgan Stanley, and the $240,000 it paid for a single emergency round trip flight to Australia for James Gorman, its chairman and chief executive'
		let anno3 = 'Kansas City Southern is just above the SEC\'s disclosure minimum. Companies do not have to report the value of perks worth less than $25,000 a year'
		let anno4 = '173 companies disclosed jet perks in 2014. If you include all the 465 companies we looked at in the S&P 500, the chart would look like this instead'
		let anno5 = 'S&P 500 companies spent $39.5m in total in 2014. But a handful were a lot more generous with free flights than the others'
		let anno6 = 'The top 10 companies, or the top 2 per cent, accounted for a quarter of all spending in 2014. Many of these are companies where the founder or their family still exert control'
		let anno7 = 'The top 50 companies, or the top 11 per cent, accounted for two-thirds of the total'
		let anno8 = 'Corporate governance experts say high personal jet spending is a sign of a weak board and too powerful executives, and could be a harbinger of other problems'

		let annotations = [anno0, anno1, anno2, anno3, anno4, anno5, anno6, anno7, anno8];


	//needed for animation
		let storyState = 0;
		let maxState = annotations.length;

//Animations
		let animations = [
			function(){
				changeAnno(anno1);
				d3.selectAll('circle').style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
				})
				d3.select('#Freeport-McMoRan')
					.attr('r','7')
					.style({
						'fill':'#9e2f50',
						'fill-opacity':'1',
						'stroke':'rgba(187, 109, 130, 0.5)',
						'opacity':'1',
						'stroke-width':'12px'
					});

				d3.select('#backButton[disabled]').attr('disabled', null);

			},
			function(){
				changeAnno(anno2);
				d3.select('#Freeport-McMoRan').attr('r','3.5')
				.style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
				});
				d3.select('#Morgan_Stanley')
					.attr('r','7')
					.style({
						'fill':'#9e2f50',
						'fill-opacity':'1',
						'stroke':'rgba(187, 109, 130, 0.5)',
						'opacity':'1',
						'stroke-width':'12px'
					});
			},
			function(){
				changeAnno(anno3);
				d3.select('#Morgan_Stanley').attr('r','3.5')
				.style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
				});
				d3.select('#Kansas_City_Southern')
					.attr('r','7')
					.style({
						'fill':'#9e2f50',
						'fill-opacity':'1',
						'stroke':'rgba(187, 109, 130, 0.5)',
						'opacity':'1',
						'stroke-width':'12px'
					});
				d3.select('.secLine').style('opacity','1');
				plot.append('text')
					.text('MINIMUM FOR DISCLOSURE')
					.attr({
						'class':'secLine-text',
						'x':'0',
						'y':function(){ return yScale(0.025)},
						'dx':'2px',
						'dy':'-5px'
					})
			},
			function(){
				changeAnno(anno4);
				d3.select('.secLine-text').style('opacity','0')
				d3.select('#Kansas_City_Southern')
					.attr('r','3.5')
					.style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
					})
				rescaleX(465);
				d3.selectAll('.o-buttons__group button').attr('disabled', 'disabled');
				d3.selectAll('.o-buttons__group button').transition().duration(0).delay(1500).attr('disabled', null);
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
				d3.selectAll('.o-buttons__group button').attr('disabled', 'disabled');
				d3.selectAll('.o-buttons__group button').transition().duration(0).delay(1720).attr('disabled', null);
		        d3.select('.chart-subtitle').html("% of total spending in 2014")

			},
			function(){
				changeAnno(anno6);
				drawCumulativeDots(0,10,75);
				d3.selectAll('.o-buttons__group button').attr('disabled', 'disabled');
				d3.selectAll('.o-buttons__group button').transition().duration(0).delay(675).attr('disabled', null);
			},
			function(){
				changeAnno(anno7);
				drawCumulativeDots(10,50,50);
				d3.selectAll('.o-buttons__group button').attr('disabled', 'disabled');
				d3.selectAll('.o-buttons__group button').transition().duration(0).delay(1950).attr('disabled', null);
			},

			function(){
				changeAnno(anno8);
				drawCumulativeDots(50,data.coords.length,20)
				d3.selectAll('.o-buttons__group button').attr('disabled', 'disabled');
				d3.select('#backButton').transition().duration(0).delay(1950).attr('disabled',null);
			}
		]

		let backAnimations = [
			function() {},
			function() {
				changeAnno(anno0); 
				d3.selectAll('circle').style({
					'fill':'#9e2f50',
					'fill-opacity':'0.5',
					'stroke':'#9e2f50',
					'stroke-width': '0.5px'
				})
				d3.select('#Freeport-McMoRan').attr('r','3.5')
				d3.select('#backButton').attr('disabled', 'disabled');
			},
			function() {
				changeAnno(anno1);
				d3.select('#Freeport-McMoRan')
					.attr('r','7')
					.style({
						'fill':'#9e2f50',
						'fill-opacity':'1',
						'stroke':'rgba(187, 109, 130, 0.5)',
						'opacity':'1',
						'stroke-width':'12px'
					});
				d3.select('#Morgan_Stanley').attr('r','3.5')
				.style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
				});
			},
			function() {
				changeAnno(anno2)
				d3.select('#Morgan_Stanley')
					.attr('r','7')
					.style({
						'fill':'#9e2f50',
						'fill-opacity':'1',
						'stroke':'rgba(187, 109, 130, 0.5)',
						'opacity':'1',
						'stroke-width':'12px'
					});
				d3.select('#Kansas_City_Southern').attr('r','3.5')
				.style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
				});
				d3.select('.secLine-text').style('opacity','0');
				d3.select('.secLine').style('opacity','0');
			},
			function() {
				changeAnno(anno3);
				rescaleX(173);
				d3.select('#Kansas_City_Southern')
					.transition().delay(1500)
					.attr('r','7')
					.style({
						'fill':'#9e2f50',
						'fill-opacity':'1',
						'stroke':'rgba(187, 109, 130, 0.5)',
						'opacity':'1',
						'stroke-width':'12px'
					});
				d3.select('.secLine-text')
					.transition().delay(1500)
					.style('opacity','1');
				d3.selectAll('.o-buttons__group button').attr('disabled', 'disabled');
				d3.selectAll('.o-buttons__group button').transition().duration(0).delay(1500).attr('disabled', null);
			},
			function() {
				changeAnno(anno4);
				d3.select('.secLine').style('opacity','1');
				resetYScale();
				d3.selectAll('.circles').remove();
				drawCircles();
				d3.selectAll('circle').style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
				})
				d3.select('.chart-subtitle').html('$m, 2014')
			},
			function() {
				changeAnno(anno5);
				moveDotsBackUp(0,10);
			},
			function() {
				changeAnno(anno6);
				moveDotsBackUp(10,50);
			},
			function() {
				changeAnno(anno7);
				moveDotsBackUp(50,data.coords.length)
				d3.select('#forwardButton').attr('disabled', null);
			},
			function() {changeAnno(anno8)},
		]

		//new coords for slides 7-9

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

		// if not mobile size i.e. viewportW > 800

		if (viewportW > 800) {
			height = 500;
			d3.select('.annotation').style('display','block');
			d3.select('.mobile-annotations').style('display','none')
			d3.select('.slideCounter').remove()
			d3.select('.panel').insert('span','.annotation')
				.attr('class','slideCounter')
			let slideCounter = d3.select('.slideCounter');
			slideCounter.append('span')
				.attr({
					'class':'slideCounter-number',
					'id':'currentSlide'
				})
			slideCounter.append('text').text(' of ')
			slideCounter.append('span')
				.attr({
					'class':'slideCounter-number',
					'id':'totalSlide'
				});
			d3.select('.panel').style({
				'position':'absolute',
				'top':'130px',
				'right':'5%'

			})
	       }

		let plotHeight = height - (margin.top + margin.bottom);		

console.log(viewportW)
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
			  .html(newAnno);
			d3.select(".mobile-annotations")
				.html(newAnno);

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

        function drawCumulativeDots(start,end,speed) {

			plot.selectAll('circle')
				.filter(function (d,i){
					return i >= start && i < end;
				})
		        .transition().delay(function(d, i) {
		        	console.log(i*speed)
				    return i * speed;
			  	})
	            .attr({
	                'cx': function(d) { return xScale(d[0]) },
	                'cy': function(d) { return yScale(d[3]) },
	            })
	            .style({
	            	'fill':'#9e2f50',
	            	'stroke':'#9e2f50',
	            	'stroke-width':'0.5px',
	            	'fill-opacity':'0.5'
	            })
        }

        //function to move dots back up to the panel at the top
        function moveDotsBackUp(start,end) {

			plot.selectAll('circle')
				.filter(function (d,i){
					return i >= start && i < end;
				})
		        .attr({
		            'cx': function(d) { return dotxScale(d[4]) },
		            'cy': function(d) { return (d[5]*10)-40 },
		        })
	            .style({
					'stroke':'#333333',
					'stroke-width':'0.5px',
					'fill':'#333333',
					'fill-opacity':'0.2'
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

	    parent.insert('span',':first-child')
			.attr('y',20)
			.attr('class','chart-title')
			.html(title);
	    
	    parent.insert('span',':nth-child(2)')
			.attr('y',40)
			.attr('class','chart-subtitle')
			.html(subtitle);

console.log(viewportW < 800)

		var svg = d3.select('.chart-holder').append('svg')
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
//rank by spending
	    d3.select('svg').append('text')
	        .attr({
	            'y':function(){
	                return height-20;
	            },
	            'x':function(){
	            	return width/2;
	            },
	            'class':'chart-xaxis-label-middle',
	            'text-anchor':'middle'
	        })
	        .text('Rank by spending');
//more generous
	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-15;
	            },
	            'x':function(){
	            	return margin.left;
	            },
	            'class':'chart-xaxis-label-left-arrow',
	            'text-anchor':'start'
	        })
	        .text('◀︎ ')
	    	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-25;
	            },
	            'x':function(){
	            	return margin.left+15;
	            },
	            'class':'chart-xaxis-label-left',
	            'text-anchor':'start'
	        })
	        .text('More')

	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-10;
	            },
	            'x':function(){
	            	return margin.left+15;
	            },
	            'class':'chart-xaxis-label-left',
	            'text-anchor':'start'
	        })
	        .text('generous')

//less generous
	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-25;
	            },
	            'x':function(){
	            	return margin.left + plotWidth - 15;
	            },
	            'class':'chart-xaxis-label-right',
	            'text-anchor':'end'
	        })
	        .text('Less');
	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-10;
	            },
	            'x':function(){
	            	return margin.left + plotWidth -15;
	            },
	            'class':'chart-xaxis-label-right',
	            'text-anchor':'end'
	        })
	        .text('generous');
	    svg.append('text')
	        .attr({
	            'y':function(){
	                return height-15;
	            },
	            'x':function(){
	            	return margin.left + plotWidth;
	            },
	            'class':'chart-xaxis-label-right-arrow',
	            'text-anchor':'end'
	        })
	        .text('►');		

//if desktop
	if (viewportW > 800) {
			d3.selectAll('.chart-xaxis-label-left')
	        .attr({
	            'x':function(){
	            	return margin.left+20;
	            }
	        });
			d3.selectAll('.chart-xaxis-label-right')
	        .attr({
	            'x':function(){
	            	return margin.left + plotWidth -25;
	            }
	        })
	}
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
		        });
		    };
		drawCircles()

	// Draw shaded area showing SEC disclosure threshold
		d3.select('g#plot').append('line')
			.attr({
				'class':'secLine',
				'x1':0,
				'y1':function(){ return yScale(0.025)},
				'x2':plotWidth,
				'y2':function(){ return yScale(0.025)},
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

	chart.viewportW = function(x){
		viewportW = x;
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
