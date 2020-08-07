const body = document.querySelector('body');

const form = document.querySelector('.search-area__form');
const input = document.querySelector('.search-area__input');
const recentContainer = document.querySelector('.recent-items');
const searchBoundary = document.querySelector('.search-boundary');
const searchInfo = document.querySelector('.search-info');
const btn = document.querySelector('.item__btn');

const resultContainer = document.querySelector('.results-container');
const results = document.querySelector('.results');

let recentSearchTerms = [];
let searchId = 0;
let movieTitle = '';
let currentPage = '';
let lastPage = '';

const paintMovie = movie => {
	const resultItem = document.createElement('article');
	resultItem.className = 'result';
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
	resultItem.appendChild(poster);
	resultItem.appendChild(movieInfo);
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
		console.log('현재페이지', currentPage);
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
				console.log('영화 가져오기 성공');
				console.log('영화 총 갯수', totalResults, '마지막 페이지', lastPage);
				resultContainer.style.display = 'flex';
				movies.forEach(movie => paintMovie(movie));
				window.addEventListener('scroll', handleScroll);
			} else if (json.Response === 'False') {
				console.log('영화 가져오기 실패');
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

const removeRecentItems = () => {
	searchBoundary.classList.remove('show');
	searchInfo.classList.remove('show');
	recentSearchTerms = [];
	recentContainer.innerHTML = '';
	input.addEventListener('focus', handleFocus);
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
		console.log('있음');
		input.removeEventListener('focus', handleFocus);
		if (loadRecentSearch.length > 5) {
			console.log('있고 5넘음');
			const newRecentSearch = loadRecentSearch.filter(movie => movie.id !== 1);
			searchBoundary.classList.add('show');
			searchInfo.classList.add('show');
			newRecentSearch.forEach(movie => paintRecentSearch(movie));
		} else {
			console.log('있는데 5안넘음');
			searchBoundary.classList.add('show');
			searchInfo.classList.add('show');
			loadRecentSearch.forEach(movie => paintRecentSearch(movie));
		}
	}
};

const handleBodyClick = event => {
	const target = event.target;
	if (target == event.currentTarget.querySelector('.search')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.search-area')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.fa-search')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.search-area__i')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.search-area__form')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.search-area__input')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.search-boundary')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.search-info')) {
		console.log('search 내부임');
		return;
	} else if (target == event.currentTarget.querySelector('.recent-items')) {
		console.log('search 내부임');
		return;
	} else if (target.className == 'recent-item') {
		console.log('search 내부임');
		const selectedText = target.firstChild.innerText;
		input.value = selectedText;
		handleSubmit();
		return;
	} else if (target.className == 'item__text') {
		console.log('search 내부임');
		const selectedText = target.innerText;
		input.value = selectedText;
		handleSubmit();
		return;
	} else if (target.className == 'item__btn') {
		console.log('search 내부임');
		const selectedItem = target.parentNode;
		recentContainer.removeChild(selectedItem);
		const removeRecentSearch = recentSearchTerms.filter(item => parseInt(selectedItem.id) !== item.id);
		recentSearchTerms = removeRecentSearch;
		saveStorage();
		return;
	} else {
		console.log('search 외부임');
		removeRecentItems();
	}
};

input.addEventListener('focus', handleFocus);
form.addEventListener('submit', handleSubmit);
body.addEventListener('click', handleBodyClick);
