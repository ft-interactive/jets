import d3 from 'd3';
import scatterPlot from './scatter-plot';
import dataProcessor from './scatter-data-processor';

const dataLocation = 'data/jetscatter.csv';

function dataLoaded(error, data) {

    let div = document.getElementById('scatter');
    let rect = div.getBoundingClientRect();
    let viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)

	let processedData = dataProcessor(data);
    let jetSpendingScatter = scatterPlot();

    jetSpendingScatter
    	.data(processedData)
    	.title('Spending on jet perks by S&P 500 companies')
    	.subtitle('$m, 2014')
    	.source('Source: Securities and Exchange Commission')
    	.circleSize(3.5)
    	.height(400)
    	.width(rect.width)
        .viewportW(viewportW)
    	.margin({
		    top:50,
		    left:25,
		    bottom:70,
		    right:15
		});

	d3.select('#scatter')
		.call(jetSpendingScatter);
}

d3.csv(dataLocation, dataLoaded);

