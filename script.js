let products = [];
document.addEventListener('DOMContentLoaded', () => {
    async function fetchAllProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            products = await response.json();
            display(products);
            console.log("fetched");


        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    console.log("start");
    fetchAllProducts();
    console.log("end");
});

function fetchProducts(productType) {
    if (productType === 'all') {
        display(products);
    } else {
        const filtered = products.filter(product => product.category === productType);
        display(filtered);
    }
}

const buttons = document.querySelectorAll('.button-custom');

buttons.forEach(button => {
    button.addEventListener('click', function () {
        const productType = this.getAttribute('data-product-type');
        fetchProducts(productType);
    });
});


function display(products) {
    const productContainer = document.querySelector('.container.mt-5');

    // Clear previous products if any (to prevent duplicates)
    productContainer.innerHTML = '';

    const productRow = document.createElement('div');
    productRow.className = 'row mt-4';

    products.forEach(product => {
        // Destructure the necessary fields
        let { id, image, title, description, price } = product;

        // Truncate title if it's longer than 10 characters
        if (title.length > 10) {
            title = title.substring(0, 10) + '...';
        }

        // Truncate description if it's longer than 80 characters
        if (description.length > 60) {
            description = description.substring(0, 60) + '...';
        }

        // Create a column div
        const colDiv = document.createElement('div');
        colDiv.className = 'col-12 col-md-4 col-lg-3 mb-4';

        // Create a product card
        const productCard = `
                <div class="card h-100" >
                    <img src="${image}" class="card-img-top" alt="${title}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description} <hr></p>
                        <p class="card-text" style="font-size: 20px; color: grey;">$${price.toFixed(2)}<hr></p>
                       <button class="btn btn-dark w-100">Details</button>
                        <button class="cartButton btn btn-dark w-100 mt-2" data-id="${id}">Add to Cart</button> 
                    </div>
                </div>
            `;

        // Append the card to the column div
        colDiv.innerHTML = productCard;

        // Append column div to the product row
        productRow.appendChild(colDiv);
    });

    // Append the product row to the container
    productContainer.appendChild(productRow);
    toCart();

}

function toCart() {
    let cartButtons = document.querySelectorAll('.cartButton');
    cartButtons.forEach(button => {
        button.addEventListener('click', function () {
            let id = this.getAttribute('data-id');  // Get the index of the item
            let item = products.find(product => product.id === parseInt(id));  // Fetch the corresponding item object
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let quantities = JSON.parse(localStorage.getItem('quantities')) || {}; // Object to track counts
            let isProductInCart = cart.some(cartItem => cartItem.id === item.id);
            if (isProductInCart) {
                quantities[item.id] += 1;
            } else {
                cart.push(item);
                quantities[item.id] = 1;
            }
            localStorage.setItem('quantities', JSON.stringify(quantities));
            localStorage.setItem('cart', JSON.stringify(cart));
            document.getElementById("cartCount").innerHTML = cart.length;
        });
    });
}
