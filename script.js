document.addEventListener("DOMContentLoaded", () => {

    const supabaseUrl = "https://pyjnkrdxzorwbzljsnzq.supabase.co";
    const supabaseKey = "sb_publishable_H_naJa1O6u3KdN9-da88RA_WOlcraO0";
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    const productsGrid = document.getElementById("productsGrid");
    const cartCount = document.getElementById("cartCount");
    const whatsappBtn = document.getElementById("whatsappBtn");

    let products = [];
    let cart = [];
    let isAdmin = false;

    const adminAddForm = document.getElementById("adminAddForm");
    const exitAdminBtn = document.getElementById("exitAdminBtn");
    const newProductName = document.getElementById("newProductName");
    const newProductPrice = document.getElementById("newProductPrice");
    const createProductBtn = document.getElementById("createProductBtn");

    // ================= CARGAR PRODUCTOS DESDE SUPABASE =================

    async function loadProducts() {
        const { data, error } = await supabaseClient
            .from("Productos") // EXACTO como tu tabla
            .select("*");

        if (error) {
            console.log("Error cargando productos:", error);
            return;
        }

        products = data;
        renderProducts();
    }

    // ================= RENDER =================

    function renderProducts() {
        productsGrid.innerHTML = "";

        products.forEach((product) => {

            const card = document.createElement("div");
            card.classList.add("product-card");

            if (isAdmin) {
                card.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button class="delete-btn">🗑 Eliminar</button>
                `;

                card.querySelector(".delete-btn").addEventListener("click", async () => {

                    await supabaseClient
                        .from("Productos")
                        .delete()
                        .eq("id", product.id);

                    loadProducts();
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

    // ================= ADMIN 7 TOQUES =================

    let tapCount = 0;
    let tapTimer;
    const title = document.querySelector(".brand");

    title.addEventListener("click", () => {

        tapCount++;
        clearTimeout(tapTimer);

        tapTimer = setTimeout(() => {
            tapCount = 0;
        }, 2000);

        if (tapCount === 7) {

            const pass = prompt("Modo Admin - Ingrese contraseña:");

            if (pass === "donortiz123") {
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

    if (exitAdminBtn) {
        exitAdminBtn.addEventListener("click", () => {
            isAdmin = false;
            adminAddForm.style.display = "none";
            renderProducts();
        });
    }

    // ================= AGREGAR PRODUCTO =================

    if (createProductBtn) {
        createProductBtn.addEventListener("click", async () => {

            const name = newProductName.value.trim();
            const price = parseInt(newProductPrice.value);

            if (!name || isNaN(price)) {
                alert("Completa bien los datos");
                return;
            }

            await supabaseClient
                .from("Productos")
                .insert([{ name, price }]);

            newProductName.value = "";
            newProductPrice.value = "";

            loadProducts();
        });
    }

    // ================= WHATSAPP =================

    whatsappBtn.addEventListener("click", () => {

        if (cart.length === 0) {
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

        const numero = "598098765641";
        const url = `https://wa.me/${numero}?text=${mensaje}`;

        window.open(url, "_blank");
    });

    // CARGAR AL INICIAR
    loadProducts();
});