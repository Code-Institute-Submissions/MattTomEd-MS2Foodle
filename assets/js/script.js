$(document).ready(readyDocument);

function readyDocument() {
	console.log("Ready");
	$("#intolerance").hide();
	$("#cuisine").hide();
	$("#contact-form").hide();
	$("#intolerance-reveal").click(function () {
		$("#intolerance").toggle(500);
	})
	$("#cuisine-reveal").click(function () {
		$("#cuisine").toggle(500);
	})
	$("#contact-reveal").click(function () {
		$("#contact-form").toggle(500);
		$("#contact-reveal").hide();
	})
	pageNumber = 1;
	for (i = 0; i < 5; i++) {
		checkPreviousSearchList(localStorage.key(i))
	}
}

function checkPreviousSearchList(keyNumber) {
	result = localStorage.getItem(keyNumber)
	if (result != null) {
		result = JSON.parse(result);
		$("#previous-search-area").prepend(
			`<li id="${result.id}" class="text-center justify-content-center"><a class="subtitle-light" onclick="callPreviousSearchResult(${result.id})">${result.title}</a></li><div class="row py-1"></div>`
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
	return replaced;
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

		if (recipeArray.length === 0) {
			$("#results-area").append(`<h2 id="no-results" class="text-center previous-search-container">Sorry, we couldn't find any recipes!</h2>`)
			$("#results-area").append(`<div class="row" id="reset-search"><div class="col d-flex justify-content-center"><button type="submit" id="reset-search" class="btn btn-secondary btn-lg subtitle"
			onclick="resetSearch()">Reset search</button></div></div>`)
		} else {

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
				$("#results-area").append(`<div class="row" id="reset-search"><div class="col d-flex justify-content-center"><button type="submit" id="reset-search" class="btn btn-secondary btn-lg subtitle"
			onclick="resetSearch()">Reset search</button></div></div>`)
			} else {
				console.log("NO PAGINATION")
				$("#results-area").append(`<div class="row" id="reset-search"><div class="col d-flex justify-content-center"><button type="submit" id="reset-search" class="btn btn-secondary btn-lg subtitle"
			onclick="resetSearch()">Reset search</button></div></div>`)
			}

			// save search list to localstorage 
			sessionStorage.setItem("recipeArray", JSON.stringify(recipeArray))
		}
	});


	return false;

}

// generate recipe summary
function generateSummary(response) {
	//hide next and prev buttons
	$("#search-next").hide();
	$("#search-prev").hide();
	//store result as string in localstorage
	localStorage.setItem(JSON.stringify(response.id), JSON.stringify(response))
	checkPreviousSearchList(JSON.stringify(response.id));
	// store page number to session storage
	sessionStorage.setItem("pageNumber", JSON.stringify(pageNumber));
	// remove existing data and placeholder if user manually enters URL (if bookmarked)
	$("#recipe-summary").replaceWith(`<table class="table table-dark table-hover" id="results-table"><thead id="results-table-head"></thead><tbody id="results-table-body"></tbody></table>`);
	$("#query-placeholder").replaceWith(`<table class="table table-dark table-hover" id="results-table"><thead></thead id="results-table-head"><tbody id="results-table-body"></tbody></table>`);
	// generate info in a div
	$("#results-table").replaceWith(`<div id="recipe-summary"></div>`);
	$("#recipe-summary").append('<div class="row" id="title-row">');
	$("#title-row").append(`<div><h2 class="recipe-title-text text-center justify-content-center">${response.title}</h2><h4 class="subtitle-light text-center justify-content-center">A recipe from ${response.sourceName}</h3></div><div class="row py-3"></div>`);
	$("#title-row").append(`<div><h5 class="subtitle-light">Takes ${convertTime(response.readyInMinutes)} to cook</h5></div>`);
	$("#title-row").append(`<div><h5 class="subtitle-light">Makes ${response.servings} servings</h5></div>`);
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
	})

	$("#recipe-summary").append('<div class="row justify-content-centre" id="image-row"></div><div class="row py-3"></div>');

	if (response.image != undefined) {
		$("#image-row").append(`<div class="col-6"><img id="recipe-image" class="img-fluid" src="${response.image}"/></div>`);
	} else {
		$("#image-row").append(`<div class="col-6"><br/><br/><h2>No image found</h2></div>`);
	}
	$("#image-row").append(`<ul id="list-recipe" class="subtitle-light col-6 text-center"><h2 class="subtitle text-center">Ingredients</h2></ul>`);
	ingredientsArray = response.extendedIngredients
	$.each(ingredientsArray, function () {
		$("#list-recipe").append($('<li>').text(`${this.original}`));
	})

	if (response.analyzedInstructions[0] !== undefined) {
		stepsArray = response.analyzedInstructions[0].steps;
		$("#recipe-summary").append(`<ul id="list-steps" class="subtitle-light"><h2 class="subtitle text-center justify-content-center">What to do</h2></ul><div class="row py-3"></div>`);

		$.each(stepsArray, function () {
			$("#list-steps").append($('<li>').text(`${this.number}: ${this.step}`));
		})
	} else {
		$("#recipe-summary").append(`<ul id="list-steps">No recipe steps found - visit website for more information</ul><div class="row py-3"></div>`);
	}

	$("#recipe-summary").append('<div class="row justify-content-center" id="button-row"></div>')

	$("#button-row").append(`<div class="col-6 text-center"><a href="${response.sourceUrl}" target="_blank"><button id="recipe-button" class="btn btn-secondary btn-lg">View source website</button></a></div>`)

	// create back button for search, return last known page number
	recipeArray = sessionStorage.getItem("recipeArray")
	recipeArray = JSON.parse(recipeArray);
	pageNumber = sessionStorage.getItem("pageNumber")
	pageNumber = parseInt(pageNumber)

	if (Boolean($("#search-next").length) === true) {
		$("#button-row").append(`<div class="col-6 text-center"><button id="back-to-search" onclick="displayData(pageNumber)" class="btn btn-secondary btn-lg">Go back</button></a></div>`)
	} else {
		$("#button-row").append(`<div class="col-6 text-center"><button id="back-to-search" onclick="resetSearch()" class="btn btn-secondary btn-lg">Close</button></a></div>`)
	}
	$("#button-row").append(`<div class="row py-3"></div>`)
}

function displayData(page) {

	// remove existing search and summary data
	removeSearchData();
	//reveal next and previous buttons if not shown already
	$("#search-next").show();
	$("#search-prev").show();
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
	$("#results-table").replaceWith('<div id="query-placeholder" class="white-text-color"></div>');
	$("#search-next").remove();
	$("#search-prev").remove();
	$("#reset-search").remove();
	$("#no-results").remove();
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