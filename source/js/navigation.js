(function($) {
    $(function() {

			function menuHovers() {

				//wrap H6 with spans
				jQuery('#content h6').each(function() {

					jQuery(this).html('<span>'+jQuery(this).text()+'</span>');

				});

				//main vars
				var liLen = jQuery('#menu li:not(#menu li ul li)').length;
				var startOpacity = (10 - liLen);

				//sets the initial opacity and adds a class to them to indicate the initial opacity so we can access it later
				var i = startOpacity;
				var i2 = 1;

				jQuery('#menu li:not(#menu li ul li)').each(function() {

					jQuery(this).attr('id', 'menu_'+i2);
					jQuery(this).prepend('<span></span><span class="hover"></span>');
					jQuery(this).children('span').css({ opacity: '.'+i }).addClass(''+i);
					i++; i2++;

				});

				jQuery('#menu li ul li').each(function() {

					jQuery(this).prepend('<span></span>');

				});

				//hover effects
				jQuery('#menu li:not(#menu li ul li)').hover(function() {

					jQuery('#menu li.current span').stop().animate({ opacity: 0 }, 200);

					var curTemp = jQuery(this).attr('id').split('_');
					var current = curTemp[1];
					var current1 = (current-1)+2;

					var pos = (liLen - current);
					var initialOp = ((startOpacity - 1) + pos);
			    var initOp;

					if(current > 1) {

						initOp = (startOpacity-2);

						for(i=current1; i<=liLen; i++) {

							jQuery('#menu_'+i).children('span:not(.hover)').stop().animate({ opacity: '.'+initOp }, 200);
							initOp++;

						}

						var pos2 = (pos-1)+2;
						initOp2 = (startOpacity-2)+pos2;

						for(i=1;i<current;i++) {

							jQuery('#menu_'+i).children('span:not(.hover)').stop().animate({ opacity: '.'+initOp2 }, 200);
							initOp2++;

						}

					} else {

						initOp = (startOpacity-2);

						for(i=current1; i<=liLen; i++) {

							jQuery('#menu_'+i).children('span:not(.hover)').stop().animate({ opacity: '.'+initOp }, 200);
							initOp++;

						}

					}

					jQuery(this).children('.hover').css({ display: 'block', opacity: 0 });
					jQuery(this).children('.hover').stop().animate({ opacity: 1 }, 200);

				}, function() {

					jQuery('#menu li span.hover').stop().animate({ opacity: 0 }, 200);
					var backOp2 = jQuery('#menu li.current span').attr('class');
					jQuery('#menu li.current span').stop().animate({ opacity: '.'+backOp2 }, 400);

				});

				jQuery('#menu li ul li').hover(function() {

					jQuery(this).children('span').css({ display: 'block', opacity: 0 }).stop().animate({ opacity: 1 }, 200);

				}, function() {

					jQuery(this).children('span').stop().animate({ opacity: 0 }, 200, function() {

						jQuery(this).hide();

					});

				});

				jQuery('#menu').children('li').hover(function() {

					jQuery(this).children('ul:first').stop().css({ display: 'block', opacity: 0 }).animate({ opacity: 1 }, 400);

				}, function() {

					jQuery(this).children('ul:first').stop().animate({ opacity: 0 }, 400, function() {

						jQuery(this).hide();

					});

				});

			}





			function hideShowSubmenu() {

				if($.cookie('show-submenu') == null) { $.cookie("show-submenu", true); }

				if($.cookie('show-submenu') == 'false') { jQuery('#submenu').hide(); jQuery('#show-hide-submenu').addClass('show-submenu'); }

				jQuery('#show-hide-submenu').click(function() {

					if(jQuery(this).attr('class') == '') {

						jQuery('#submenu').fadeOut(200);
						jQuery(this).addClass('show-submenu');

						$.cookie("show-submenu", false);

					} else {

						jQuery('#submenu').fadeIn(200);
						jQuery(this).removeClass('show-submenu');

						$.cookie("show-submenu", true);

					}

				});

			}

			  menuHovers();

		});
})(jQuery);
