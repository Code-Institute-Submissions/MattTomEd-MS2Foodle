function readyDocument() {
	console.log("Ready");
}
$(document).ready(readyDocument);

function replaceCommasSpaces(string) {
	replaced = string.replace(/,/g, '%2C').replace(/ /g, '%20');
	return replaced
}

function processCheckbox(check) {

	var checkboxArr = [];
	$(check).children('input[type=checkbox]').each(function () {
		if ((this).checked) {
			checkboxArr.push(this.labels[0].textContent);
		}
	});
	checkboxString = checkboxArr.toString();
	checkboxString = replaceCommasSpaces(checkboxString);
	return checkboxString
}

function compileUrl() {
	cuisine = processCheckbox($("#cuisine"))
	intolerances = processCheckbox($("#intolerance"))
	diet = replaceCommasSpaces($("#diet").val());
	query = replaceCommasSpaces($("#query-include").val());
	excludeIngredients = replaceCommasSpaces($("#query-exclude").val());
	type = replaceCommasSpaces($("#dish-type").val());
	url = `search?query=${query}&diet=${diet}&excludeIngredients=${excludeIngredients}&intolerances=${intolerances}&number=10&offset=0&type=${type}&cuisine=${cuisine}`
	return url
}

function executeSearch(cb) {
	const settings = {
		"async": true,
		"crossDomain": true,
		"error": function (xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
			alert('Error - ' + errorMessage);
		},
		"url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${compileUrl(cb)}`,
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "f51cb857c1mshe4a2ebcb218aee9p158115jsn9122b44a255a",
			"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
		}
	};

	// If request is successful
	$.ajax(settings).done(function (response) {
		recipeArray = response.results;
		console.log(response);
		console.log(recipeArray);
		$("#query-placeholder").replaceWith("<table id='results-table'></table>");
		$("#results-table tr").remove();

		$.each(recipeArray, function (index, recipe) {
			$("#results-table").append(
				$('<tr>').append(
					$('<td>').text(this.title),
					$('<td>').text(this.readyInMinutes),
					$('<td>').text(this.servings)
			));
		});


	});



}