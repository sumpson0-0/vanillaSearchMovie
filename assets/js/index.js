const form = document.querySelector('.search-area__form');
const input = document.querySelector('.search-area__input');
const recentContainer = document.querySelector('.recent-items');

let recentSearchTerms = [];
let searchId = 0;

const handleSubmit = () => {
	event.preventDefault();
	const inputText = input.value;
	input.value = '';
	if (inputText.length > 0) {
		saveRecentSearch(inputText);
	}

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
	input.removeEventListener('focus', handleFocus);
};

const handleFocus = () => {
	const loadRecentSearch = JSON.parse(localStorage.getItem('movie'));
	if (loadRecentSearch !== null) {
		loadRecentSearch.forEach(movie => paintRecentSearch(movie));
	}
};

const handleFocusOut = () => {
	console.log('bye');
};

input.addEventListener('focus', handleFocus);
input.addEventListener('focusout', handleFocusOut);
form.addEventListener('submit', handleSubmit);

// response false인 경우 error가 alert나 이런거로 화면에 뜨게하자
// 한번 input 클릭해서 불러와진 경우 또 눌렀을 때 밑에 중복되서 추가로 불러와짐. 이거 해결하자
// 검색 선하고 recent searches는 display none에서 클릭하면 나오게 하는걸로
// recent searches 나올 때 부드럽게 나오게하기

// 보던 링크
// localStorage MDN : https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage

// 1. focus하면 이전 기록나오고
// 2. submit하면 focus 사라지고 -> 어케?
// 3. focusout되면 이벤트발생해서최근 기록이 보여지는 부분도 사라져야 함
// -> submit하면 focus자동으로 사라지니 실행되고, 이용자가 직접 input 외의 부분을 클릭해서 focus가 사라져도 실행 됨
