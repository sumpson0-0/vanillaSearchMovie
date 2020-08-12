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
const modalContainer = document.querySelector('.modal');
const modalContent = document.querySelector('.modal__content');
const contentBg = document.querySelector('.content__bg');
const contentTitle = document.querySelector('.content__title');
const contentDate = document.querySelector('.content__date');
const contentGenres = document.querySelector('.content__genres');
const contentStory = document.querySelector('.content__story');
const modalExitBtn = document.querySelector('.content__btn-exit');

let recentSearchTerms = [];
let searchId = 0;
let movieTitle = '';
let currentPage = '';
let lastPage = '';

const openModal = movie => {
	const genres = movie.genres.map(genre => {
		return genre.name;
	});
	modalContainer.style.display = 'flex';
	contentBg.style.backgroundImage =
		movie.backdrop_path === null ? 'none' : `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`;
	contentTitle.innerText =
		movie.original_title.length > 30 ? movie.original_title.substr(0, 30) + '...' : movie.original_title;
	contentDate.innerText = movie.release_date;
	contentGenres.innerText = genres.join(', ');
	contentStory.innerText = movie.overview.length > 450 ? movie.overview.substr(0, 450) + '...' : movie.overview;
};

const getMovieDetail = id => {
	fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=05719c9ff8d5a1b640025f01f46560b5&language=en-US`)
		.then(response => {
			if (response && response.ok) {
				return response.json();
			}
		})
		.then(json => {
			openModal(json);
		});
};

const paintMovie = movie => {
	const resultItem = document.createElement('article');
	resultItem.id = movie.id;
	resultItem.className = 'result';
	const poster = document.createElement('div');
	poster.className = 'result__poster';
	poster.style.backgroundImage =
		movie.poster_path === null
			? "url('./assets/images/image_not_found.jpg')"
			: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
	const movieInfo = document.createElement('div');
	movieInfo.className = 'result__info';
	const title = document.createElement('h1');
	title.className = 'result__title';
	title.innerText =
		movie.original_title.length > 30 ? movie.original_title.substr(0, 30) + '...' : movie.original_title;
	movieInfo.appendChild(title);
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
	}
};

const getMovies = () => {
	fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=05719c9ff8d5a1b640025f01f46560b5&language=en-US&query=${movieTitle}&page=${currentPage}`,
	)
		.then(response => {
			if (response && response.ok) {
				return response.json();
			}
		})
		.then(json => {
			const movies = json.results;
			if (Array.isArray(movies) && movies.length > 0) {
				lastPage = json.total_pages;
				resultContainer.style.display = 'flex';
				body.style.height = '100%';
				movies.forEach(movie => paintMovie(movie));
				window.addEventListener('scroll', handleScroll);
			} else {
				body.style.height = '100vh';
				alert('Movie Not Found!');
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

const handleClick = event => {
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
	} else if (target.className === 'result__poster') {
		const movieId = target.parentElement.id;
		getMovieDetail(movieId);
		removeRecentItems();
		return;
	} else if (target.className === 'result__info') {
		const movieId = target.parentElement.id;
		getMovieDetail(movieId);
		removeRecentItems();
		return;
	} else if (target.className === 'result__title') {
		const movieId = target.parentElement.parentElement.id;
		getMovieDetail(movieId);
		removeRecentItems();
		return;
	} else if (target.className === 'content__btn-exit') {
		modalContainer.style.display = 'none';
		removeRecentItems();
		return;
	} else {
		removeRecentItems();
	}
};

input.addEventListener('focus', handleFocus);
form.addEventListener('submit', handleSubmit);
body.addEventListener('click', handleClick);
