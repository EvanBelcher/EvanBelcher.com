//Projects modal
var projects = '';

$.getJSON('../docs/projects.json', function (data) {
	projects = data;
});

$('.carousel-item').click(function () {
	showProjectModal();
});

function showProjectModal(title) {
	if (!title) {
		let html = $('.active .carousel-caption').html();
		let title = html.split('</h3>')[0].split('<h3>')[1];
	}
	title = title.replace(/\s+/g, '').toLowerCase();
	if (projects && projects[title]) {
		let project = projects[title];
		$('#projectsModalTitle').html(project['title']);
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
}

$(function () {

	// Deeplink to modals
	// https://gist.github.com/tomhodgins/10414454

	// queryStrip
	function queryStrip(string) {
		string = string.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + string + '=([^&#]*)'),
			results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ''));
	}

	// Show bootstrap modal on load
	// If the modal id="terms", you can show it on page load by appending `?modal=terms` to the URL
	var modalString = queryStrip('modal'),
		modalToShow = '#' + modalString;
	if (modalString !== '') {
		if (modalString.startsWith('projectsModal')) {
			modalString = modalString.substr(13);
			$('html, body').animate({
				scrollTop: $("#projects").offset().top
			}, 100);
			$('#projectsCarousel').carousel(projects[modalString.toLowerCase()]['index']);
			showProjectModal(modalString);
		} else
			$(modalToShow).modal('show');
	}

	$('body').removeClass('no-js');

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
	correctNavbar(true);

	var previousScroll = $(window).scrollTop();

	//Much of this is a fix for navbar flickering on background change due to scrollTop glitch
	function correctNavbar(ignore) {
		if (ignore || Math.abs(previousScroll - $(window).scrollTop()) < 100) {
			if ($(window).scrollTop() + navbarHeight > topofTitle) {
				$(".navbar").css('background', 'url(../img/stressed_linen.png)');
				$('#page-title').css('opacity', 1);
				$('#page-title').addClass('animated fadeIn');
			}
			else {
				$(".navbar").css('background', 'rgba(0,0,0,0.3)');
				$('#page-title').css('opacity', 0);
				$('#page-title').removeClass('animated fadeIn');
			}
		}
		previousScroll = $(window).scrollTop();

		let arrowOpacity = 1 - ($(window).scrollTop() / topofArrow);
		if (arrowOpacity < 0)
			arrowOpacity = 0;
		$('#downarrow').css('opacity', arrowOpacity);

		let headerOpacity = 1 - ($(window).scrollTop() / bottomOfHeader);
		if (headerOpacity < 0)
			headerOpacity = 0;
		$('#header-center').css('opacity', headerOpacity);
	}

	//Toggler background and close on click
	var toggler = false;
	var toggleAble = false;

	$('.navbar-toggler').click(function () {
		toggler = !toggler;
		toggleAble = true;
		fixToggler();
	});

	function fixToggler() {
		if (toggler) {
			$('.navbar').attr('style', 'background: url(../img/stressed_linen.png) !important;');
		} else {
			if (toggleAble) {
				$('.navbar').removeAttr('style');
				correctNavbar();
			}
		}
	}

	$('.navbar a').click(function () {
		if (toggler) {
			$('.navbar-toggler').click();
		}
	});

	//Animations

	$('#header-center').addClass('animated fadeIn');
	$('#downarrow').addClass('animated fadeIn');

	//Apply animation for section content
	$('section .container').waypoint(function (direction) {
		$(`#${this.element.parentNode.id} .container`).css('opacity', 1);
		$(`#${this.element.parentNode.id} .container`).addClass('animated zoomIn');
	}, {
			offset: '95%'
		});

	//Apply animation for resume download button
	$('#resumebutton').waypoint(function (direction) {
		$('#resumebutton').addClass('animated infinite pulse');
	}, {
			offset: '75%'
		});

	//Apply animation for cards
	$('.card').waypoint(function (direction) {
		$(`#${this.element.id}`).css('opacity', 1);
		$(`#${this.element.id}`).addClass('animated fadeInLeft');
	}, {
			offset: '75%'
		});
});

// Apply scroll animation for all local links
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