document.addEventListener('DOMContentLoaded', () => {
	getRamens();

	// create a form to updates ramens
	createEditForm();

	// attach first ramen to display
	autoAttach();

	// to create a new ramen
	const newramenform = document.getElementById('new-ramen');
	newramenform.addEventListener('submit', (e) => {
		e.preventDefault();
		newRamen();
		newramenform.reset();
	})

	// create delete button to remove ramen from menu
	createDeleteBtn();

	// to update a ramen on the menu
	const editramenform = document.getElementById('edit-ramen');
	editramenform.addEventListener('submit', (e) => {
		e.preventDefault();
		updateRamen();
		editramenform.reset();
	})
});

// for when the page is initially loaded
function getRamens() {
	fetch('http://localhost:3000/ramens')
	.then((r) => r.json())
	.then((ramens) => {
		for (ramen of ramens) {
			addRamentoMenu(ramen);
		}
	})
}

// to add a ramen to the menu
function addRamentoMenu(ramen) {
	const menu = document.getElementById('ramen-menu');
	const img = document.createElement('img');

	img.setAttribute('src', ramen.image);
	img.setAttribute('id', `menu${ramen.id}`);

	menu.appendChild(img);

	img.addEventListener('click', () => {
		showRamen(ramen.id);
	})
}

// shows a selected ramen's info
function showRamen(ID) {
	fetch(`http://localhost:3000/ramens/${ID}`)
	.then((r) => r.json())
	.then((ramen) => {
		const img = document.querySelector('#ramen-detail img');
		const name = document.querySelector('#ramen-detail h2');
		const restaurant = document.querySelector('#ramen-detail h3');
		const rating = document.getElementById('rating-display');
		const comment = document.getElementById('comment-display');

		img.src = ramen.image;
		img.id = ramen.id;
		name.textContent = ramen.name;
		restaurant.textContent = ramen.restaurant;
		rating.textContent = ramen.rating;
		comment.textContent = ramen.comment;
	});
}

// to create a new ramen
function newRamen() {
	const Nname = document.getElementById('new-name');
	const Nrestaurant = document.getElementById('new-restaurant');
	const Nimg = document.getElementById('new-image');
	const Nrating = document.getElementById('new-rating');
	const Ncomment = document.getElementById('new-comment');

	fetch('http://localhost:3000/ramens', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			name: Nname.value,
			restaurant: Nrestaurant.value,
			image: Nimg.value,
			rating: Nrating.value,
			comment: Ncomment.value
		})
	})
	.then((r) => r.json())
	.then((ramen) => {
		addRamentoMenu(ramen);
	});
}

// shows the first ramen on the menu automatically
function autoAttach() {
	fetch('http://localhost:3000/ramens')
	.then((r) => r.json())
	.then((ramens) => {
		showRamen(ramens[0].id);
	})
}

// creating the ramen update field
function createEditForm() {
	const newramenform = document.getElementById('new-ramen');
	const editform = document.createElement('form');
	const title = document.createElement('h4');
	const ratingL = document.createElement('label');
	const ratingI = document.createElement('input');
	const commentL = document.createElement('label');
	const commentI = document.createElement('textarea');
	const btn = document.createElement('input');

	editform.setAttribute('id', 'edit-ramen');
	title.textContent = 'Update the Featured Ramen';
	ratingL.setAttribute('for', 'rating');
	ratingL.textContent = 'Rating: ';
	ratingI.setAttribute('type', 'number');
	ratingI.setAttribute('name', 'rating');
	ratingI.setAttribute('id', 'update-rating');
	commentL.setAttribute('for', 'update-comment');
	commentL.textContent = 'Comment: ';
	commentI.setAttribute('name', 'update-comment');
	commentI.setAttribute('id', 'update-comment');
	btn.setAttribute('type', 'submit');
	btn.setAttribute('value', 'Update');

	editform.appendChild(title);
	editform.appendChild(ratingL);
	editform.appendChild(ratingI);
	editform.appendChild(commentL);
	editform.appendChild(commentI);
	editform.appendChild(btn);
	newramenform.after(editform);
}

// creating a delete button in the ramen info field
function createDeleteBtn() {
	const deletebtn = document.createElement('button');
	const linebreak = document.createElement('br');

	deletebtn.textContent = 'Remove From Menu';
	document.getElementById('comment-display').after(linebreak)
	linebreak.after(deletebtn);

	deletebtn.addEventListener('click', () => {
		deleteRamen();
	});
}

function deleteRamen() {
	const ramenid = document.querySelector('#ramen-detail img').id;
	fetch(`http://localhost:3000/ramens/${ramenid}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(() => {
		document.getElementById(`menu${ramenid}`).remove();
		autoAttach();
	});
}

function updateRamen() {
	const ramenid = document.querySelector('#ramen-detail img').id;
	const newRating = document.getElementById('update-rating');
	const newComment = document.getElementById('update-comment');

	fetch(`http://localhost:3000/ramens/${ramenid}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			rating: newRating.value,
			comment: newComment.value
		})
	})
	.then((r) => r.json())
	.then((ramen) => {
		document.getElementById('rating-display').textContent = ramen.rating;
		document.getElementById('comment-display').textContent = ramen.comment;
	});
}