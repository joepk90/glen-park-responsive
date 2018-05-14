(function($){
    $.fn.extend({

		portfolioSlide: function() {

			var mainCont = this;
			var ulCont = this.children('ul');

			ulCont.children('li:first').next().addClass('next');
			ulCont.children('li:last').addClass('prev');

			//LETS FIND THE TOTAL WIDTH FIRST
			var totalWidth = 0;
			ulCont.children('li').each(function() {

				totalWidth = (totalWidth + jQuery(this).width()) - 30;

			});

			mainCont.parent().children('.more').click(function() {

				var currentLi = ulCont.children('li.next');
				var nextLi = ulCont.children('li.next').next();

				var prevLi = ulCont.children('li.prev');
				var nextPrevLi = ulCont.children('li.prev').next();

				if(nextLi.length == 0) { nextLi = ulCont.children('li:first'); }
				if(nextPrevLi.length == 0) { nextPrevLi = ulCont.children('li:first'); }

				//Calculate how many items are in front of this guy
				var i = 0;
				var currentGone = 0;
				ulCont.children('li').each(function() {

					if(jQuery(this).attr('class') == 'next') {

						currentGone = 1;

					}

					if(currentGone === 0) {

						i++;

					}

				});

				//Calculate the width of the items in front of this guy
				var scrollWidth = 0;
				ulCont.children('li:lt('+i+')').each(function() {

					scrollWidth = (scrollWidth - jQuery(this).width()) - 30;

				});

				//animates our UL
				ulCont.stop().animate({ left: scrollWidth }, 200, function() {

					currentLi.removeClass('next');
					nextLi.addClass('next');

					prevLi.removeClass('prev');
					nextPrevLi.addClass('prev');

				});

			});

			mainCont.parent().children('.minus').click(function() {

				var prevLi = ulCont.children('li.prev');
				var nextPrevLi = ulCont.children('li.prev').prev();
				var currentLi = ulCont.children('li.next');
				var nextLi = ulCont.children('li.next').prev();

				if(nextPrevLi.length === 0) { nextPrevLi = ulCont.children('li:last'); }

				if(nextLi.length === 0) { nextLi = ulCont.children('li:last'); }

				//Calculate how many items are in front of this guy
				var i = 0;
				var currentGone = 0;
				ulCont.children('li').each(function() {

					if(jQuery(this).attr('class') == 'prev') {

						currentGone = 1;

					}

					if(currentGone === 0) {

						i++;

					}

				});

				//Calculate the width of the items in front of this guy
				var scrollWidth = 0;
				ulCont.children('li:lt('+i+')').each(function() {

					scrollWidth = (scrollWidth - jQuery(this).width()) - 30;

				});

				//animates our UL
				ulCont.stop().animate({ left: scrollWidth }, 200, function() {

					currentLi.removeClass('next');
					nextLi.addClass('next');

					prevLi.removeClass('prev');
					nextPrevLi.addClass('prev');

				});

			});

		},

		portfolioImageSlider: function() {

			//main vars
			var mainCont = this;
			var contHeight = mainCont.parent().parent().height();

			//lets fix all extra images top position and add our selectors
			if(mainCont.children('a').children('img').length > 1) {

				//inserts our UL selector
				mainCont.append('<ul></ul>');

				//fixes the top position
				mainCont.children('a').children('img:not(.first)').css({ top: contHeight });

				var i = 1;

				//adds our selectors
				mainCont.children('a').children('img').each(function() {

					if(i === 1) {

						mainCont.children('ul').append('<li class="'+i+' currentSel"></li>');

					} else {

						mainCont.children('ul').append('<li class="'+i+'"></li>');

					}

					i++;

				});

			}

			//whenever the user interacts
			mainCont.children('ul').children('li').click(function() {

				//gets our class
				var classTemp = jQuery(this).attr('class').split(' ');

				if(classTemp[1] != 'currentSel') {

					classTemp = classTemp[0];

					//changes the selector
					mainCont.children('ul').children('li.currentSel').removeClass('currentSel');
					jQuery(this).addClass('currentSel');

					//animates the image
					if(mainCont.children('a').children('img:eq('+(classTemp - 1)+')').attr('class') == 'first') {

						mainCont.children('a').children('img:not(.first)').stop().animate({ top: contHeight }, 300);

					} else {

						mainCont.children('a').children('img:not(.first)').css({ 'z-index': 1 });
						mainCont.children('a').children('img:eq('+(classTemp - 1)+')').css({ 'z-index': 2, 'top': contHeight }).stop().animate({ top: 0 }, 300);

					}

				}

			});

		}

	});

})(jQuery);
