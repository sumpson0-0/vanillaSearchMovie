const form = document.querySelector('.search-area__form');
const input = document.querySelector('.search-area__input');
const recentContainer = document.querySelector('.recent-items');
const recentItem = document.getElementsByClassName('recent-item');
const searchBoundary = document.querySelector('.search-boundary');
const info = document.querySelector('.search-info');

let recentSearchTerms = [];
let searchId = 0;

/*
const getMovies = title => {
	fetch(`http://www.omdbapi.com/?s=${title}&apikey=432c5b0f`, {
		Title: 'man',
	})
		.then(response => {
			if (response && response.ok) {
				return response.json();
			}
		})
		.then(json => {
			console.log(json);
		});
	console.log(localStorage.getItem('movie'));
};
*/
const handleSubmit = () => {
	event.preventDefault();
	const inputText = input.value;
	input.value = '';
	if (inputText.length > 0) {
		saveRecentSearch(inputText);
	}
	input.blur();

	// getMovies(inputText);
};

const saveRecentSearch = title => {
	searchId = recentSearchTerms.length + 1;
	const searchWord = {
		id: searchId,
		text: title,
	};
	recentSearchTerms.push(searchWord);
	localStorage.setItem('movie', JSON.stringify(recentSearchTerms));
};

const paintRecentSearch = movie => {
	const div = document.createElement('div');
	div.id = movie.id;
	div.className = 'recent-item';
	const text = document.createElement('p');
	text.innerText = movie.text;
	text.className = 'item__text';
	const btn = document.createElement('button');
	btn.innerText = 'Select ✖';
	btn.className = 'item__btn';
	div.appendChild(text);
	div.appendChild(btn);
	recentContainer.appendChild(div);
	saveRecentSearch(movie.text);
};

const handleFocus = () => {
	const loadRecentSearch = JSON.parse(localStorage.getItem('movie'));
	if (loadRecentSearch !== null) {
		searchBoundary.classList.add('show');
		info.classList.add('show');
		recentSearchTerms = [];
		loadRecentSearch.forEach(movie => paintRecentSearch(movie));
	}
};

const handleFocusOut = () => {
	searchBoundary.classList.remove('show');
	info.classList.remove('show');
	recentContainer.childNodes.forEach(item => {
		recentContainer.removeChild(item);
	});
	// 최근검색어만 제대로 사라지게 만들면 포커스 다시 됐을 때 중첩 안 됨.
};

input.addEventListener('focus', handleFocus);
input.addEventListener('focusout', handleFocusOut);
form.addEventListener('submit', handleSubmit);
