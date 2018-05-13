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
				    	description += ' & ';
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
