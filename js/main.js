'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.getElementById('logInForm');
const loginInput = document.getElementById('login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const loginWarning = document.querySelector('.login-warning');
const passwordWarning = document.querySelector('.password-warning');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');

let login = localStorage.getItem('userLogin');

const validation = function (str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}

const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ошибка по адресу ${url}, статус ${response.status} `)
    }

    return await response.json()
};

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth () {
  modalAuth.classList.toggle('is-open');
  loginInput.style.border = '';
  loginWarning.style.display = '';
  loginWarning.textContent = '';
}

function authorized() {
  console.log('авторизован');

  function logOut () {
    login = '';

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click',logOut);
    localStorage.removeItem('userLogin')

    checkAuth();
    returnMain ();
  }

  buttonAuth.style.display = 'none';
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click',logOut)
}

function notAuthorized() {

  console.log('не авторизован');

  function logIn (event) {
    event.preventDefault();
    login = loginInput.value;
    if (validation(loginInput.value)) {
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click',toggleModalAuth);
      logInForm.removeEventListener('submit',logIn);
      localStorage.setItem('userLogin',login)
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.border = '1px solid red';
      loginWarning.style.display = 'inline-block';
      loginWarning.textContent = '!'
    }


  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click',toggleModalAuth);
  logInForm.addEventListener('submit',logIn);
}

function checkAuth() {
  if (login) {
    authorized()
  } else {
    notAuthorized()
  }
}

function returnMain () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function createCardRestaurant (restaurant) {

  const { image, kitchen, price, name, stars, products, time_of_delivery:timeOfDelivery } = restaurant;

  const card = `
            <a class="card card-restaurant" 
            data-products="${products}"
            data-info="${[name, price, kitchen, stars]}"
            >
				<img src=${image} alt="image" class="card-image"/>
					<div class="card-text">
						<div class="card-heading">
							<h3 class="card-title">${name}</h3>
							<span class="card-tag tag">${timeOfDelivery} мин</span>
					    </div>
						<div class="card-info">
							<div class="rating">
								${stars}
							</div>
							<div class="price">От ${price} ₽</div>
							<div class="category">${kitchen}</div>
						</div>
					</div>
			</a>
  `;

  cardsRestaurants.insertAdjacentHTML("beforeend", card);

}

function openGoods(event) {
  const target = event.target;

  const restaurant = target.closest('.card-restaurant');

  const [ name, price, kitchen, stars ] = restaurant.dataset.info.split(',');

    restaurantTitle.textContent = name;
    rating.textContent = price;
    minPrice.textContent = kitchen;
    category.textContent = stars;

  if (login&&restaurant) {
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    getData(`./db/${restaurant.dataset.products}`).then(function (data) {
      data.forEach(createCardGood)
    });

  } else {
    toggleModalAuth ()
  }
}

function createCardGood (goods) {

  const { description,id, image, name, price } = goods;

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML("beforeend",`
    <img src=${image} alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">${price} ₽</strong>
			</div>
		</div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant)
  });

  cardsRestaurants.addEventListener('click',openGoods);
  logo.addEventListener('click',function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide')
  });

  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {delay:3000},
  });
}

init();