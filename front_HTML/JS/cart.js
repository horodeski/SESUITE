const cartModal = document.getElementById("cartModal");
const cartSection = document.getElementsByClassName("carrinho");
const emplyCart = document.getElementById("alert-cart-emply")
const table = document.getElementById("table");
const modalConfirm = document.getElementById("modalConfirm");
const select = document.querySelector("select")
const unitPrice = document.getElementById("tax");
const contentCart = document.getElementById("contentCart");

const getCart = () => JSON.parse(localStorage.getItem("dbCart")) || [];
const getHistory = () => JSON.parse(localStorage.getItem("dbHistory")) || [];
const getProduct = () => JSON.parse(localStorage.getItem("dbProduct")) || [];
const getCategory = () => JSON.parse(localStorage.getItem("dbCategory")) || [];

const setCart = (dbCart) => localStorage.setItem("dbCart", JSON.stringify(dbCart));
const setHistory = (dbHistory) => localStorage.setItem("dbHistory", JSON.stringify(dbHistory));
const setProducts = (dbProduct) => localStorage.setItem("dbProduct", JSON.stringify(dbProduct));

const readCart = () => getCart();
const readProduct = () => getProduct();
const readCategory = () => getCategory();
const readHistory = () => getHistory();

const products = readProduct();
const cart = readCart();
const categories = readCategory();
const history = readHistory();

for (const product of products) {
    const option = document.createElement('option');
    option.textContent = product.name;
    option.value = product.name;
    select.appendChild(option);
}

const allProductsSection = document.getElementById("all-products");
for (const productItem of products) {
    const card = document.createElement("div");
    card.classList.add("card");

    const content = document.createElement("div");
    content.classList.add("content");

    const title = document.createElement("h3");
    title.textContent = productItem.name;
    content.appendChild(title);

    const category = document.createElement("span");
    category.textContent = `${productItem.category} | ${productItem.taxedUnit} Tax`;
    content.appendChild(category);

    const unidPriceContainer = document.createElement("div");
    unidPriceContainer.classList.add("unid-price");

    const amountSpan = document.createElement("span");

    amountSpan.textContent = productItem.amount > 0 ? `${productItem.amount} (unds.)` : "Not available";

    unidPriceContainer.appendChild(amountSpan);

    const unitPriceSpan = document.createElement("span");
    unitPriceSpan.textContent = `$${productItem.unit}`;
    unidPriceContainer.appendChild(unitPriceSpan);

    content.appendChild(unidPriceContainer);

    const btnPriceUnid = document.createElement("div");
    btnPriceUnid.classList.add("btn-price-unid");

    btnPriceUnid.appendChild(unidPriceContainer);

    card.appendChild(content);
    card.appendChild(btnPriceUnid);

    allProductsSection.appendChild(card);
}

console.log(products)

const productsAllInput = document.getElementById("products-list");
productsAllInput.addEventListener("change", updateProductFields);

function updateProductFields() {
    const selectedProductName = productsAllInput.value;
    const selectedProduct = products.find(product => product.name === selectedProductName);

    if (selectedProduct) {
        const categoryName = selectedProduct.category;
        const category = categories.find(category => category.name === categoryName);

        if (category) {
            const originalUnitPrice = parseFloat(selectedProduct.unit);
            const taxPercentage = parseFloat(category.tax);
            const taxedUnitPrice = (originalUnitPrice * (taxPercentage / 100));

            document.getElementById("tax").value = taxedUnitPrice.toFixed(2);
            document.getElementById("unit").value = originalUnitPrice.toFixed(2);
        }
    }
}

const createCart = (product) => {
    cart.push(product);
    setCart(cart);
    updateCards();
}

const cartToHistory = () => {
    history.push(Object.assign({
        id: Math.random().toString(16).slice(2),
        parseTotal: document.getElementById("parseTotal").value,
        total: document.getElementById("total").value,
        taxValue: document.getElementById("taxValue").value,
        products: cart
    }));
    setHistory(history);
    deleteCart()
}

const isValidFields = () => document.getElementById("form-carrinho").reportValidity();


const addToCart = () => {
    if (isValidFields()) {
        const selectedProductName = document.getElementById("products-list").value;
        const selectedProduct = products.find(product => product.name === selectedProductName);

        if (selectedProduct) {
            const amountInCart = parseInt(document.getElementById("amount").value);
            const availableStock = selectedProduct.amount;

            if (amountInCart <= availableStock) {
                selectedProduct.amount -= amountInCart;
                setProducts(products);

                const cartItem = {
                    product: selectedProduct.name,
                    tax: document.getElementById("tax").value,
                    amount: amountInCart,
                    unit: document.getElementById("unit").value,
                };

                createCart(cartItem);
            } else {
                alert("Not enough stock available for the selected product. Please add fewer items.");
            }
        }
    }
}

function openModal() {
    modalConfirm.classList.remove("hidden");
}

function closeModal() {
    modalConfirm.classList.add("hidden");
}

function openCart() {
    cartModal.classList.remove("hidden");
}

function closeCart() {
    cartModal.classList.add("hidden");
}

const deleteItemCart = (index) => {
    cart.splice(index, 1);
    setCart(cart);
    window.location.reload();
}

const deleteCart = (index) => {
    cart.splice(index);
    setCart(cart);
    window.location.reload();
}

const calculateTaxedUnit = (taxPercentage, originalUnit) => {
    const tax = parseFloat(taxPercentage) / 100;
    const originalUnitValue = parseFloat(originalUnit);
    const taxedUnit = originalUnitValue + (originalUnitValue * tax);
    return taxedUnit.toFixed(2);
}

const verifyEmptyCart = () => {
    if (cart.length > 0) {
        emplyCart.classList.add("hidden");
        contentCart.classList.remove("hidden");
    }
};

const updateCards = () => {
    contentCart.innerHTML = "";
    let taxValue = 0;
    let total = 0;
    let parseTotal = 0;
    verifyEmptyCart();

    cart.forEach((productItem) => {
        const div = document.createElement("div");
        const taxValueAccount = productItem.amount * productItem.tax;
        const totalAccount = productItem.amount * productItem.unit;

        div.innerHTML = `
            <div class="card">
                <div class="content">
                    <h3>${productItem.product}</h3>
                    <span>${productItem.tax} Tax</span>
                </div>
                <div class="btn-price-unid">
                    <div class="unid-price">
                        <span>${productItem.amount} (unds.)</span>
                        <span>$${productItem.unit}</span>
                    </div>
                    <button onclick="deleteItemCart(${cart.indexOf(productItem)})"><i class='bx bx-trash'></i></button>
                </div>
            </div>
        `;
        contentCart.appendChild(div);
        parseTotal += totalAccount;
        taxValue += taxValueAccount;
        total += totalAccount + taxValueAccount
    });
    if (cart.length > 0) {

        const result = document.getElementById("result")
        result.innerHTML = `
            <div>
                <div class="group">
                <span>Total:</span>
                <input disabled id="parseTotal" value="${parseTotal.toFixed(2)}" />
                </div>
                <div class="group tax">
                <span>+ tax:</span>
                <input disabled id="taxValue" value="${taxValue.toFixed(2)}" />
                </div>
                <div class="group">
                <span>Final value:</span>
                <input disabled id="total" value="${total.toFixed(2)}" />
                </div>
                </div>
            <div>
                <button class="secondary-btn" onclick="openModal()">Cancel</button>
                <button onclick="cartToHistory()" class="primary-btn">Finish</button>
            </div>

        `;
    }
};

const cancelCart = (event) => {
    event.preventDefault();
    for (const item of cart) {
        const product = products.find(p => p.name === item.product);
        if (product) {
            product.amount += item.amount;
        }
    }

    cart.length = 0;
    setCart(cart);
    updateCards();
    closeCart();

    setTimeout(() => {
        window.location.reload();
    }, 1000);
};



document.addEventListener("DOMContentLoaded", function () {
    verifyEmptyCart();
    updateCards();
});