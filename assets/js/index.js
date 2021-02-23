const body = document.querySelector('body');
const header = document.querySelector('.header');
const search = document.querySelector('.search');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form__input');
const searchClearBtn = document.querySelector('.search__btn-clear');
const searchHistoryWrapper = document.querySelector('.search__history');
const results = document.querySelector('.results');
const resultsWrapper = document.querySelector('.results__wrapper--grid');
const modalContainer = document.querySelector('.previewModal');
const modalContent = document.querySelector('.previewModal__content');
const modalBg = document.querySelector('.previewModal__bg');
const modalTitle = document.querySelector('.previewModal__title');
const modalDate = document.querySelector('.previewModal__date');
const modalGenres = document.querySelector('.previewModal__genres');
const modalStory = document.querySelector('.previewModal__story');
const modalBtn = document.querySelector('.previewModal__btn-close');

let searchHistoryArr = [];
let searchId = 0;
let movieTitle = '';
let currentPage = '';
let lastPage = '';

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

const handleCloseClick = () => {
	modalContainer.style.display = 'none';
	body.classList.remove('open');
	clearSearchHistory();
};

const openModal = movie => {
	const genres = movie.genres.map(genre => {
		return genre.name;
	});
	modalContainer.style.display = 'flex';
	modalBg.style.backgroundImage =
		movie.backdrop_path === null ? 'none' : `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`;
	modalTitle.innerText =
		movie.original_title.length > 30 ? movie.original_title.substr(0, 30) + '...' : movie.original_title;
	modalDate.innerText = movie.release_date;
	modalGenres.innerText = genres.join(', ');
	modalStory.innerText = movie.overview.length > 300 ? movie.overview.substr(0, 300) + '...' : movie.overview;
	body.classList.add('open');
};

const paintMovie = movie => {
	const resultItem = document.createElement('article');
	const poster = document.createElement('div');
	const movieInfo = document.createElement('div');
	const title = document.createElement('h1');
	resultItem.id = movie.id;
	resultItem.className = 'result';
	poster.className = 'result__poster';
	poster.style.backgroundImage =
		movie.poster_path === null
			? "url('./assets/images/image_not_found.jpg')"
			: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
	movieInfo.className = 'result__info';
	title.className = 'result__title';
	title.innerText =
		movie.original_title.length > 30 ? movie.original_title.substr(0, 30) + '...' : movie.original_title;
	movieInfo.appendChild(title);
	resultItem.appendChild(poster);
	resultItem.appendChild(movieInfo);
	resultsWrapper.appendChild(resultItem);
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

const handleClickMovie = e => {
	const movieId = e.currentTarget.id;
	getMovieDetail(movieId);
	clearSearchHistory();
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
				results.style.display = 'flex';
				body.style.height = '100%';
				movies.forEach(movie => paintMovie(movie));
				const movieResults = document.querySelectorAll('.result');
				for (let i = 0; i < movieResults.length; i++) {
					movieResults[i].addEventListener('click', handleClickMovie);
				}
				window.addEventListener('scroll', handleScroll);
			} else {
				alert('Movie Not Found!');
			}
		});
};

const handleSearchSubmit = e => {
	e.preventDefault();
	const inputText = searchInput.value;
	searchInput.value = '';
	if (inputText.length > 0) {
		saveSearchHistory(inputText);
		searchInput.blur();
		clearSearchHistory();
		resultsWrapper.innerHTML = '';
		movieTitle = inputText;
		currentPage = 1;
		getMovies();
	}
};

const saveStorage = () => localStorage.setItem('movie', JSON.stringify(searchHistoryArr));

const saveSearchHistory = title => {
	searchId = searchHistoryArr.length + 1;
	const searchWord = {
		id: searchId,
		text: title,
	};
	searchHistoryArr.push(searchWord);
	saveStorage();
};

const paintSearchHistory = movie => {
	const div = document.createElement('div');
	const text = document.createElement('p');
	const span = document.createElement('span');
	const i = document.createElement('i');
	const deleteI = document.createElement('i');
	const btn = document.createElement('button');
	div.id = searchHistoryArr.length + 1;
	div.className = 'history';
	text.innerText = movie.text.length > 15 ? movie.text.substr(0, 15) + '...' : movie.text;
	text.className = 'history__text';
	span.className = 'history__i';
	i.className = 'fas fa-history';
	btn.className = 'history__btn-delete';
	deleteI.className = 'fas fa-times';
	btn.appendChild(deleteI);
	span.appendChild(i);
	div.appendChild(span);
	div.appendChild(text);
	div.appendChild(btn);
	searchHistoryWrapper.appendChild(div);
	saveSearchHistory(movie.text);
};

const handleHistoryClick = e => {
	const target = e.target;
	const currentTarget = e.currentTarget;
	if (target.className == 'history__btn-delete' || target.className == 'fas fa-times') {
		const removeRecentSearch = searchHistoryArr.filter(item => parseInt(currentTarget.id) !== item.id);
		searchHistoryWrapper.removeChild(currentTarget);
		searchHistoryArr = removeRecentSearch;
		saveStorage();
	} else if (
		currentTarget.contains(target) &&
		target.className !== 'history__btn-delete' &&
		target.className !== 'fas fa-times'
	) {
		searchInput.value = currentTarget.children[1].innerText;
		const inputText = searchInput.value;
		searchInput.value = '';
		if (inputText.length > 0) {
			saveSearchHistory(inputText);
			searchInput.blur();
			clearSearchHistory();
			resultsWrapper.innerHTML = '';
			movieTitle = inputText;
			currentPage = 1;
			getMovies();
		}
	}
};

const handleInputFocus = e => {
	const loadSearchHistory = JSON.parse(localStorage.getItem('movie'));
	if (Array.isArray(loadSearchHistory) && loadSearchHistory.length > 0) {
		searchInput.removeEventListener('focus', handleInputFocus);
		if (loadSearchHistory.length > 5) {
			const newRecentSearch = loadSearchHistory.filter(movie => movie.id !== 1);
			header.classList.add('show');
			newRecentSearch.forEach(movie => paintSearchHistory(movie));
		} else {
			header.classList.add('show');
			loadSearchHistory.forEach(movie => paintSearchHistory(movie));
		}
		const historyItem = document.querySelectorAll('.history');
		for (let i = 0; i < historyItem.length; i++) {
			historyItem[i].addEventListener('click', handleHistoryClick);
		}
	}
};

const clearSearchHistory = () => {
	header.classList.remove('show');
	searchHistoryArr = [];
	searchHistoryWrapper.innerHTML = '';
	searchInput.addEventListener('focus', handleInputFocus);
};

const handleExternalClick = e => {
	const target = e.target;
	if (!search.contains(target) && header.classList.contains('show')) {
		clearSearchHistory();
	} else if (body.classList == 'open' && !modalContent.contains(target)) {
		handleCloseClick();
		e.preventDefault();
	}
};

const handleClearClick = e => {
	searchInput.value = '';
};

searchClearBtn.addEventListener('click', handleClearClick);
searchInput.addEventListener('focus', handleInputFocus);
searchForm.addEventListener('submit', handleSearchSubmit);
modalBtn.addEventListener('click', handleCloseClick);
body.addEventListener('click', handleExternalClick);
