// Sample product data
const products = [
  { id: 1, name: "Product 1", price: 29.99, image: "https://via.placeholder.com/200", featured: true },
  { id: 2, name: "Product 2", price: 19.99, image: "https://via.placeholder.com/200", featured: true },
  { id: 3, name: "Product 3", price: 49.99, image: "https://via.placeholder.com/200", featured: false },
  { id: 4, name: "Product 4", price: 39.99, image: "https://via.placeholder.com/200", featured: false }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to display products
function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>$${product.price.toFixed(2)}</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      container.appendChild(productCard);
  });
}

// Display featured products on home page
if (document.getElementById("featured-products")) {
  const featuredProducts = products.filter(product => product.featured);
  displayProducts(featuredProducts, "featured-products");
}

// Display all products on products page
if (document.getElementById("product-list")) {
  displayProducts(products, "product-list");
}

// Add to cart function
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} has been added to the cart.`);
}

// Handle checkout form submission
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", function(event) {
      event.preventDefault();
      fetch('php/checkout.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `cart=${encodeURIComponent(JSON.stringify(cart))}`
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Order placed successfully!");
              localStorage.removeItem('cart');
              cart = [];
              checkoutForm.reset();
          } else {
              alert(data.message);
          }
      });
  });
}

// Handle login form submission
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      fetch('php/login.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `email=${loginForm.email.value}&password=${loginForm.password.value}`
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Login successful!");
              window.location.href = "index.html";
          } else {
              alert(data.message);
          }
      });
  });
}

// Handle register form submission
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function(event) {
      event.preventDefault();
      fetch('php/register.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `name=${registerForm.name.value}&email=${registerForm.email.value}&password=${registerForm.password.value}`
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Registration successful!");
              window.location.href = "login.html";
          } else {
              alert(data.message);
          }
      });
  });
}
