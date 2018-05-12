var cart;
function initialiseCart() {
	var i1 = { id: 'AOCPaperback', name: 'The Art of Changing', description: 'Paperback Book', price: 12.5, weight: 700 };
	var i2 = { id: 'AOCAudioCD', name: 'The Art of Changing CD', description: 'Audio CD', price: 10, weight: 100};
	var i3 = { id: 'PWPamphlet', name: 'An Interview with Peggy Williams (1916 – 2003)', description: 'Pamphlet', price: 2.5, weight: 10};
	var itemArray = [i1, i2, i3];
	cart = new Cart(itemArray);
	cart.init();
}

function initialisePaypalExpressCheckout() {
	paypal.Button.render({
        env: 'production',

        client: {
            //sandbox:    'Af-ScnK1c8h5X3JeNRqcmGhbUAMToEHgVXtUsz1-TewphtVbc-vFYp158a2HqYktQVCJ6mtEu5nTveJS',
            production: 'AR8Pj1qgSvC_pNVKL-CNsmay2U8Hphc_6nS3MLYHPNHqTT1_2KN99izL-ajj2_XPphnJm7mDhQJMts0e'  // from https://developer.paypal.com/developer/applications/
        },

        style: {
            //label: 'pay',
            size:  'responsive',    // small | medium | large | responsive
            shape: 'rect',     // pill | rect
            //color: 'blue',      // gold | blue | silver | black
            //tagline: false
        },
        validate: function(actions) {
        	cart.setupValidation(actions);
        },

        onClick: function() {
        	cart.toggleValidationMessages();
       	},

        // Pass the payment details for your transaction
        // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters
        payment: function(data, actions) {
            var cartItems = cart.items;
            var items = [];
            var description = '';
            var consecutiveItem = false;
            for(var i = 0; i < cartItems.length; i++) {
            	item = cartItems[i];
            	if(item.quantity > 0) {
	            	var newItem = {
	            		"name": item.name,
				        //"sku": "1",
				        "price": item.price,
				        "currency": "GBP",
				        "quantity": item.quantity,
				        "description": item.description
				    };
				    items.push(newItem);
				    if(consecutiveItem) {
				    	description += ' & '
				    }
				    description += item.name;
				    consecutiveItem = true;
            	}
            }
            var paymentObject = {
                "intent": "sale",
                "transactions": [
                    {
                        "amount": {
                            "total":    cart.total,
                            "currency": 'GBP',
                            "details": {
						          "subtotal": cart.subtotal,
						          "shipping": cart.shippingTotal,
						        }
                        },
                        "description": description,
                        "item_list": {
					        "items": items,
					    }
                    }
                ]
            };
            console.log(paymentObject);
            return actions.payment.create(paymentObject);
        },

        // Display a "Pay Now" button rather than a "Continue" button
        commit: true,

        // Pass a function to be called when the customer completes the payment
        onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function(payment) {
            	cart.paymentSuccessful();
                // The payment is complete!
                // You can now show a confirmation message to the customer
            });

        },

        // Pass a function to be called when the customer cancels the payment

        onCancel: function(data) {
            console.log('The payment was cancelled!');
        }

    }, '#paynowButton');
}

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
		
		if(current > 1) {
			
			var initOp = (startOpacity-2);
			
			for(i=current1; i<=liLen; i++) {
				
				jQuery('#menu_'+i).children('span:not(.hover)').stop().animate({ opacity: '.'+initOp }, 200);
				initOp++;
				
			}
			
			var pos2 = (pos-1)+2;
			var initOp2 = (startOpacity-2)+pos2;
			
			for(i=1;i<current;i++) {
				
				jQuery('#menu_'+i).children('span:not(.hover)').stop().animate({ opacity: '.'+initOp2 }, 200);
				initOp2++;
				
			}
			
		} else {
			
			var initOp = (startOpacity-2);
			
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
		
		jQuery(this).children('span').stop().animate({ opacity: 0 }, 200), function() {
			
			jQuery(this).hide();
			
		};
		
	});
	
	jQuery('#menu').children('li').hover(function() {
	
		jQuery(this).children('ul:first').stop().css({ display: 'block', opacity: 0 }).animate({ opacity: 1 }, 400);
		
	}, function() {
		
		jQuery(this).children('ul:first').stop().animate({ opacity: 0 }, 400, function() {
			
			jQuery(this).hide();
			
		});
		
	});
	
}

function headerSlider() {
	
	//first item is current
	jQuery('#header-slider-content ul li:first').addClass('current');
	
	headerHeight = jQuery('#header').height();
	jQuery('#header-slider-bg').css({ height: headerHeight });
	
	//first background images
	var bgImg = jQuery('#header-slider-content ul li.current').children('.header-bg').text().split(',');
	jQuery('#header-slider-bg').css({ background: '#'+bgImg[0] }).children('img').attr('src', bgImg[1]).addClass('current');
	
	var intSlide = 	setInterval( "callNextHeaderSlide()", 10000);
	
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
		
	})
	
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




/* COOKIES PLUGIN */ 

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};