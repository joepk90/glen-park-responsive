function headerSlider() {

	//first item is current
	jQuery('#header-slider-content ul li:first').addClass('current');

	headerHeight = jQuery('#header').height();
	jQuery('#header-slider-bg').css({ height: headerHeight });

	//first background images
	var bgImg = jQuery('#header-slider-content ul li.current').children('.header-bg').text().split(',');
	jQuery('#header-slider-bg').css({ background: '#'+bgImg[0] }).children('img').attr('src', bgImg[1]).addClass('current');

	var intSlide = 	setInterval( callNextHeaderSlide(), 10000);


}

function callNextHeaderSlide() {

	var next = jQuery('#header-slider-content ul li.current').next();
	var current = jQuery('#header-slider-content ul li.current');

	if(next.length === 0) {

		next = jQuery('#header-slider-content ul li:first');

	}

	current.stop().animate({ opacity: 0 }, 200, function() {

		current.removeClass('current').hide();

		next.css({ display: 'block', opacity: 0 }).stop().animate({ opacity: 1 }, 800, function() {

			next.addClass('current');

		});

	headerHeight = jQuery('#header').height();
	jQuery('#header-slider-bg').css({ height: headerHeight });

});

	var bgImg = next.children('.header-bg').text().split(',');
	jQuery('#header-slider-bg').append('<img src="'+bgImg[1]+'" alt="" style="display: none;" />');
	jQuery('#header-slider-bg img.current').stop().animate({ opacity: 0 }, 200, function() {

		jQuery(this).remove();

	});

	jQuery('#header-slider-bg').stop().animate({ 'backgroundColor': '#'+bgImg[0] }, 400);

	jQuery('#header-slider-bg img:not(.current)').fadeIn(800, function() {

		jQuery(this).addClass('current');

	});

}
