document.addEventListener("DOMContentLoaded", () => {

    const productsGrid = document.getElementById("productsGrid");
    const cartCount = document.getElementById("cartCount");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const whatsappFloat = document.querySelector(".whatsapp-float");
let products = JSON.parse(localStorage.getItem("products")) || [
    { name: "Pollo Entero", price: 250 },
    { name: "Muslos de Pollo (kg)", price: 320 },
    { name: "Pechuga (kg)", price: 380 },
    { name: "Carne Vacuna (kg)", price: 520 },
    { name: "Docena de Huevos", price: 180 },
    { name: "Bolsa de Hielo", price: 90 }
];

function renderProducts() {
    productsGrid.innerHTML = "";

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        if(isAdmin){
            card.innerHTML = `
                <input type="text" value="${product.name}" class="edit-name">
                <input type="number" value="${product.price}" class="edit-price">
                <button class="save-btn">Guardar</button>
                <button class="delete-btn">🗑</button>
            `;

            card.querySelector(".delete-btn").addEventListener("click", () => {
                products.splice(index, 1);
                localStorage.setItem("products", JSON.stringify(products));
                renderProducts();
            });

        } else {
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="add-btn">Agregar al carrito</button>
            `;

            card.querySelector(".add-btn").addEventListener("click", () => {
                cart.push(product);
                cartCount.textContent = cart.length;
            });
        }

        productsGrid.appendChild(card);
    });
}
    let cart = [];
    let isAdmin = false;

    const adminAddForm = document.getElementById("adminAddForm");
    const exitAdminBtn = document.getElementById("exitAdminBtn");
    const newProductName = document.getElementById("newProductName");
    const newProductPrice = document.getElementById("newProductPrice");
    const createProductBtn = document.getElementById("createProductBtn");

    // ================= 7 TOQUES ADMIN =================

    let tapCount = 0;
    let tapTimer;
    const title = document.querySelector(".brand");

    title.addEventListener("click", () => {

        tapCount++;
        clearTimeout(tapTimer);

        tapTimer = setTimeout(() => {
            tapCount = 0;
        }, 2000);

        if(tapCount === 7){

            const pass = prompt("Modo Admin - Ingrese contraseña:");

            if(pass === "donortiz123"){
                isAdmin = true;
                adminAddForm.style.display = "block";
                renderProducts();
                alert("Modo admin activado 🔥");
            } else {
                alert("Contraseña incorrecta");
            }

            tapCount = 0;
        }
    });

    // ================= SALIR ADMIN =================

    if(exitAdminBtn){
        exitAdminBtn.addEventListener("click", () => {
            isAdmin = false;
            adminAddForm.style.display = "none";
            renderProducts();
            alert("Modo admin desactivado");
        });
    }

    // ================= AGREGAR PRODUCTO =================

    if(createProductBtn){
        createProductBtn.addEventListener("click", () => {

            const name = newProductName.value.trim();
            const price = parseInt(newProductPrice.value);

            if(!name || isNaN(price)){
                alert("Completa bien los datos");
                return;
            }

            products.push({ name, price });
            localStorage.setItem("products", JSON.stringify(products));

            newProductName.value = "";
            newProductPrice.value = "";
            
            renderProducts();
    });
}


whatsappBtn.addEventListener("click", () => {

    if(cart.length === 0){
        alert("El carrito está vacío");
        return;
    }

    let mensaje = "Hola, quiero pedir:%0A%0A";
    let total = 0;

    cart.forEach(product => {
        mensaje += `- ${product.name} - $${product.price}%0A`;
        total += product.price;
    });

    mensaje += `%0ATotal: $${total}`;

    const numero = "598098765641"; // PONÉ TU NÚMERO REAL
    const url = `https://wa.me/${numero}?text=${mensaje}`;

    window.open(url, "_blank");
});
renderProducts();
});


