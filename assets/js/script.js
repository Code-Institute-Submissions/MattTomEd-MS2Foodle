//
$(document).ready(readyDocument);

function readyDocument() {
	$("#intolerance").hide();
	$("#cuisine").hide();
	$("#contact-form").hide();
	$("#intolerance-reveal").click(function () {
		$("#intolerance").toggle(500);
	});
	$("#cuisine-reveal").click(function () {
		$("#cuisine").toggle(500);
	});
	$("#contact-reveal").click(function () {
		$("#contact-form").toggle(500);
		$("#contact-reveal").hide();
	});
	let pageNumber = 1;
	sessionStorage.setItem("pageNumber", JSON.stringify(pageNumber));
	for (let i = 0; i < 5; i++) {
		checkPreviousSearchList(localStorage.key(i));
	}
}
// Create a list of recent recipes stored in localstorage
function checkPreviousSearchList(keyNumber) {
	let result = localStorage.getItem(keyNumber);
	if (result != null) {
		result = JSON.parse(result);
		$("#previous-search-area").prepend(
			`<li id="${result.id}" class="text-center justify-content-center"><a class="subtitle-light" onclick="callPreviousSearchResult(${result.id})">${result.title}</a></li>`
		);
		if ($('#previous-search-area li').length > 5) {
			let keyToRemove = $('#previous-search-area li').last().attr("id");
			localStorage.removeItem(keyToRemove);
			$('#previous-search-area li').last().remove();
		}
	}
}
// Generate summary of a previous result, and positions the result as the most recently clicked item
function callPreviousSearchResult(id) {
	let keyToRemove = $(`#previous-search-area #${id}`).first();
	localStorage.removeItem(keyToRemove);
	keyToRemove.remove();
	generateSummary(JSON.parse(localStorage.getItem(id)));
}
// Iterate over selected checkboxes
function processCheckbox(check) {
	var checkboxArr = [];
	$(check).children('input[type=checkbox]').each(function () {
		if ((this).checked) {
			checkboxArr.push(this.labels[0].textContent);
		}
	});
	let checkboxString = checkboxArr.toString();
	checkboxString = replaceCommasSpaces(checkboxString);
	return checkboxString;
}
// Remove grammar from a string for URL use
function replaceCommasSpaces(string) {
	let replaced = string.replace(/,/g, '%2C').replace(/ /g, '%20');
	return replaced;
}
// Use search info to compile URL for API
function compileUrl() {
	let cuisine = processCheckbox($("#cuisine"));
	let intolerances = processCheckbox($("#intolerance"));
	let diet = replaceCommasSpaces($("#diet").val());
	let query = replaceCommasSpaces($("#query-include").val());
	let excludeIngredients = replaceCommasSpaces($("#query-exclude").val());
	let type = replaceCommasSpaces($("#dish-type").val());
	// number of results throttled to 50 to allow for API call budget
	let url = `search?query=${query}&diet=${diet}&excludeIngredients=${excludeIngredients}&intolerances=${intolerances}&number=50&offset=0&type=${type}&cuisine=${cuisine}`;
	return url;
}
// Display food summary by ID, selected by button on list
function displayFoodSummary(id) {
	const settings = {
		"async": true,
		"crossDomain": true,
		// Error message
		"error": function (xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText;
			alert('Error - ' + errorMessage);
		},
		"url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "f51cb857c1mshe4a2ebcb218aee9p158115jsn9122b44a255a",
			"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
		}
	};
	// If request is successful, display summary
	$.ajax(settings).done(function (response) {
		generateSummary(response);
	});
}
// Search and retrieve data
function executeSearch(cb) {
	const settings = {
		"async": true,
		"crossDomain": true,
		// Error message
		"error": function (xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText;
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
		// Break data into array chunks of 5 for pagination
		let recipeArray = _.chunk(response.results, 5);
		sessionStorage.setItem("recipeArray", JSON.stringify(recipeArray))
		let pageNumber = 1;
		sessionStorage.setItem("pageNumber", JSON.stringify(pageNumber))
		// Max pages info for pagination
		let maxPages = recipeArray.length;
		// Remove previous pagination if user searches again w/o without clearing
		$("#search-next").remove();
		$("#search-prev").remove();
		$("#reset-search").remove();
		// Logic for a search without recipes
		if (recipeArray.length === 0) {
			$("#results-area").append(`<h2 id="no-results" class="text-center previous-search-container">Sorry, we couldn't find any recipes!</h2>`);
			$("#results-area").append(`<div class="row" id="reset-search"><div class="col d-flex justify-content-center"><button type="submit" id="reset-search" class="btn btn-secondary btn-lg subtitle"
			onclick="resetSearch()">Reset search</button></div></div>`);
		} else {
			// Display data
			displayData();
			// Create pagination if needed
			createPagination(maxPages);
			// Save search list to sessionstorage 
			sessionStorage.setItem("recipeArray", JSON.stringify(recipeArray));
		}
	});
	return false;
}
// Create pagination when table data is organised
function createPagination(maxPages) {
	if (maxPages > 1) {
		$("#results-area").append(`<button type="submit" id="search-next" class="btn btn-secondary btn-lg"
	onclick="nextPage(${maxPages})">Next</button>`);
		$("#results-area").append(`<button type="submit" id="search-prev" class="btn btn-secondary btn-lg"
	onclick="prevPage()">Previous</button>`);
		$("#search-prev").hide();
		$("#results-area").append(`<div class="row" id="reset-search"><div class="col d-flex justify-content-center"><button type="submit" id="reset-search" class="btn btn-secondary btn-lg subtitle"
	onclick="resetSearch()">Reset search</button></div></div>`);
	} else {
		$("#results-area").append(`<div class="row" id="reset-search"><div class="col d-flex justify-content-center"><button type="submit" id="reset-search" class="btn btn-secondary btn-lg subtitle"
	onclick="resetSearch()">Reset search</button></div></div>`);
	}
}
// Generate recipe summary
function generateSummary(response) {
	// Hide next and prev buttons
	$("#search-next").hide();
	$("#search-prev").hide();
	// Store result as a string in localstorage
	localStorage.setItem(JSON.stringify(response.id), JSON.stringify(response));
	checkPreviousSearchList(JSON.stringify(response.id));
	// Remove existing data and placeholder if user manually enters URL (if bookmarked..?)
	$("#recipe-summary").replaceWith(`<table class="table table-dark table-hover" id="results-table"><thead id="results-table-head"></thead><tbody id="results-table-body"></tbody></table>`);
	$("#query-placeholder").replaceWith(`<table class="table table-dark table-hover" id="results-table"><theadid="results-table-head"></thead><tbody id="results-table-body"></tbody></table>`);
	// Get recipe info from response
	getRecipeInfo(response);
	// check if the button should reset the search or return to the current query by checking for the existence of pagination
	if (Boolean($("#search-next").length) === true) {
		$("#button-row").append(`<div class="col-6 text-end"><button id="back-to-search" onclick="displayData()" class="btn btn-secondary btn-lg">Go back</button></a></div>`);
	} else {
		$("#button-row").append(`<div class="col-6 text-end"><button id="back-to-search" onclick="resetSearch()" class="btn btn-secondary btn-lg">Close</button></a></div>`);
	}
	$("#button-row").append(`<div class="row py-3"></div>`);
}
// get recipe info from an API response
function getRecipeInfo(response) {
	// Generate info in a div
	$("#results-table").replaceWith(`<div id="recipe-summary"></div>`);
	// Generate title and subtitle
	$("#recipe-summary").append('<div class="row" id="title-row">');
	$("#title-row").append(`<div><h2 class="recipe-title-text text-center justify-content-center">${response.title}</h2><h4 class="subtitle-light text-center justify-content-center">A recipe from ${response.sourceName}</h3></div><div class="row py-3"></div>`);
	// Check if information can be gained from API call for servings and minutes
	if (response.readyInMinutes != undefined) {
		$("#title-row").append(`<div><h5 class="subtitle-light">Takes ${convertTime(response.readyInMinutes)} to cook</h5></div>`);
	} else {
		$("#title-row").append(`<div><h5 class="subtitle-light">Unknown preparation time</h5></div>`);
	}
	if (response.servings != undefined) {
		$("#title-row").append(`<div><h5 class="subtitle-light">Makes ${response.servings} servings</h5></div>`);
	} else {
		$("#title-row").append(`<div><h5 class="subtitle-light">Unknown number of servings</h5></div>`);
	}
	// Create quick info buttons for allergens and meal suggestions
	$("#recipe-summary").append(`<div id="allergen-row"></div>`);
	$("#recipe-summary").append(`<div id="meal-row"></div>`);
	if (response.vegetarian === true) {
		$("#allergen-row").append(`<div class="recipe-icon" id="icon-vegetarian">Vegetarian</div>`);
	}
	if (response.vegan === true) {
		$("#allergen-row").append(`<div class="recipe-icon" id="icon-vegan">Vegan</div>`);
	}
	if (response.glutenFree === true) {
		$("#allergen-row").append(`<div class="recipe-icon" id="icon-gluten-free">Gluten free</div>`);
	}
	if (response.dairyFree === true) {
		$("#allergen-row").append(`<div class="recipe-icon" id="icon-dairy-free">Dairy free</div>`);
	}
	$.each(response.dishTypes, function (index, recipe) {
		$("#meal-row").append(`<div class="recipe-icon" id="dish-types">${recipe}</div>`);
	});
	// Logic to check if an image has been provided
	$("#recipe-summary").append('<div class="row justify-content-centre" id="image-row"></div><div class="row py-3"></div>');
	if (response.image != undefined) {
		$("#image-row").append(`<div class="col-12 col-md-5"><img id="recipe-image" class="img-fluid" src="${response.image}"/></div>`);
	} else {
		$("#image-row").append(`<div class="col-12 col-md-6"><br/><br/><h2>No image found</h2></div>`);
	}
	// Ingredients list
	$("#image-row").append(`<ul id="list-recipe" class="subtitle-light col-12 col-md-6 text-center"><h2 class="subtitle text-center">Ingredients</h2></ul>`);
	let ingredientsArray = response.extendedIngredients;
	$.each(ingredientsArray, function () {
		$("#list-recipe").append($('<li>').text(`${this.original}`));
	});
	// Check if a list of steps has been provided as an array
	if (response.analyzedInstructions[0] !== undefined) {
		let stepsArray = response.analyzedInstructions[0].steps;
		$("#recipe-summary").append(`<ul id="list-steps" class="subtitle-light"><h2 class="subtitle text-center justify-content-center">What to do</h2></ul><div class="row py-3"></div>`);
		$.each(stepsArray, function () {
			$("#list-steps").append($('<li>').text(`${this.number}: ${this.step}`));
		});
	} else {
		$("#recipe-summary").append(`<ul id="list-steps">No recipe steps found - visit website for more information</ul><div class="row py-3"></div>`);
	}
	// create buttons for going to the source website or returning to the search
	$("#recipe-summary").append('<div class="row justify-content-center" id="button-row"></div>');
	$("#button-row").append(`<div class="col-6 text-start"><a href="${response.sourceUrl}" target="_blank"><button id="recipe-button" class="btn btn-secondary btn-lg">View source website</button></a></div>`);
	// create back button for search, return last known page number
	let recipeArray = sessionStorage.getItem("recipeArray");
	recipeArray = JSON.parse(recipeArray);
}
// Organise table data on the page
function displayData() {
	let page = JSON.parse(sessionStorage.getItem("pageNumber"));
	let recipeArray = JSON.parse(sessionStorage.getItem("recipeArray"));
	// Remove existing search and summary data
	removeSearchData();
	// Reveal next and previous buttons if not shown already
	$("#search-next").show();
	$("#search-prev").show();
	// Get first batch of results
	let displayArray = _.nth(recipeArray, page - 1);
	// Print the data
	printData(displayArray);
}
// Print table data to the page
function printData(array) {
	$("#results-table-head").append(
		$('<tr><th scope="col">Recipe</th><th class="d-none d-md-table-cell" scope="col">Preparation time</th><th scope="col">Servings</th><th scope="col"></th></tr>')
	);
	$.each(array, function (index, recipe) {
		// Create ID to use as input for displayFoodSummary()
		let foodIdString = this.id;
		foodIdString = foodIdString.toString();
		let foodId = "displayFoodSummary(" + this.id + ")";
		// Convert time to hours and minutes
		let prepTime = this.readyInMinutes;
		convertTime(prepTime);
		// Truncate long recipe titles
		if (this.title.length > 40) {
			this.title = this.title.substring(0, 40) + "...";
		}
		// Table creation
		$("#results-table-body").append(
			$('<tr>').append(
				$('<td>').text(this.title),
				$('<td class="d-none d-md-table-cell">').text(convertTime(prepTime)),
				$('<td class="justify-content-center">').text(this.servings),
				$('<td>').append(`<button type="submit" id="display-summary" class="btn btn-secondary"
				onclick="${foodId}">See recipe</button>`)
			));
	});
}
// Convert time values gathered from API calls
function convertTime(time) {
	let hours = Math.floor(time / 60);
	let minutes = time % 60;
	if (hours === 0) {
		return minutes + " minutes";
	} else if (minutes === 0 && hours === 1) {
		return hours + " hour";
	} else if (minutes >= 1 && hours === 1) {
		return hours + " hour " + minutes + " minutes";
	} else if (minutes === 0 && hours > 1) {
		return hours + " hours";
	} else if (hours > 1 && minutes >= 1) {
		return hours + " hours " + minutes + " minutes";
	}
}
// Remove existing search data
function removeSearchData() {
	$("#query-placeholder").replaceWith("<table class='table table-dark table-hover' id='results-table'><thead id='results-table-head'></thead><tbody id='results-table-body'></tbody></table>");
	$("#recipe-summary").replaceWith("<table class='table table-dark table-hover' id='results-table'><thead id='results-table-head'></thead><tbody id='results-table-body'></tbody></table>");
	$("#results-table tr").remove();
}
// Reset search to starting state
function resetSearch() {
	removeSearchData();
	$("#results-table").replaceWith('<div id="query-placeholder" class="white-text-color"></div>');
	$("#search-next").remove();
	$("#search-prev").remove();
	$("#reset-search").remove();
	$("#no-results").remove();
}
// Pagination for next
function nextPage(maxPages) {
	let pageNumber = JSON.parse(sessionStorage.getItem("pageNumber"));
	pageNumber = incrementPage(pageNumber);
	sessionStorage.setItem("pageNumber", JSON.stringify(pageNumber));
	displayData();
	switch (true) {
		case pageNumber === maxPages:
			$("#search-next").hide();
			break;
		case pageNumber < maxPages:
			$("#search-next").show();
			$("#search-prev").show();
			break;
	}
}
// Pagination for previous
function prevPage() {
	let pageNumber = JSON.parse(sessionStorage.getItem("pageNumber"));
	pageNumber = decrementPage(pageNumber);
	sessionStorage.setItem("pageNumber", JSON.stringify(pageNumber));
	displayData();
	switch (true) {
		case pageNumber > 1:
			$("#search-next").show();
			$("#search-prev").show();
			break;
		case pageNumber < 2:
			$("#search-prev").hide();
			break;
	}
}
// Increase the page number
function incrementPage(pageNumber) {
	++pageNumber;
	return pageNumber;
}
// Decrease the page number
function decrementPage(pageNumber) {
	--pageNumber;
	return pageNumber;
}