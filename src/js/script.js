"use strict";

window.addEventListener("DOMContentLoaded", () => {
	// Показ скрытого меню

	const hamburger = document.querySelector(".hamburger"),
		menu = document.querySelector(".menu");

	hamburger.addEventListener("click", () => {
		menu.classList.add("active");
	});

	window.addEventListener("click", (e) => {
		if (e.target.classList.contains("menu__close__img") || e.target.classList.contains("menu__overlay")) {
			menu.classList.remove("active");
		}
	});

	const navList = document.querySelector(".menu__list");

	navList.addEventListener("click", (e) => {
		if (e.target.parentElement.classList.contains("menu__link")) {
			menu.classList.remove("active");
		}
	});

	// Анимация кнопок первого экрана

	const btnPortfolio = document.querySelector("#btn_portfolio");
	const btnAboutMe = document.querySelector("#btn_about_me");

	function addActiceClass(selector) {
		selector.classList.add("btn_active");
		selector.classList.remove("btn_noneActive");
	}

	function removeActiveClass(selector) {
		selector.classList.remove("btn_active");
		selector.classList.add("btn_noneActive");
	}

	btnAboutMe.addEventListener("mouseover", (e) => {
		addActiceClass(e.target);
		removeActiveClass(btnPortfolio);
	});

	btnPortfolio.addEventListener("mouseover", (e) => {
		addActiceClass(e.target);
		removeActiveClass(btnAboutMe);
	});

	// Табы для портфолио

	const portfolioImgs = document.querySelectorAll(".portfolio__img");
	const portfolioList = document.querySelector(".portfolio__list_items");
	const portfolioItems = document.querySelectorAll(".portfolio__list_item");

	const hidePortfolioImg = function () {
		portfolioImgs.forEach((item) => {
			item.classList.add("hidePortfolioImg");
			item.classList.remove("showPortfolioImg", "fade");
		});

		portfolioItems.forEach((item) => item.classList.remove("portfolio__list_item-active"));
	};

	const showPortfolioImg = function (i = 0) {
		portfolioImgs[i].classList.add("showPortfolioImg", "fade");
		portfolioImgs[i].classList.remove("hidePortfolioImg");

		portfolioItems[i].classList.add("portfolio__list_item-active");
	};

	hidePortfolioImg();
	showPortfolioImg();

	portfolioList.addEventListener("click", (e) => {
		const target = e.target;

		if (target.classList.contains("portfolio__list_item") && target) {
			portfolioItems.forEach((item, i) => {
				if (target === item) {
					hidePortfolioImg();
					showPortfolioImg(i);
				}
			});
		}
	});
});

// Валидация формы через jquery

$(document).ready(function () {
	$(".contacts__form").validate({
		rules: {
			name: {
				required: true,
				minlength: 2,
			},
			text: "required",
			email: {
				required: true,
				email: true,
			},
			checkbox: "required",
		},
		messages: {
			name: {
				required: "Укажите Ваше имя",
				minlength: jQuery.validator.format("Необходимо не менее {0} символов!"),
			},
			text: "Оставьте Ваше сообщение",
			email: {
				required: "Оставьте Вашу почту",
				email: "Заполните в формате name@domain.com",
			},
			checkbox: {
				required: "Нажмите",
			},
		},
	});

	$(".contacts__form").submit(function (e) {
		e.preventDefault();

		if (!$(this).valid()) {
			return;
		}

		$.ajax({
			type: "POST",
			url: "mailer/smart.php",
			data: $(this).serialize(),
		}).done(function () {
			$(this).find("input").val("");
			$(".contacts__form").trigger("reset");
		});
		return false;
	});
});

// Smooth scroll and page up

const arrow = document.querySelector(".arrow__up"); // секция со стрелкой

const fadeIn = (el, timeout, display = "block") => { // функция показа стрелки на экране
	el.classList.add("showEl");
	el.style.opacity = 0;
	el.style.display = display;
	el.style.transition = `opacity ${timeout}ms`;

	setTimeout(() => {
	  el.style.opacity = 1;
	}, 10);
  };

const fadeOut = (el, timeout) => { // функция скрытия стрелки с экрана
	el.style.opacity = 1;
	el.style.transition = `opacity ${timeout}ms`;
	el.style.opacity = 0;
  
	setTimeout(() => {
	  el.style.display = 'none';
	}, timeout);
	el.classList.remove("showEl");
};

// наблюдатель за секцией resume 

const sectionResume = document.querySelector(".resume"); // секция resume

const showArrow = function(entries) { // показываем стрелку, когда секция resume пересекает границу наблюдателя
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	fadeIn(arrow, 800);
} 

const arrowObserver = new IntersectionObserver(showArrow, { // задаем настройки границы срабатывания наблюдателя
	root: null,
	threshold: 0,
});

arrowObserver.observe(sectionResume); // следим за секцией resume

const sectionPromo = document.querySelector(".promo");

const hideArrow = function(entries) { // скрываем стрелку, когда секция promo пересекает границу наблюдателя
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	if (arrow.classList.contains("showEl")) {
		fadeOut(arrow, 500);
	}

}

const sectionAboutObserver = new IntersectionObserver( hideArrow, { // задаем настройки границы срабатывания наблюдателя
	root: null,
	threshold: 0,
});

sectionAboutObserver.observe(sectionPromo); // следим за секцией promo

const arrowLink = document.querySelector(".arrow__up_link"); // получаем ссылку со стрелкой

arrowLink.addEventListener("click", (e) => {
	e.preventDefault(); // отменяем переход по сслыке к главной странцие

	const arrowId = arrowLink.getAttribute("href"); // получаем значение атрибута ссылки
	
	document.querySelector("" + arrowId).scrollIntoView({ // скроллим к элементу со значением из атрибута ссылки
		behavior: "smooth",
		block: "start",
	});
});


// Наблюдатель за изображениями в секциях about/contact

const Allimgs = document.querySelectorAll("[data-src]");
console.log(Allimgs);

const loadImg = function(entries, observer) {
	const [entry] = entries;

	// исключаем первое срабатывание наблюдателя при загрузке страницы
	if (!entry.isIntersecting) return;

	// меняем пути к изображениям, чем вызовем событие 'load'
	entry.target.srcset = entry.target.dataset.src; // для тега picture секции about - там используется атрибут srcset

	entry.target.src = entry.target.dataset.src; // для остальных тегов img

	// при событии load убираем стиль размытия
	entry.target.addEventListener("load", () => {
		console.log("target");
		entry.target.classList.remove("lazy__img");
	});

	observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: "200px",
});

Allimgs.forEach(img => {
	imgObserver.observe(img);
});


// Наблюдатель за секциями

const allSections = document.querySelectorAll(".section");

const revealSections = function(entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.classList.remove("section_hidden");

	observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSections, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(section => {
	section.classList.add("section_hidden");
	sectionObserver.observe(section);
});

window.addEventListener("load", () => document.querySelector(".promo").classList.remove("blur"));

