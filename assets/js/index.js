const form = document.querySelector('.search-bar__form');
const input = document.querySelector('.search-bar__input');

let recentSearchTerms = [];
let searchId = 0;

const paintRecentSearch = () => {};

const handleFocus = () => {
	const loadRecentSearch = JSON.parse(localStorage.getItem('movie'));
	if (loadRecentSearch !== null) {
		paintRecentSearch();
	}
};

form.addEventListener('submit', handleSubmit);
input.addEventListener('focus', handleFocus);

// response false인 경우 error가 alert나 이런거로 화면에 뜨게하자
