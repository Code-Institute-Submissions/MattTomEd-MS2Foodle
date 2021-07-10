$(document).ready(readyDocument);

function readyDocument() {
	console.log("Ready");
	$("#intolerance").hide();
	$("#cuisine").hide();
	$("#intolerance-reveal").click(function() {
		$("#intolerance").toggle(500);
	})
	$("#cuisine-reveal").click(function() {
		$("#cuisine").toggle(500);
	})
	pageNumber = 1;
	for (var i = 0; i < 4; i++) {
		checkPreviousSearchList(localStorage.key(i))
	}
}

function checkPreviousSearchList(keyNumber) {
	result = localStorage.getItem(keyNumber)
	if (result != null) {
		result = JSON.parse(result);
		$("#previous-search-area").prepend(
			`<li id="${result.id}" class="text-center justify-content-center"><a class="subtitle-light" onclick="callPreviousSearchResult(${result.id})">${result.title}</a></li>`
		)
		if ($('#previous-search-area li').length > 5) {
			keyToRemove = $('#previous-search-area li').last().attr("id");
			localStorage.removeItem(keyToRemove);
			$('#previous-search-area li').last().remove();
		}
	}
}

function callPreviousSearchResult(id) {
	keyToRemove = $(`#previous-search-area #${id}`).first();
	localStorage.removeItem(keyToRemove);
	keyToRemove.remove();
	generateSummary(JSON.parse(localStorage.getItem(id)));
	console.log("CLICKED");
}

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

	const settings = {
		"async": true,
		"crossDomain": true,
		// Error message
		"error": function (xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
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
		console.log(response);
		console.log("Button has been clicked for ID number " + id);
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

		// remove previous pagination if user searches again w/o without clearing
		$("#search-next").remove();
		$("#search-prev").remove();
		$("#reset-search").remove();

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
			$("#results-area").append(`<button type="submit" id="reset-search" class="btn btn-secondary btn-lg"
			onclick="resetSearch()">Reset search</button>`)
		} else {
			console.log("NO PAGINATION")
			$("#results-area").append(`<button type="submit" id="reset-search" class="btn btn-secondary btn-lg"
			onclick="resetSearch()">Reset search</button>`)
		}

		// save search list to localstorage 
		sessionStorage.setItem("recipeArray", JSON.stringify(recipeArray))
	});

	return false;

}

// generate recipe summary
function generateSummary(response) {

	// store page number to session storage
	sessionStorage.setItem("pageNumber", JSON.stringify(pageNumber));
	// remove existing data and placeholder if user manually enters URL (if bookmarked)
	$("#recipe-summary").replaceWith(`<table class="table table-dark table-hover" id="results-table"><thead id="results-table-head"></thead><tbody id="results-table-body"></tbody></table>`);
	$("#query-placeholder").replaceWith(`<table class="table table-dark table-hover" id="results-table"><thead></thead id="results-table-head"><tbody id="results-table-body"></tbody></table>`);
	// generate info in a div
	$("#results-table").replaceWith(`<div id="recipe-summary"></div>`);
	if (response.vegetarian === true) {
		console.log("VEG " + response.vegetarian)
		$("#recipe-summary").append(`<div id="icon-vegetarian">V</div>`);
	}
	if (response.vegan === true) {
		console.log("VEGAN " + response.vegan)
		$("#recipe-summary").append(`<div id="icon-vegan">VG</div>`);
	}
	if (response.glutenFree === true) {
		console.log("GF " + response.glutenFree)
		$("#recipe-summary").append(`<div id="icon-gluten-free">GF</div>`);
	}
	if (response.dairyFree === true) {
		console.log("DF " + response.vegetarian)
		$("#recipe-summary").append(`<div id="icon-dairy-free">DF</div>`);
	}
	if (response.analyzedInstructions[0] !== undefined) {
		stepsArray = response.analyzedInstructions[0].steps;
		console.log(stepsArray[0].step)
		console.log(typeof (stepsArray.length))
		$("#recipe-summary").append(`<ul id="list-steps">What to do</ul>`);

		$.each(stepsArray, function () {
			$("#list-steps").append($('<li>').text(`${this.number}: ${this.step}`));
		})
	} else {
		$("#recipe-summary").append(`<ul id="list-steps">No recipe steps found - visit website for more information</ul>`);
	}

	$("#recipe-summary").append(`<ul id="list-recipe"></ul>`);
	ingredientsArray = response.extendedIngredients
	$.each(ingredientsArray, function () {
		$("#list-recipe").append($('<li>').text(`${this.original}`));
	})

	$("#recipe-summary").append(`<div id="source-name">Source name: ${response.sourceName}</div>`);
	$("#recipe-summary").append(`<div id="recipe-title">Title: ${response.title}</div>`);
	$("#recipe-summary").append(`<div id="prep-time">Minutes: ${convertTime(response.readyInMinutes)}</div>`);
	$("#recipe-summary").append(`<div id="servings">Servings: ${response.servings}</div>`);
	$("#recipe-summary").append(`<div id="source-url">URL: ${response.sourceUrl}</div>`);
	$("#recipe-summary").append(`<div id="recipe-image">Image: <img src="${response.image}"/></div>`);
	$("#recipe-summary").append(`<div id="dish-types">Dish types: ${response.dishTypes}</div>`);
	$("#recipe-summary").append(`<a href="${response.sourceUrl}" target="_blank"><button id="recipe-button" class="btn btn-secondary btn-lg">View source website</button></a>`)

	//store result as string in localstorage
	localStorage.setItem(JSON.stringify(response.id), JSON.stringify(response))
	checkPreviousSearchList(JSON.stringify(response.id));

	// create back button for search, return last known page number
	recipeArray = sessionStorage.getItem("recipeArray")
	recipeArray = JSON.parse(recipeArray);
	pageNumber = sessionStorage.getItem("pageNumber")
	pageNumber = parseInt(pageNumber)

	if (sessionStorage.getItem("recipeArray") !== null) {
	$("#recipe-summary").append(`<button id="back-to-search" onclick="displayData(pageNumber)" class="btn btn-secondary btn-lg">Go back</button></a>`)
	} else {
	$("#recipe-summary").append(`<button id="back-to-search" onclick="resetSearch()" class="btn btn-secondary btn-lg">Close</button></a>`)
	}
}

function displayData(page) {
	// remove existing search and summary data
	removeSearchData();
	// Get first batch of results
	displayArray = _.nth(recipeArray, page - 1);
	console.log(displayArray);
	// Print the data
	printData(displayArray);
}

function printData(array) {
	$("#results-table-head").append(
		$('<tr><th scope="col">Recipe</th><th scope="col">Preparation time</th><th scope="col">Servings</th><th scope="col"></th></tr>')
	)
	$.each(array, function (index, recipe) {
		foodIdString = this.id;
		foodIdString = foodIdString.toString();
		foodId = "displayFoodSummary(" + this.id + ")";
		console.log("ID is " + foodIdString)
		prepTime = this.readyInMinutes;
		convertTime(prepTime);
		$("#results-table-body").append(
			$('<tr>').append(
				$('<td>').text(this.title),
				$('<td>').text(convertTime(prepTime)),
				$('<td class="justify-content-center">').text(this.servings),
				$('<td>').append(`<button type="submit" id="display-summary" class="btn btn-secondary"
				onclick="${foodId}">See recipe</button>`)
			));
	});
}

function convertTime(time) {
	hours = Math.floor(time / 60);
	minutes = time % 60;
	if (hours === 0) {
		return minutes + " minutes";
	} else if (minutes === 0 && hours === 1) {
		return hours + " hour"
	} else if (minutes === 0 && hours > 1) {
		return hours + " hours";
	} else if (hours > 1 && minutes >= 1) {
		return hours + " hours " + minutes + " minutes"
	}
}

// remove existing search data
function removeSearchData() {
	$("#query-placeholder").replaceWith("<table class='table table-dark table-hover' id='results-table'><thead id='results-table-head'></thead><tbody id='results-table-body'></tbody></table>");
	$("#recipe-summary").replaceWith("<table class='table table-dark table-hover' id='results-table'><thead id='results-table-head'></thead><tbody id='results-table-body'></tbody></table>")
	$("#results-table tr").remove();
}

// reset search to starting state
function resetSearch() {
	removeSearchData();
	$("#results-table").replaceWith('<div id="query-placeholder" class="white-text-color"><p>RESULTS GO HERE</p></div>');
	$("#search-next").remove();
	$("#search-prev").remove();
	$("#reset-search").remove();
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

