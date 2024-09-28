document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let quan = JSON.parse(localStorage.getItem('quantities')) || {};
    let cartItemsContainer = document.getElementById("cart-items");
    let totalSumElement = document.getElementById("total-sum");

    let totalItemsElement = document.getElementById("total-items");
    let totalAmountElement = document.getElementById("total-amount");

    renderCartItems();

    function renderCartItems() {
        cartItemsContainer.innerHTML = "";
        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `
            <div class="cart-item">
                <h1>NO ITEMS FOUND</h1>
            </div>
            `;
        } else {

            cart.forEach(item => {
                let cartItemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="item-details">
                            <h6>${item.title}</h6>
                        </div>
                        <div class="item-quantity">
                            <button class="qty-btn-dec">-</button>
                            <span class="quantity" id="quantity-${item.id}">${quan[item.id]}</span>
                            <button class="qty-btn-inc">+</button>
                        </div>
                        <div class="item-price">
                            <p id="price-${item.id}">${quan[item.id]} x ${item.price}</p>
                        </div>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });

            updateCartSummary();


            document.querySelectorAll('.qty-btn-inc').forEach(button => {
                button.addEventListener('click', function () {
                    let itemElement = this.closest('.cart-item');
                    let itemId = itemElement.getAttribute('data-id');
                    quan[itemId]++;
                    localStorage.setItem('quantities', JSON.stringify(quan));
                    updateItemDisplay(itemId);
                });
            });

            document.querySelectorAll('.qty-btn-dec').forEach(button => {
                button.addEventListener('click', function () {
                    let itemElement = this.closest('.cart-item');
                    let itemId = itemElement.getAttribute('data-id');
                    if (quan[itemId] > 1) {
                        quan[itemId]--;
                    } else {

                        delete quan[itemId];
                        cart = cart.filter(item => item.id != itemId);
                        localStorage.setItem('cart', JSON.stringify(cart));
                    }
                    localStorage.setItem('quantities', JSON.stringify(quan));
                    updateItemDisplay(itemId);
                });
            });
        }
    }

    function updateItemDisplay(itemId) {

        if (quan[itemId]) {

            document.getElementById(`quantity-${itemId}`).innerText = quan[itemId];
            let item = cart.find(i => i.id == itemId);
            document.getElementById(`price-${itemId}`).innerText = `${quan[itemId]} x ${item.price}`;
        } else {

            document.querySelector(`.cart-item[data-id="${itemId}"]`).remove();
        }


        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
            <div class="cart-item">
                <h1>NO ITEMS FOUND</h1>
            </div>
            `;
        }

        updateCartSummary();
    }

    function updateCartSummary() {
        let totalItems = 0;
        let sum = 0;
        cart.forEach(item => {
            if (quan[item.id]) {
                totalItems += quan[item.id];
                sum += quan[item.id] * item.price;
            }
        });
        totalItemsElement.innerText = totalItems;
        totalSumElement.innerText = sum;
        totalAmountElement.innerText = "$" + (sum + 30);
    }
});