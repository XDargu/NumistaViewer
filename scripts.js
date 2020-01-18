function getUserIDParameter()
{
    let url = new URL(window.location.href);
    return url.searchParams.get("uid");
}

function displayUserCollection(userId)
{
	if (!userId)
	{
		userId = getUserIDParameter();
	}
	
	currentUserId = userId;
	
	displayUserInfo(userId)
	
	currentPage = 0;
	requestAddCurrentUserCoins();
	
	getValueOfAllUserCoins(userId, function(data){
		
		document.getElementById('median-value-loader').outerHTML = data.median.toFixed(2) + ' $';
		document.getElementById('average-value-loader').outerHTML = data.average.toFixed(2) + ' $';
	});
	
	
}
    
// Frontend
function expandCoinCard(item)
{
	let coinId = item.id;
	
	requestCoinInfo(coinId, function(data) {
	
		requestCoinPrices(coinId, function(priceData) {
			let htmlText = createCoinCard(data, priceData);
			document.getElementById(coinId).outerHTML = htmlText;
		});
	});
}

function contractCoinCard(coinId)
{
	requestCoinInfo(coinId, function(data) {
	
		requestCoinPrices(coinId, function(priceData) {
			let htmlText = createCoinSummaryCard(data, priceData);
			document.getElementById(coinId).outerHTML = htmlText;
		});
	});
}

function createCoinValue(name, value)
{
	let htmlText = '';

	htmlText += '<div class="content-item">';
	htmlText += '<span class="item-name">';
	htmlText += name;
	htmlText += '</span>';
	htmlText += '<span class="item-value">';
	htmlText += value;
	htmlText += '</span>';
	htmlText += '</div>';

	return htmlText;
}

function createHideDetailsButton(name, coinId)
{
	let htmlText = '';

    htmlText += '<a class="content-button" onclick="contractCoinCard(' + coinId + ')">';
	htmlText += name;
	htmlText += '</a>';

	return htmlText;
}

function createViewCoinButton(name, link)
{
	let htmlText = '';

    htmlText += '<a class="content-button bottom" href="' + link + '" target="_blank">';
	htmlText += name;
	htmlText += '</a>';

	return htmlText;
}

function createCoinCard(coinData, priceData)
{
	let htmlText = '';

	htmlText += '<div class="coint-card" id="' + coinData.id +'">';

	htmlText += '<div class="images">';
	htmlText += '<img alt="' + coinData.title + ' obverse" src="' + coinData.images.obverse.fullsize + '">';
	htmlText += '<img alt="' + coinData.title + ' reverse" src="' + coinData.images.reverse.fullsize + '">';
	htmlText += '</div>';

	htmlText += '<div class="content">';

	htmlText += '<div class="content-title">';
	htmlText += coinData.title;
	htmlText += '</div>';
    
    htmlText += createHideDetailsButton('Hide details', coinData.id);

	htmlText += createCoinValue('Country', coinData.country.name);
	htmlText += createCoinValue('Years', coinData.years_range);
	htmlText += createCoinValue('Calendar', coinData.calendar_type);
	htmlText += createCoinValue('Value', coinData.value);
	htmlText += createCoinValue('Metal', coinData.metal);
	htmlText += createCoinValue('Weight', coinData.weight);
	htmlText += createCoinValue('Diameter', coinData.diameter);
	htmlText += createCoinValue('Thickness', coinData.thickness);
	htmlText += createCoinValue('Shape', coinData.shape);
	htmlText += createCoinValue('Orientation', coinData.orientation);

	if (priceData.prices && priceData.prices[0])
	{
		htmlText += createCoinValue('Median value', priceData.prices[0].median + ' $');
		htmlText += createCoinValue('Average value', priceData.prices[0].average + ' $');
	}
	else
	{
		htmlText += createCoinValue('Median value', 'Unknown');
		htmlText += createCoinValue('Average value', 'Unknown');
	}
    
    htmlText += createViewCoinButton('View coin in Numista', 'https://en.numista.com/catalogue/pieces' + coinData.id + '.html');

	htmlText += '</div>';

	htmlText += '</div>';

	return htmlText;
}

function createCoinSummaryCard(coinData)
{
	let htmlText = '';

	htmlText += '<div class="coint-card" onclick="expandCoinCard(this)" id="' + coinData.id +'">';

	htmlText += '<div class="images">';
	htmlText += '<img alt="' + coinData.title + ' obverse" src="' + coinData.images.obverse.fullsize + '">';
	htmlText += '<img alt="' + coinData.title + ' obverse" src="' + coinData.images.reverse.fullsize + '">';
	htmlText += '</div>';

	htmlText += '<div class="content">';

	htmlText += '<div class="content-title">';
	htmlText += coinData.title;
	htmlText += '</div>';

	htmlText += '</div>';

	htmlText += '</div>';

	return htmlText;
}

function createCoinSummaryCardFromUserData(coinData)
{
	let htmlText = '';

	htmlText += '<div class="coint-card" onclick="expandCoinCard(this)" id="' + coinData.id +'">';

	htmlText += '<div class="images">';
	htmlText += '<img alt="' + coinData.title + ' obverse" src="' + coinData.obverse + '">';
	htmlText += '<img alt="' + coinData.title + ' obverse" src="' + coinData.reverse + '">';
	htmlText += '</div>';

	htmlText += '<div class="content">';

	htmlText += '<div class="content-title">';
	htmlText += coinData.name;
	htmlText += '</div>';

	htmlText += '</div>';

	htmlText += '</div>';

	return htmlText;
}

function createCountryCard(countryName)
{
	let htmlText = '';

	htmlText += '<div class="country-card">';
	htmlText += countryName;
	htmlText += '</div>';

	return htmlText;
}

function createCountryBeginning()
{
	let htmlText = '';

	htmlText += '<div class="country-container">';

	return htmlText;
}

function createCountryEnd()
{
	let htmlText = '';

	htmlText += '</div>';

	return htmlText;
}

function createCoinGroupBeginning()
{
	let htmlText = '';

	htmlText += '<div class="coins-group">';

	return htmlText;
}

function createCoinGroupEnd()
{
	let htmlText = '';

	htmlText += '<div class="clear"></div>';
	htmlText += '</div>';

	return htmlText;
}

function createUserValue(name, value)
{
	let htmlText = '';

	htmlText += '<div class="user-item">';
	htmlText += '<span class="user-name">';
	htmlText += name;
	htmlText += '</span>';
	htmlText += '<span class="user-value">';
	htmlText += value;
	htmlText += '</span>';
	htmlText += '</div>';

	return htmlText;
}

function createUserInfo(userData)
{
    if (userData.error)
    {
        let searchForm = document.getElementById("search-country-form");
        searchForm.classList.add("hidden");
        return '<div class="centered-card"><h1>User not found</h1><p>The requested user has not been found. Make sure the user ID is valid.</p><a id="id-help" href="help.html"><i class="help-icon">?</i><p class="help-text">How to find my user ID</p></a></div>';
    }
    
	let htmlText = '';
	htmlText += '<img alt="user profileimage" id="user-img" src="' + userData.image + '">';
	htmlText += '<div id="user-details">';
	htmlText += '<div id="user-name">Collection of ' + userData.name + '</div>';
    
    htmlText += '<div id="user-data-block">';
	htmlText += createUserValue('Country', userData.location);
	htmlText += createUserValue('Member since', userData.member_since);
	htmlText += createUserValue('Median collection value', '<div id="median-value-loader" class="loader value-loader"></div>');
	htmlText += createUserValue('Average collection value', '<div id="average-value-loader" class="loader value-loader"></div>');
    htmlText += '</div>';
    
	htmlText += '</div>';

	return htmlText;
}
// ~frontend
    
function displayUserInfo(userId)
{
	getUserInfo(userId, function(userData) {
		let userInfoHtml = createUserInfo(userData);
		
		document.getElementById('user-info').innerHTML = userInfoHtml;
	});
}

function displayCoinInfo(coinId)
{
	requestCoinInfo(coinId, function(data) {
		
		requestCoinPrices(coinId, function(priceData) {
			let htmlText = createCoinCard(data, priceData);
			
			document.getElementById('coin-list').innerHTML += htmlText;
		});
	});
}

function createUserCoins(userId, page, data, append) {
	
	let currentCountry = undefined;
	let htmlText = '';
	
	if (data.list)
	{
		for (let i=0; i<data.list.length; ++i)
		{
			let coin = data.list[i];
			
            if (coin.country.name !== currentCountry)
			{
				if (currentCountry)
				{
					htmlText += createCoinGroupEnd();
					htmlText += createCountryEnd();
				}
				htmlText += createCountryBeginning();
				htmlText += createCountryCard(coin.country.name);
				
				htmlText += createCoinGroupBeginning();
			}

			htmlText += createCoinSummaryCardFromUserData(coin);

			currentCountry = coin.country.name;
		}

		htmlText += createCoinGroupEnd();
		htmlText += createCountryEnd();
	}
    
    if (!data.list || data.list.length == 0)
    {
        //htmlText = 'No coins';
    }
	
	if (append)
	{
		document.getElementById('coin-list').innerHTML += htmlText;
	}
	else
	{
		document.getElementById('coin-list').innerHTML = htmlText;
	}
}

function requestAddCurrentUserCoins()
{
	console.log('requesting page ' + (currentPage + 1));
	addUserCoinsToPage(currentUserId, currentPage + 1, function(){ loadingNextPage = false; });
	currentPage++;
	loadingNextPage = true;
}

function addUserCoinsToPage(userId, page, callback)
{
	document.getElementById('coin-list').innerHTML +=  '<div class="centered" id="add-coin-loader"><div class="loader-centered"></div></div>';
	requestUserCoins(userId, page, countryFilter, function(data) {
	
        let numPages = data.pages.max;
        if (page <= numPages)
        {
            createUserCoins(userId, page, data, true);
        }
        
        let loader = document.getElementById('add-coin-loader');
        loader.parentNode.removeChild(loader);
        callback();
	});
}

function getAmountOfCoinsFromUserCoinDataOfYear(yearData)
{
	let amount = 0;
	
	for (key in yearData)
	{
		let value = yearData[key];
		
		if (key != 'year')
		{
			amount += value;
		}
	}
	return amount;
}

function getAmountOfCoinsFromUserCoinData(coinData)
{
	if (!coinData.years)
	{
		return 0;
	}
	
	let coinAmount = 0;
	
	for (let i=0; i<coinData.years.length; ++i)
	{
		let yearData = coinData.years[i];
		coinAmount += getAmountOfCoinsFromUserCoinDataOfYear(yearData);
	}
	
	return coinAmount;
}

function getValueOfAllUserCoins(userId, callback)
{
	let totalMedianValue = 0;
	let totalAverageValue = 0;
	let totalMinValue = 0;
	let totalMaxValue = 0;
	let totalCoinsAdded = 0;
	
	requestAllUserCoins(userId, function(list){
		
		for (let i=0; i<list.length; ++i)
		{
			let coin = list[i];
			let coinAmount = getAmountOfCoinsFromUserCoinData(coin);
			
			requestCoinPrices(coin.id, function(priceData) {
				if (priceData.prices && priceData.prices[0])
				{
					totalMedianValue += priceData.prices[0].median * coinAmount;
					totalAverageValue += priceData.prices[0].average * coinAmount;
					totalMinValue += priceData.prices[0].min * coinAmount;
					totalMaxValue += priceData.prices[0].max * coinAmount;
				}
				
				totalCoinsAdded++;

				if (totalCoinsAdded === list.length)
				{
					/*console.log('Total median value: ' + totalMedianValue);
					console.log('Total average value: ' + totalAverageValue);
					console.log('Total min value: ' + totalMinValue);
					console.log('Total max value: ' + totalMaxValue);*/
					
					callback({ min: totalMinValue, max: totalMaxValue, median: totalMedianValue, average: totalAverageValue });
				}
			});
		}
		
	});
}

function requestCoinInfo(coinId, callback)
{
	let request = new XMLHttpRequest();

	let requestString = 'https://qmegas.info/numista-api/coin/?coin_id=' + coinId
	request.open('GET', requestString, true);

	request.onload = function () {
		let data = JSON.parse(this.response);
		callback(data);
	}

	// Send request
	request.send();
}

function getUserInfo(userId, callback)
{
	let request = new XMLHttpRequest();

	let requestString = 'https://qmegas.info/numista-api/user/?user_id=' + userId
	request.open('GET', requestString, true);

	request.onload = function () {
		let data = JSON.parse(this.response);
		callback(data);
	}

	// Send request
	request.send();
}

function requestCoinPrices(coinId, callback)
{
	let request = new XMLHttpRequest();

	let requestString = 'https://qmegas.info/numista-api/coin/prices/?coin_id=' + coinId
	request.open('GET', requestString, true);

	request.onload = function () {
		let data = JSON.parse(this.response);
		callback(data);
	}

	// Send request
	request.send();
}

function requestCountryList(callback)
{
    let request = new XMLHttpRequest();

	let requestString = 'https://qmegas.info/numista-api/country/list/'
	request.open('GET', requestString, true);

	request.onload = function () {
		let data = JSON.parse(this.response);
		callback(data);
	}

	// Send request
	request.send();
}

function requestUserCoins(userId, page, countryId, callback)
{
	let request = new XMLHttpRequest();

	let requestString = 'https://qmegas.info/numista-api/user/collection/?user_id=' + userId + '&page=' + page + '&filter_country=' + countryId
	request.open('GET', requestString, true);

	request.onload = function () {
		let data = JSON.parse(this.response);
		callback(data);
	}

	// Send request
	request.send();
}

function requestAllUserCoins(userId, callback)
{
	let coinList = [];
	
	requestUserCoins(userId, 1, null, function(data){
		
		coinList = coinList.concat(data.list);
		
		let numPages = data.pages.max;
		let addedPages = 1;
		
		//console.log('Adding first list');
		//console.log('Added pages: ' + addedPages);
		
		for (let i=2; i<numPages + 1; ++i)
		{
			requestUserCoins(userId, i, null, function(moreData){
				
				coinList = coinList.concat(moreData.list);
				addedPages++;
				
				//console.log('Adding list of page: ' + i);
				//console.log('Added pages: ' + addedPages);
				
				if (numPages == addedPages)
				{
					callback(coinList)
				}
			});
		}
	});
}

function resetCoinList()
{
    currentPage = 0;
    loadingNextPage = false;
    document.getElementById('coin-list').innerHTML = "";
}

function onSearchCountry(evt)
{
    // Clear current coins
    resetCoinList();
    
    // Get filter    
    let searchBar = document.getElementById("search-bar");
    if (searchBar.value == "" || searchBar.value == "All countries")
    {
        countryFilter = null;
    }
    else
    {
        const countriesAmount = countryList.length;
        for (let i=0; i<countriesAmount; ++i) {
            
            if (countryList[i].name == searchBar.value)
            {
                countryFilter = countryList[i].id;
            }
        }
    }
    
    // Filter by country
    evt.preventDefault();
    requestAddCurrentUserCoins();
}

var currentPage = -1;
var countryFilter = null;
var loadingNextPage = false;
var currentUserId;
var countryList = [];

function init() {
    
    // Initialize list search bar
    requestCountryList(function(data){ 
        countryList = data.countries; 
        
        let dataset = document.getElementById("countries");
        
        const countriesAmount = countryList.length;
        for (let i=0; i<countriesAmount; ++i) {
            let option = document.createElement("option");
            option.value = countryList[i].name;
            option.id = countryList[i].id;
            dataset.appendChild(option);
        }
    });
    
    let searchForm = document.getElementById("search-country-form");
    searchForm.addEventListener("submit", onSearchCountry, true);
    
    let searchCountryButton = document.getElementById("search-bar");
    searchCountryButton.addEventListener("change", onSearchCountry, true);
    
    // Initialize go to top button
    
    
    // Display collection
	displayUserCollection();
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
	
window.onscroll = function(ev) {
    let topButton = document.getElementById("top-button");
    
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
    
	if ((window.innerHeight + window.pageYOffset) >= (document.body.scrollHeight - 20)) {
		// you're at the bottom of the page
		if (currentPage >= 0 && !loadingNextPage)
		{
			requestAddCurrentUserCoins();
		}
	}
};