function readyDocument() {
	console.log("Ready");
}
$(document).ready(readyDocument);

// Remove grammar from
function replaceCommasSpaces(string) {
	replaced = string.replace(/,/g, '%2C').replace(/ /g, '%20');
	return replaced
}

// Iterate over selected checkboxes
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

// Use search info to compile URL for API
function compileUrl() {
	cuisine = processCheckbox($("#cuisine"))
	intolerances = processCheckbox($("#intolerance"))
	diet = replaceCommasSpaces($("#diet").val());
	query = replaceCommasSpaces($("#query-include").val());
	excludeIngredients = replaceCommasSpaces($("#query-exclude").val());
	type = replaceCommasSpaces($("#dish-type").val());
	url = `search?query=${query}&diet=${diet}&excludeIngredients=${excludeIngredients}&intolerances=${intolerances}&number=200&offset=0&type=${type}&cuisine=${cuisine}`
	return url
}

// display food summary by ID, selected by button on list

function displayFoodSummary(id) {

// BLOCK TO AVOID API CHARGE FOR NOW

//	const settings = {
//		"async": true,
//		"crossDomain": true,
//		// Error message
//		"error": function (xhr, status, error) {
//			var errorMessage = xhr.status + ': ' + xhr.statusText
//			alert('Error - ' + errorMessage);
//		},
//		"url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
//		"method": "GET",
//		"headers": {
//			"x-rapidapi-key": "f51cb857c1mshe4a2ebcb218aee9p158115jsn9122b44a255a",
//			"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
//		}
//	};
//
	// If request is successful, display summary
//	$.ajax(settings).done(function (response) {
//		console.log(response);
//	});
	console.log("Button has been clicked for ID number " + id);
}

// Search and retrieve data
function executeSearch(cb) {
	const settings = {
		"async": true,
		"crossDomain": true,
		// Error message
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

	// If request is successful, conduct a search
	$.ajax(settings).done(function (response) {

		// log response before splitting array
		console.log(response)

		// Break data into array chunks of 10 for pagination
		recipeArray = _.chunk(response.results, 10)
		console.log(recipeArray);

		// pages info
		pageNumber = 1;
		maxPages = recipeArray.length;

		console.log("current page: " + pageNumber)
		console.log("max pages: " + maxPages)

		// remove previous pagination
		$("#search-next").remove();
		$("#search-prev").remove();

		// display data
		displayData(pageNumber);

		// Create pagination if needed
		if (maxPages > 1) {
			$("#results-area").append(`<button type="submit" id="search-next" class="btn btn-secondary btn-lg"
			onclick="nextPage(pageNumber)">Next</button>`)
			console.log("SHOW NEXT");
			$("#results-area").append(`<button type="submit" id="search-prev" class="btn btn-secondary btn-lg"
			onclick="prevPage(pageNumber)">Previous</button>`);
			$("#search-prev").hide();
			console.log("HIDE PREV");
		} else {
			console.log("NO PAGINATION")
		}

	});

}

function displayData(page) {
	// Get first batch of results
	displayArray = _.nth(recipeArray, page - 1);
	console.log(displayArray);
	// remove existing search data
	removeSearchData();
	// Print the data
	printData(displayArray);
}

function printData(array) {
	$.each(array, function (index, recipe) {
		foodIdString = this.id;
		foodIdString = foodIdString.toString();
		foodId = "displayFoodSummary(" + this.id + ")";
		console.log("ID is "+ foodIdString)
		$("#results-table").append(
			$('<tr class="table-primary table-hover">').append(
				$('<td class="table-primary table-hover">').text(this.title),
				$('<td class="table-primary table-hover">').text(this.readyInMinutes),
				$('<td class="table-primary table-hover">').text(this.servings),
				$('<td class="table-primary table-hover">').append(`<button type="submit" id="display-summary" class="btn btn-secondary"
				onclick="${foodId}">See recipe</button>`)
			));
	});
}

function removeSearchData() {
	// remove existing search data
	$("#query-placeholder").replaceWith("<table class='table-primary table-hover' id='results-table'></table>");
	$("#results-table tr").remove();
}

function nextPage(page) {

	pageNumber = incrementPage(page);
	displayData(pageNumber);
	console.log("Page number is " + pageNumber)
	switch (true) {
		case pageNumber === maxPages:
			$("#search-next").hide();
			console.log("HIDE NEXT");
			break;
		case pageNumber < maxPages:
			$("#search-next").show();
			$("#search-prev").show();
			console.log("SHOW NEXT AND PREV");
			break;
	}
}

function prevPage(page) {

	pageNumber = decrementPage(page);
	displayData(pageNumber);
	console.log("Page number is " + pageNumber)
	switch (true) {
		case pageNumber > 1:
			$("#search-next").show();
			$("#search-prev").show();
			console.log("SHOW NEXT AND PREV");
			break;
		case pageNumber < 2:
			$("#search-prev").hide();
			console.log("HIDE PREV");
			break;
	}
}

function incrementPage(pageNumber) {
	++pageNumber;
	return pageNumber;
}

function decrementPage(pageNumber) {
	--pageNumber;
	return pageNumber;
}