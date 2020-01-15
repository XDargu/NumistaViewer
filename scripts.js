function displayUserCollection(userId)
{
	if (!userId)
	{
		userId = 97163;
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
	
	console.log('expand');
	console.log(coinId);
	
	requestCoinInfo(coinId, function(data) {
	
		console.log('coin info requested');
		requestCoinPrices(coinId, function(priceData) {
			let htmlText = createCoinCard(data, priceData);
			document.getElementById(coinId).outerHTML = htmlText;
			
			console.log('coin prices requested');
		});
	});
}

function contractCoinCard(item)
{
	let coinId = item.id;
	
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

function createCoinCard(coinData, priceData)
{
	let htmlText = '';

	htmlText += '<div class="coint-card" onclick="contractCoinCard(this)" id="' + coinData.id +'">';

	htmlText += '<div class="images">';
	htmlText += '<img src="' + coinData.images.obverse.fullsize + '">';
	htmlText += '<img src="' + coinData.images.reverse.fullsize + '">';
	htmlText += '</div>';

	htmlText += '<div class="content">';

	htmlText += '<div class="content-title">';
	htmlText += coinData.title;
	htmlText += '</div>';

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

	htmlText += '</div>';

	htmlText += '</div>';

	return htmlText;
}

function createCoinSummaryCard(coinData)
{
	let htmlText = '';

	htmlText += '<div class="coint-card" onclick="expandCoinCard(this)" id="' + coinData.id +'">';

	htmlText += '<div class="images">';
	htmlText += '<img src="' + coinData.images.obverse.fullsize + '">';
	htmlText += '<img src="' + coinData.images.reverse.fullsize + '">';
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
	htmlText += '<img src="' + coinData.obverse + '">';
	htmlText += '<img src="' + coinData.reverse + '">';
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
	let htmlText = '';
	htmlText += '<img id="user-img" src="' + userData.image + '">';
	htmlText += '<div id="user-details">';
	htmlText += '<div id="user-name">Collection of ' + userData.name + '</div>';
	htmlText += createUserValue('Country', userData.location);
	htmlText += createUserValue('Member since', userData.member_since);
	htmlText += createUserValue('Median collection value', '<div id="median-value-loader" class="loader value-loader"></div>');
	htmlText += createUserValue('Average collection value', '<div id="average-value-loader" class="loader value-loader"></div>');
	//htmlText += ;
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
	requestUserCoins(userId, page, function(data) {
	
		createUserCoins(userId, page, data, true);
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

function requestUserCoins(userId, page, callback)
{
	let request = new XMLHttpRequest();

	let requestString = 'https://qmegas.info/numista-api/user/collection/?user_id=' + userId + '&page=' + page
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
	
	requestUserCoins(userId, 1, function(data){
		
		coinList = coinList.concat(data.list);
		
		let numPages = data.pages.max;
		let addedPages = 1;
		
		//console.log('Adding first list');
		//console.log('Added pages: ' + addedPages);
		
		for (let i=2; i<numPages + 1; ++i)
		{
			requestUserCoins(userId, i, function(moreData){
				
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

var currentPage = -1;
var loadingNextPage = false;
var currentUserId;

function init() {
	displayUserCollection();
}
	
window.onscroll = function(ev) {
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		// you're at the bottom of the page
		if (currentPage >= 0 && !loadingNextPage)
		{
			requestAddCurrentUserCoins();
		}
	}
};