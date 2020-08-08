const body = document.querySelector('body');
const form = document.querySelector('.search-area__form');
const input = document.querySelector('.search-area__input');
const recentContainer = document.querySelector('.recent-items');
const searchBoundary = document.querySelector('.search-boundary');
const searchInfo = document.querySelector('.search-info');
const btn = document.querySelector('.item__btn');
const resultContainer = document.querySelector('.results-container');
const results = document.querySelector('.results');
const result = document.querySelector('.result');

let recentSearchTerms = [];
let searchId = 0;
let movieTitle = '';
let currentPage = '';
let lastPage = '';

const paintMovie = movie => {
	const resultItem = document.createElement('article');
	resultItem.className = 'result';
	const link = document.createElement('a');
	link.className = 'result__imdb';
	link.href = `https://www.imdb.com/title/${movie.imdbID}`;
	link.target = '_blank';
	const resultShow = document.createElement('div');
	resultShow.className = 'result--show';
	const poster = document.createElement('div');
	poster.className = 'result__poster';
	poster.style.backgroundImage =
		movie.Poster === 'N/A' ? "url('./assets/images/image_not_found.jpg')" : `url(${movie.Poster})`;
	const movieInfo = document.createElement('div');
	movieInfo.className = 'result__info';
	const title = document.createElement('h1');
	title.className = 'result__title';
	title.innerText = movie.Title.length > 40 ? movie.Title.substr(0, 40) + '...' : movie.Title;
	const year = document.createElement('p');
	year.className = 'result__year';
	year.innerText = movie.Year;
	movieInfo.appendChild(title);
	movieInfo.appendChild(year);
	resultShow.appendChild(poster);
	resultShow.appendChild(movieInfo);
	link.appendChild(resultShow);
	resultItem.appendChild(link);
	results.appendChild(resultItem);
};

const handleScroll = () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 1) {
		window.removeEventListener('scroll', handleScroll);
		if (currentPage < lastPage) {
			currentPage = currentPage + 1;
			getMovies();
		}
	}
};

const getMovies = () => {
	fetch(`http://www.omdbapi.com/?s=${movieTitle}&page=${currentPage}&apikey=432c5b0f`)
		.then(response => {
			if (response && response.ok) {
				return response.json();
			}
		})
		.then(json => {
			if (json.Response === 'True') {
				const movies = json.Search;
				const totalResults = json.totalResults;
				lastPage = Math.round(totalResults / 10);
				resultContainer.style.display = 'flex';
				movies.forEach(movie => paintMovie(movie));
				window.addEventListener('scroll', handleScroll);
			} else if (json.Response === 'False') {
				alert(json.Error);
				return;
			}
		});
};

const handleSubmit = () => {
	event.preventDefault();
	const inputText = input.value;
	input.value = '';
	if (inputText.length > 0) {
		saveRecentSearch(inputText);
		input.blur();
		removeRecentItems();
		results.innerHTML = '';
		movieTitle = inputText;
		currentPage = 1;
		getMovies();
	}
};

const saveStorage = () => localStorage.setItem('movie', JSON.stringify(recentSearchTerms));

const saveRecentSearch = title => {
	searchId = recentSearchTerms.length + 1;
	const searchWord = {
		id: searchId,
		text: title,
	};
	recentSearchTerms.push(searchWord);
	saveStorage();
};

const paintRecentSearch = movie => {
	const div = document.createElement('div');
	div.id = recentSearchTerms.length + 1;
	div.className = 'recent-item';
	const text = document.createElement('p');
	text.innerText = movie.text.length > 15 ? movie.text.substr(0, 15) + '...' : movie.text;
	text.className = 'item__text';
	const btn = document.createElement('button');
	btn.innerText = '✖';
	btn.className = 'item__btn';
	div.appendChild(text);
	div.appendChild(btn);
	recentContainer.appendChild(div);
	saveRecentSearch(movie.text);
};

const handleFocus = () => {
	const loadRecentSearch = JSON.parse(localStorage.getItem('movie'));
	if (Array.isArray(loadRecentSearch) && loadRecentSearch.length > 0) {
		input.removeEventListener('focus', handleFocus);
		if (loadRecentSearch.length > 5) {
			const newRecentSearch = loadRecentSearch.filter(movie => movie.id !== 1);
			searchBoundary.classList.add('show');
			searchInfo.classList.add('show');
			newRecentSearch.forEach(movie => paintRecentSearch(movie));
		} else {
			searchBoundary.classList.add('show');
			searchInfo.classList.add('show');
			loadRecentSearch.forEach(movie => paintRecentSearch(movie));
		}
	}
};

const removeRecentItems = () => {
	searchBoundary.classList.remove('show');
	searchInfo.classList.remove('show');
	recentSearchTerms = [];
	recentContainer.innerHTML = '';
	input.addEventListener('focus', handleFocus);
};

const handleBodyClick = event => {
	const target = event.target;
	if (target == event.currentTarget.querySelector('.search')) {
		return;
	} else if (target == event.currentTarget.querySelector('.search-area')) {
		return;
	} else if (target == event.currentTarget.querySelector('.fa-search')) {
		return;
	} else if (target == event.currentTarget.querySelector('.search-area__i')) {
		return;
	} else if (target == event.currentTarget.querySelector('.search-area__form')) {
		return;
	} else if (target == event.currentTarget.querySelector('.search-area__input')) {
		return;
	} else if (target == event.currentTarget.querySelector('.search-boundary')) {
		return;
	} else if (target == event.currentTarget.querySelector('.search-info')) {
		return;
	} else if (target == event.currentTarget.querySelector('.recent-items')) {
		return;
	} else if (target.className == 'recent-item') {
		const selectedText = target.firstChild.innerText;
		input.value = selectedText;
		handleSubmit();
		return;
	} else if (target.className == 'item__text') {
		const selectedText = target.innerText;
		input.value = selectedText;
		handleSubmit();
		return;
	} else if (target.className == 'item__btn') {
		const selectedItem = target.parentNode;
		recentContainer.removeChild(selectedItem);
		const removeRecentSearch = recentSearchTerms.filter(item => parseInt(selectedItem.id) !== item.id);
		recentSearchTerms = removeRecentSearch;
		saveStorage();
		return;
	} else {
		removeRecentItems();
	}
};

input.addEventListener('focus', handleFocus);
form.addEventListener('submit', handleSubmit);
body.addEventListener('click', handleBodyClick);
