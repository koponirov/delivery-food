const basketButton = document.querySelector('#basket-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const toggleIsActive = function () {
    modal.classList.toggle('is-active')
};

basketButton.addEventListener('click',toggleIsActive);
close.addEventListener('click',toggleIsActive);

new WOW().init();