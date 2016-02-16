//simple module
export default function(){
	let welcomeText = 'hiya!';

	function chart(parent){
		parent.append('p').text(welcomeText);
	}

	chart.text = function(text){
		welcomeText = text;
		return chart;
	}

	return chart;
}