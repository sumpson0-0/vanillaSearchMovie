const body = document.querySelector('body');

const form = document.querySelector('.search-area__form');
const input = document.querySelector('.search-area__input');
const recentContainer = document.querySelector('.recent-items');
const searchBoundary = document.querySelector('.search-boundary');
const info = document.querySelector('.search-info');
const btn = document.querySelector('.item__btn');

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
		input.blur();
		removeRecentItems();
	}
	// getMovies(inputText);
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
	div.id = movie.id;
	div.className = 'recent-item';
	const text = document.createElement('p');
	if (movie.text.length > 12) {
		text.innerText = movie.text.substr(0, 12) + '...';
	} else {
		text.innerText = movie.text;
	}
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
	if (loadRecentSearch === null) {
		console.log('없음');
	}
	if (loadRecentSearch !== null) {
		console.log('있음');
		input.removeEventListener('focus', handleFocus);
		if (loadRecentSearch.length > 5) {
			console.log('있고 5넘음');
			const newRecentSearch = loadRecentSearch.filter(movie => movie.id !== 1);
			searchBoundary.classList.add('show');
			info.classList.add('show');
			newRecentSearch.forEach(movie => paintRecentSearch(movie));
		} else {
			console.log('있는데 5안넘음');
			searchBoundary.classList.add('show');
			info.classList.add('show');
			loadRecentSearch.forEach(movie => paintRecentSearch(movie));
		}
	}
};

const removeRecentItems = () => {
	searchBoundary.classList.remove('show');
	info.classList.remove('show');
	recentSearchTerms = [];
	recentContainer.innerHTML = '';
	input.addEventListener('focus', handleFocus);
};

const handleBtnClick = event => {
	console.log(event.target, event.currentTarget);
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
		return;
	} else if (target.className == 'item__text') {
		console.log('search 내부임');
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

// response false인 경우 error가 alert나 이런거로 화면에 뜨게하자
// recent searches 나올 때 부드럽게 나오게하기

// 로컬스토리지를 삭제할필요가 없다.왜냐면 loadRecentSearch에 중첩안되고 잘 쌓여만 있으면
// setItem 할 때 movie자체가  loadRecentSearch 내용으로 덮어씌워지기 때문.
// loadRecentSearch에 중첩안되게 만드는 거에 중점을 둬야 한다.
// 그리고 중첩이 되지 않게 하려면, 페인트부분이 겹치지만 않으면 됨. 페인트된 최근 검색어가 다시 save 되는 구조라서.

// 로컬말고 loadRecentSearch를 비워야겠는데? 중첩 안되게..?
// 로컬스토리지, 페인트에 중첩이 문제가 아니라 애초에 loadRecentSearch가 문제엿네..뒤에서 쌓이고 있었ㅇㅁ..대박
