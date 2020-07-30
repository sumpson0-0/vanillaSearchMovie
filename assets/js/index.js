const form = document.querySelector('.search-bar__form');
const input = document.querySelector('.search-bar__input');

const handleSubmit = async () => {
	event.preventDefault();
	const search = await input.value;
	getMovies(search);
};

form.addEventListener('submit', handleSubmit);

// response false인 경우 error가 alert나 이런거로 화면에 뜨게하자
