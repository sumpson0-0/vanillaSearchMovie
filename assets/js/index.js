const form = document.querySelector('.search-bar__form');
const input = document.querySelector('.search-bar__input');
const recentContainer = document.querySelector('.recent-items');

let recentSearchTerms = [];
let searchId = 0;

const paintRecentSearch = movie => {
	const div = document.createElement('div');
	div.id = movie.id;
	const text = document.createElement('p');
	text.innerText = movie.text;
	const btn = document.createElement('button');
	btn.innerText = '✖';
	div.appendChild(text);
	div.appendChild(btn);
	recentContainer.appendChild(div);
};

const handleFocus = () => {
	const loadRecentSearch = JSON.parse(localStorage.getItem('movie'));
	if (loadRecentSearch !== null) {
		loadRecentSearch.forEach(movie => paintRecentSearch(movie));
	}
};

form.addEventListener('submit', handleSubmit);
input.addEventListener('focus', handleFocus);

// response false인 경우 error가 alert나 이런거로 화면에 뜨게하자
