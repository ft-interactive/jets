// simple module
export default function (data) {

	let coords = [];

	data.forEach(function (d) {
	  coords.push([d.x, d.y, d.name]);
	});

	// setup x and y arrays to find range
	let x = [];
	let y = [];

	data.forEach(function (d) {
	  x.push(d.x);
	  y.push(d.y);
	});

	// establish data domain
	x = x.sort(sortFunction);
	let xDomain = [x[0], x[x.length - 1]];

	y = y.sort(sortFunction);
	let yDomain = [0, y[y.length - 1]];

	let processedData = {
		coords: coords,
		xDomain: xDomain,
		yDomain: yDomain
	};

	return processedData;
}

function sortFunction(a, b) {
  return a - b;
}
