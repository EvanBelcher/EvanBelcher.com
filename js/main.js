//Projects modal
var projects = '';

$.getJSON('../docs/projects.json', function (data) {
	projects = data;
});

$('.carousel-item').click(function () {
	let html = $('.active .carousel-caption').html();
	let title = html.split('</h3>')[0].split('<h3>')[1];
	$('#projectsModalTitle').html(title);
	if (projects && projects[title]) {
		let project = projects[title];
		let html = project['html'];
		$('#projectsModalLabel').html(html);
		if (project['live'] && project['code']) {
			let codeButton = `<div class="text-center"><a href="${project['code']}" target="_blank" class="btn btn-secondary">See the code</a>`
			let liveButton = `<a href="${project['live']}" target="_blank" class="btn btn-primary" style="margin-left:10px;">See it live</a></div>`;
			$('#projectsModalFooter').html(codeButton + liveButton);
		} else if (project['live']) {
			let liveButton = `<div class="text-center"><a href="${project['live']}" target="_blank" class="btn btn-primary">See it live</a></div>`;
			$('#projectsModalFooter').html(liveButton);
		} else if (project['code']) {
			let codeButton = `<div class="text-center"><a href="${project['code']}" target="_blank" class="btn btn-primary">See the code</a></div>`
			$('#projectsModalFooter').html(codeButton);
		}
	}
	$('#projectsModal').modal();
});

$(function () {

	//Start projects carousel on page load
	$('#projectsCarousel').carousel();

	//Handle deeplink to particular project
	$('a[carouselIndex]').click(function () {
		$('#projectsCarousel').carousel(parseInt($(this).attr('carouselIndex')));
	});

	//Navbar highlighting current section
	$('body').scrollspy({ target: "#mainNav" });

	//Corrects navbar background based on how far we are on the page

	var topofTitle = $(".page-header").offset().top; //gets offset of header
	var bottomOfHeader = $("#header-center h4").offset().top + $("#header-center h4").innerHeight(); //gets offset of header
	var navbarHeight = $(".navbar").outerHeight(); //gets height of header
	var topofArrow = $("#downarrow").offset().top;

	$(window).scroll(function () {
		correctNavbar();
		fixToggler();
	});
	correctNavbar();


	function correctNavbar() {
		if ($(window).scrollTop() + navbarHeight > topofTitle) {
			$(".navbar").css('background', 'url(../img/stressed_linen.png)');
		}
		else {
			$(".navbar").css('background', 'rgba(0,0,0,0.3)');
		}

		let arrowOpacity = 1 - ($(window).scrollTop() / topofArrow);
		if (arrowOpacity < 0)
			arrowOpacity = 0;
		$('#downarrow').css('opacity', arrowOpacity);

		let headerOpacity = 1 - ($(window).scrollTop() / bottomOfHeader);
		if (headerOpacity < 0)
			headerOpacity = 0;
		$('#header-center').css('opacity', headerOpacity);
	}

	var toggler = false;

	$('.navbar-toggler').click(function () {
		toggler = !toggler;
		fixToggler();
	});

	function fixToggler() {
		if (toggler) {
			$('.navbar').attr('style', 'background: url(../img/stressed_linen.png) !important;');
		} else {
			$('.navbar').removeAttr('style');
			correctNavbar();
		}
	}

	$('.navbar a').click(function () {
		if (toggler) {
			$('.navbar-toggler').click();
		}
	});

	$('#header-center').addClass('animated fadeIn');
	$('#downarrow').addClass('animated fadeIn');

	$('section .container').waypoint(function (direction) {
		$(`#${this.element.parentNode.id} .container`).css('opacity', 1);
		$(`#${this.element.parentNode.id} .container`).addClass('animated zoomIn');
	}, {
			offset: '95%'
		});

	$('#resumebutton').waypoint(function (direction) {
		$('#resumebutton').addClass('animated infinite pulse');
	}, {
			offset: '75%'
		});

	$('.card').waypoint(function (direction) {
		$(`#${this.element.id}`).css('opacity', 1);
		$(`#${this.element.id}`).addClass('animated fadeInLeft');
	}, {
			offset: '75%'
		});
});

$('a[href^="#"]').bind('click', function () {
	let anchor = $(this);
	if (anchor.attr('href') != '#projectsCarousel') {
		$('html, body').stop().animate({
			scrollTop: $(anchor.attr('href')).offset().top
		}, 1500, 'easeInOutExpo');
		event.preventDefault();
		window.location.hash = anchor.attr('href');
	}
});