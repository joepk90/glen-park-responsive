function Cart(items) {
    this.items = [];
    this.shippingRegion = null;
    this.shippingTotal = 0;
    this.subtotal = 0;
    this.total = 0;
    this.paypalActions = null;
    this.largeLetterPrices = {
        'region1': 2.52,
        'region2': 3.80,
        'region3': 4.75,
        'region4': 5.05
    };
    this.smallParcelWeightMatrix = {
        'region1': { '1000': 3.50, '2000': 5.50 },
        'region2': { '250': 4.10, '500': 5.80, '750': 7.20, '1000': 8.60, '1250': 9.85, '1500': 11.10, '1750': 12.30, '2000': 13.45 },
        'region3': { '250': 5.15, '500': 8.05, '750': 10.70, '1000': 13.30, '1250': 14.90, '1500': 16.50, '1750': 18.10, '2000': 19.65 },
        'region4': { '250': 5.60, '500': 8.70, '750': 11.40, '1000': 14.05, '1250': 15.85, '1500': 17.75, '1750': 19.60, '2000': 21.40 }
    };
    /* Initialization */
    // init
    // Item
    // addQuantityEventListener
    // addBuynowEventListener
    // addShippingEventListener
    // initialiseWeightArrays
    // setupValidation(paypalActions)
    /* Operations */
    // getItem
    // getItemTotal
    // getWeightBracket
    /* Update Cart Object */
    // updateShippingTotal
    // updateTotalWeight
    // updateSubtotal
    // updateTotal
    /* Update DOM */
    // updateDOMItems
    // updateDOMShipping
    // updateDOMTotal
    /* Errors and debugging */
    // isCartValid
    // toggleValidationMessages
    // checkNaN
    // sendGACartError
    this.getWeightBracket = function (totalWeight, weightBrackets) {
        //console.log(weightBrackets);
        if (weightBrackets.length < 2) {
            return false;
        }
        var mid = Math.ceil(weightBrackets.length / 2);
        if (totalWeight === weightBrackets[mid])
            return weightBrackets[mid];
        if (weightBrackets.length === 2) {
            if (totalWeight > weightBrackets[0] && totalWeight < weightBrackets[1]) {
                return weightBrackets[mid];
            }
        }
        if (totalWeight < weightBrackets[mid]) {
            if (totalWeight > weightBrackets[mid - 1]) {
                return weightBrackets[mid];
            }
            var leftHalf = weightBrackets.slice(0, mid); // Check this logic
            return this.getWeightBracket(totalWeight, leftHalf);
        }
        else if (totalWeight > weightBrackets[mid]) {
            var rightHalf = weightBrackets.slice(mid, weightBrackets.length); // Check this logic
            return this.getWeightBracket(totalWeight, rightHalf);
        }
        return false;
    };
    this.updateShippingTotal = function () {
        if (this.shippingRegion == 1 || this.shippingRegion == 2 || this.shippingRegion == 3 || this.shippingRegion == 4) {
            var AOCPaperback = this.getItem('AOCPaperback');
            var AOCAudioCD = this.getItem('AOCAudioCD');
            var PWPamphlet = this.getItem('PWPamphlet');
            if (AOCAudioCD.quantity < 1 && AOCPaperback.quantity < 1 && PWPamphlet.quantity < 1) {
                // Sanity check
                this.shippingTotal = 0;
            }
            else if (AOCAudioCD.quantity < 2 && AOCPaperback.quantity == 0 && PWPamphlet.quantity < 6) {
                // Custom: if only 1 CD user large letter prices
                var shippingTotal = this.largeLetterPrices['region' + this.shippingRegion];
                this.shippingTotal = shippingTotal;
            }
            else {
                // Find small parcel weight
                var totalWeight = this.updateTotalWeight();
                var weightBrackets = this.smallParcelWeights['region' + this.shippingRegion];
                var weightBracket = this.getWeightBracket(totalWeight, weightBrackets);
                this.shippingTotal = this.smallParcelWeightMatrix['region' + this.shippingRegion][weightBracket];
            }
        }
        else {
            this.shippingTotal = 0;
        }
        return this.shippingTotal;
    };
    this.updateTotalWeight = function () {
        var totalWeight = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var itemTotalWeight = item.quantity * item.weight;
            totalWeight += itemTotalWeight;
        }
        this.totalWeight = totalWeight;
        return this.totalWeight;
    };
    this.updateSubtotal = function () {
        var subtotal = 0;
        for (var i = 0; i < this.items.length; i++) {
            subtotal += this.items[i].total;
        }
        this.subtotal = subtotal;
        return this.subtotal;
    };
    this.updateTotal = function () {
        this.total = this.shippingTotal + this.subtotal;
        return this.total;
    };
    this.init = function () {
        if (items.length < 1) {
            return false;
        }
        this.smallParcelWeights = this.initialiseWeightArrays(this.smallParcelWeightMatrix);
        for (var i = 0; i < items.length; i++) {
            var newItem = new this.Item(items[i].id, items[i].name, items[i].description, items[i].price, items[i].weight);
            this.items[i] = newItem;
            this.addBuynowEventListener(items[i].id);
            this.addQuantityEventListener(items[i].id);
        }
        this.addShippingEventListener();
        //this.addPayNowBtnEventListener();
        this.updateDOMItems();
        this.updateDOMShipping();
        this.updateDOMTotal();
        return true;
    };
    this.Item = function (id, name, description, price, weight) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.weight = weight;
        this.quantity = 0;
        this.total = 0;
    };
    this.getItem = function (itemId) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id === itemId) {
                return this.items[i];
            }
        }
    };
    this.addQuantityEventListener = function (itemId) {
        var el = document.getElementById('quantity' + itemId);
        el.addEventListener('change', function (e) {
            this.quantityEventListenerFnc(e);
        }.bind(this), false);
    };
    this.quantityEventListenerFnc = function (e) {
        var el = e.target;
        var itemId = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
        var quantity = parseInt(el.value) || 0;
        var item = this.getItem(itemId);
        item.quantity = quantity;
        this.updateDOMItems();
        this.updateDOMShipping();
        this.updateDOMTotal();
        this.isCartValid() ? this.enablePaypalButton() : this.disablePaypalButton();
    };
    // add event listeners to individual product buy now buttons
    this.addBuynowEventListener = function (itemId) {
        var el = document.getElementById('buynow' + itemId);
        if (el) {
            el.addEventListener('click', function (e) {
                var itemId = e.target.id;
                this.sendBuyNowButtonOnClickEvent(itemId);
                //
                // Disabled because events aren't firing from programmatic updates to inputs
                //
                /*
                let el = e.target;
                let itemId:string = el.id.replace('buynow', ''); // TODO: improve this with data targets in HTML
                let item = this.getItem(itemId);
                item.quantity++;

                let quantityEl:HTMLInputElement = (<HTMLInputElement>document.getElementById('quantity' + item.id));
                if(quantityEl) {
                    quantityEl.value = item.quantity;
                } else {
                    console.log('Error: Item total element not found.')
                }

                //let cartOffset:number = document.getElementById('buyNow').offsetTop;
                //console.log(cartOffset);
                */
                //window.scrollTo(0, 2650);
                //this.isCartValid() ? this.enablePaypalButton() : this.disablePaypalButton();
            }.bind(this), false);
        }
    };
    // add event listener to shipping radio buttons
    this.addShippingEventListener = function () {
        var el = document.getElementById('shippingOptions');
        var shippingArr = el.getElementsByTagName('input');
        for (var i = 0; i < shippingArr.length; i++) {
            shippingArr[i].addEventListener('change', function (e) {
                var el = e.target;
                var shippingRegion = parseInt(el.value);
                if (this.shippingRegion !== shippingRegion) {
                    this.shippingRegion = shippingRegion;
                    this.updateDOMShipping();
                    this.updateDOMTotal();
                    this.isCartValid() ? this.enablePaypalButton() : this.disablePaypalButton();
                }
            }.bind(this), false);
        }
    };
    this.updateDOMItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            // update cart items totals
            var item = this.items[i];
            var price = item.price;
            var quantity = item.quantity;
            var total = this.getItemTotal(price, quantity);
            item.total = this.checkNaN(item.id + 'Total', total);
            // update total
            var el = document.getElementById('total' + item.id);
            if (el) {
                el.innerHTML = '£' + item.total.toFixed(2);
            }
            else {
                console.log('Error: Item total element not found.');
            }
        }
        this.updateTotalWeight(); // TODO: I don't think this is necessary and can be removed
        var subtotal = this.updateSubtotal();
        subtotal = this.checkNaN('subtotal', subtotal);
        var subtotalEl = document.getElementById('totalSubTotal');
        subtotalEl.innerHTML = '£' + subtotal.toFixed(2);
    };
    this.updateDOMShipping = function (shippingRegion) {
        var shippingTotal = this.updateShippingTotal();
        shippingTotal = this.checkNaN('shippingTotal', shippingTotal);
        var shippingTotalEl = document.getElementById('totalShippingTotal');
        if (shippingTotalEl) {
            shippingTotalEl.innerHTML = '£' + shippingTotal.toFixed(2);
        }
    };
    this.updateDOMTotal = function () {
        var total = this.updateTotal();
        total = this.checkNaN('total', total);
        var totalTotalEl = document.getElementById('totalTotal');
        if (totalTotalEl) {
            totalTotalEl.innerHTML = '£' + total.toFixed(2);
        }
    };
    this.getItemTotal = function (price, quantity) {
        return price * quantity;
    };
    // initalize lists of defined postage weights for searching and retrieving price from pricing matrices
    this.initialiseWeightArrays = function (weightMatrix) {
        var weightArrays = {};
        for (var regionProperty in weightMatrix) {
            var weightArray = [0];
            for (var weightProperty in weightMatrix[regionProperty]) {
                weightArray.push(parseInt(weightProperty));
            }
            weightArrays[regionProperty] = weightArray.sort(function (a, b) { return a - b; });
            ;
        }
        return weightArrays;
    };
    this.isCartValid = function () {
        var itemsQuantity = this.isItemsQuantityValid();
        var subtotal = this.isSubtotalValid();
        var shippingTotal = this.isShippingTotalValid();
        var shippingRegion = this.isShippingRegionValid();
        var total = this.isTotalValid();
        if (!itemsQuantity) {
            if (subtotal) {
                this.sendIsCartValidErrorEvent('itemsQuantity');
            }
            return false;
        }
        if (!subtotal) {
            if (itemsQuantity) {
                this.sendIsCartValidErrorEvent('subtotal');
            }
            return false;
        }
        if (!shippingRegion) {
            // following check is very unlikely
            if (shippingTotal && itemsQuantity && subtotal) {
                this.sendIsCartValidErrorEvent('shippingRegion');
            }
            return false;
        }
        if (!shippingTotal) {
            if (shippingRegion && itemsQuantity && subtotal) {
                this.sendIsCartValidErrorEvent('shippingTotal');
            }
            return false;
        }
        if (!total) {
            if (itemsQuantity && subtotal && shippingRegion && shippingTotal) {
                this.sendIsCartValidErrorEvent('total');
            }
            return false;
        }
        return true;
    };
    this.isItemsQuantityValid = function () {
        var quantity = 0;
        for (var i = 0; i < this.items.length; i++) {
            quantity += this.items[i].quantity;
        }
        if (!(quantity > 0)) {
            console.log("Items quantity not over 0");
            return false;
        }
        return true;
    };
    this.isSubtotalValid = function () {
        if (!(this.subtotal > 0)) {
            console.log("Subtotal not over 0");
            return false;
        }
        return true;
    };
    this.isShippingTotalValid = function () {
        if (this.isItemsQuantityValid()) {
            if (!(this.shippingTotal > 0)) {
                console.log("Shipping total not over 0");
                return false;
            }
        }
        return true;
    };
    this.isShippingRegionValid = function () {
        if (this.shippingRegion != 1 && this.shippingRegion != 2 && this.shippingRegion != 3 && this.shippingRegion != 4) {
            console.log("Please select a shipping country");
            return false;
        }
        return true;
    };
    this.isTotalValid = function () {
        if (!(this.total > 0)) {
            console.log("Sorry there has been an error");
            return false;
        }
        return true;
    };
    this.checkNaN = function (variableName, number) {
        if (isNaN(number)) {
            this.sendNanErrorEvent(variableName);
            return 0;
        }
        return number;
    };
    this.sendNanErrorEvent = function (variableName) {
        var gaObject = {
            'eventCategory': 'jsCart: NaN Error',
            'eventAction': 'Update ' + variableName
        };
        //console.log(gaObject)
        ga('send', 'event', gaObject);
    };
    this.sendIsCartValidErrorEvent = function (variableName) {
        var gaObject = {
            'eventCategory': 'jsCart: isCartValid Error',
            'eventAction': 'Unexpected validity checking ' + variableName + ' dependencies'
        };
        //console.log(gaObject)
        ga('send', 'event', gaObject);
    };
    this.sendBuyNowButtonOnClickEvent = function (variableName) {
        var gaObject = {
            'eventCategory': 'jsCart: Buy Now onClick event',
            'eventAction': variableName + ' Buy Now button onClick'
        };
        //console.log(gaObject)
        ga('send', 'event', gaObject);
    };
    this.setupValidation = function (paypalActions) {
        this.paypalActions = paypalActions;
        this.disablePaypalButton();
    };
    this.toggleValidationMessages = function () {
        var cartItemsInvalid = document.getElementById('cartItemsInvalid'), shippingTotalInvalid = document.getElementById('shippingTotalInvalid'), cartTotalInvalid = document.getElementById('cartTotalInvalid'), shippingCartErrorActive = cartItemsInvalid.classList.contains('show-error'), shippingTotalErrorActive = shippingTotalInvalid.classList.contains('show-error'), cartTotalErrorActive = cartTotalInvalid.classList.contains('show-error'), itemsQuantity = this.isItemsQuantityValid(), subtotal = this.isSubtotalValid(), shippingTotal = this.isShippingTotalValid(), shippingRegion = this.isShippingRegionValid(), total = this.isTotalValid();
        if (this.isCartValid()) {
            cartItemsInvalid.classList.remove("show-error");
            shippingTotalInvalid.classList.remove("show-error");
            cartTotalInvalid.classList.remove("show-error");
            this.enablePaypalButton();
        }
        else {
            if (!itemsQuantity || !subtotal) {
                if (!shippingCartErrorActive) {
                    cartItemsInvalid.classList.add("show-error");
                }
            }
            else if (shippingCartErrorActive) {
                cartItemsInvalid.classList.remove("show-error");
            }
            if (!shippingTotal || !shippingRegion) {
                if (!shippingTotalErrorActive) {
                    shippingTotalInvalid.classList.add("show-error");
                }
            }
            else if (shippingTotalErrorActive) {
                shippingTotalInvalid.classList.remove("show-error");
            }
            if (itemsQuantity && subtotal && shippingTotal && shippingRegion && !this.isTotalValid()) {
                cartTotalInvalid.classList.add("show-error");
            }
        }
    };
    this.enablePaypalButton = function () {
        var paypalButtom = document.getElementById('paynowButton'), paypalButtonInactive = paypalButtom.classList.contains('disabled');
        this.paypalActions.enable();
        // TODO: Setup Function to remove error messages on event handlers
        // let cartItemsInvalid = document.getElementById('cartItemsInvalid'),
        // 	shippingTotalInvalid = document.getElementById('shippingTotalInvalid'),
        // 	cartTotalInvalid = document.getElementById('cartTotalInvalid'),
        // 	shippingCartErrorActive = cartItemsInvalid.classList.contains('show-error'),
        // 	shippingTotalErrorActive = shippingTotalInvalid.classList.contains('show-error'),
        // 	CartTotalErrorActive = cartTotalInvalid.classList.contains('show-error');
        // 	cartItemsInvalid.classList.remove("show-error");
        // 	shippingTotalInvalid.classList.remove("show-error");
        // 	cartTotalInvalid.classList.remove("show-error");
        if (paypalButtonInactive) {
            paypalButtom.classList.remove("disabled");
        }
    };
    this.disablePaypalButton = function () {
        var paypalButtom = document.getElementById('paynowButton'), paypalButtonInactive = paypalButtom.classList.contains('disabled');
        this.paypalActions.disable();
        if (!paypalButtonInactive) {
            paypalButtom.classList.add("disabled");
        }
    };
    this.paymentSuccessful = function () {
        var el = document.getElementById('paymentSuccessful');
        el.classList.remove("disabled");
    };
}
/*
let i1 = { id:'AOCPaperback', price: 12.5 };
let i2 = { id: 'AOCAudioCD', price: 10 };
let i3 = { id: 'PWPamphlet', price: 2.5 };

let itemArray = [i1,i2,i3];

let cart = new Cart(itemArray);
cart.init();
*/
