// simple module
export default function (data) {

	let coords = data.map(function (d) {
	  return [d.x, d.y, d.name.replace(/ /g,"_"), d.y1];
	});

	// setup x and y arrays to find range
	let x = [];
	let y = [];
	let y1 = [];

	data.forEach(function (d) {
	  x.push(d.x);
	  y.push(d.y);
	  y1.push(d.y1);
	});

	let curvLine =[];

	data.forEach(function (d){
		curvLine.push({x:d.x, y:d.y})
	});

	// establish data domain
	x = x.sort(sortFunction);
	let xDomain = [x[0], x[x.length - 1]];

	y = y.sort(sortFunction);
	let yDomain = [0, y[y.length - 1]];

	y1 = y1.sort(sortFunction);
	let y1Domain = [0, y1[y1.length - 1]];

	let processedData = {
		coords: coords,
		curvLine: curvLine,
		xDomain: xDomain,
		yDomain: yDomain,
		y1Domain: y1Domain
	};

	return processedData;

}

function sortFunction(a, b) {
  return a - b;
}
