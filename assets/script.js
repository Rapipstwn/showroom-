// 1. Fade-in saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    document.body.style.opacity = 0;
    document.body.style.transition = "opacity 1s ease-in-out";
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 100);
});

// 2. Efek scroll pada kartu produk (produk muncul dari bawah)
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show-card");
        }
    });
}, {
    threshold: 0.1
});

cards.forEach(card => {
    card.classList.add("hide-card");
    observer.observe(card);
});

// 3. Tombol Tambah ke Keranjang (simulasi alert)
const buttons = document.querySelectorAll(".card button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const productName = button.parentElement.querySelector(".card-title").textContent;
        alert(`${productName} berhasil ditambahkan ke keranjang!`);
    });
});

// Ambil data dari localStorage untuk cart baru
function loadCart() {
  let cartItems = JSON.parse(localStorage.getItem("keranjang")) || [];
  
  // Mapping gambar untuk setiap mobil
  const carImages = {
    "BMW E30": "https://i.pinimg.com/1200x/9b/dd/52/9bdd52b0f486f5a7e615be15e1928cb5.jpg",
    "L300 Solar": "https://i.pinimg.com/1200x/7b/23/00/7b23001db88efb1ab68144fa6f550672.jpg",
    "Volvo 960": "https://i.pinimg.com/1200x/a1/a4/e3/a1a4e3d97b99c66ce99dc3eedab0e4d0.jpg",
    "Mercedes-Benz C200": "https://i.pinimg.com/736x/1a/d2/16/1ad21651a2ad7c16754f58fa78db7c63.jpg",
    "Honda Civic Nouva": "https://i.pinimg.com/736x/47/25/c3/4725c3d79c9387914deffe42bc3fdcdf.jpg",
    "Mazda Astina": "https://i.pinimg.com/736x/7c/26/ff/7c26ff7ab6e8735f75f6974c81df91ff.jpg",
    "Toyota Kijang Krista": "https://i.pinimg.com/736x/91/2f/51/912f51ac6664d495bebc9e75a92af636.jpg",
    "Isuzu Panther Hi Grade": "https://i.pinimg.com/736x/91/cf/91/91cf91c56fbd3244c3360b4fdee688a3.jpg",
    "Honda Ferio": "https://i.pinimg.com/1200x/b5/e0/8f/b5e08fb862cd497b0e76ebb39fa85f1f.jpg",
    "BMW E39": "https://i.pinimg.com/736x/43/84/fc/4384fc48edc54765aaad93a1d4bc11c1.jpg",
    "Suzuki Jimny": "https://i.pinimg.com/1200x/99/82/6f/99826f201fbeb4dd1df9f0f6f43c5d65.jpg",
    "Toyota Crown": "https://i.pinimg.com/1200x/b8/1e/87/b81e8704ec7f91eed11ae444bcf38347.jpg",
    "Nissan Terano": "https://i.pinimg.com/736x/7b/03/d5/7b03d5c012c5fc166f8be424fb425f5d.jpg",
    "Mitsubishi Galant": "https://i.pinimg.com/736x/20/27/eb/2027eb9e78ca59a6627d8a4492b7dbd1.jpg",
    "Mitsubishi Pajero V6": "https://i.pinimg.com/736x/50/27/04/502704bb8047eac69396c5db1064dd38.jpg"
  };
  
  // Perbarui item yang tidak memiliki gambar
  let updated = false;
  cartItems.forEach(item => {
    if (!item.gambar && carImages[item.nama]) {
      item.gambar = carImages[item.nama];
      updated = true;
    }
  });
  
  // Simpan kembali jika ada perubahan
  if (updated) {
    localStorage.setItem("keranjang", JSON.stringify(cartItems));
  }
  
  const cartItemsList = document.getElementById("cart-items-list");
  const emptyCart = document.getElementById("empty-cart");
  const totalBelanjaElem = document.getElementById("total-belanja");
  const subtotalElem = document.getElementById("subtotal");
  const taxElem = document.getElementById("tax");
  const cartCountElem = document.getElementById("cart-count");
  const cartValueElem = document.getElementById("cart-value");
  const checkoutBtn = document.getElementById("checkout-btn");
  
  if (!cartItemsList) return; // Jika tidak di halaman cart, keluar
  
  cartItemsList.innerHTML = "";
  
  if (cartItems.length === 0) {
    emptyCart.style.display = "block";
    cartItemsList.style.display = "none";
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = "0.5";
    }
    if (cartCountElem) cartCountElem.textContent = "0";
    if (cartValueElem) cartValueElem.textContent = "Rp 0";
    return;
  }
  
  emptyCart.style.display = "none";
  cartItemsList.style.display = "block";
  
  let totalBelanja = 0;
  
  cartItems.forEach((item, index) => {
    const totalHargaItem = item.harga * item.jumlah;
    totalBelanja += totalHargaItem;
    
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-3">
          <img src="${item.gambar || 'https://i.pinimg.com/1200x/9b/dd/52/9bdd52b0f486f5a7e615be15e1928cb5.jpg'}" 
               alt="${item.nama}" class="cart-item-image">
        </div>
        <div class="col-md-4">
          <h5 class="cart-item-title">${item.nama}</h5>
          <p class="cart-item-desc">Mobil berkualitas dengan performa terbaik</p>
          <span class="cart-item-price">Rp ${item.harga.toLocaleString()}</span>
        </div>
        <div class="col-md-3">
          <div class="quantity-control">
            <label class="quantity-label">Jumlah:</label>
            <div class="quantity-input-group">
              <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
              <input type="number" class="quantity-input" value="${item.jumlah}" min="1" 
                     onchange="setQuantity(${index}, this.value)">
              <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
          </div>
        </div>
        <div class="col-md-2 text-end">
          <div class="cart-item-total">Rp ${totalHargaItem.toLocaleString()}</div>
          <button class="remove-btn" onclick="hapusItem(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
    cartItemsList.appendChild(cartItemDiv);
  });
  
  // Update totals
  const subtotal = totalBelanja;
  const biayaAdmin = 500000;
  const pajak = Math.round(totalBelanja * 0.1);
  const totalAkhir = totalBelanja + pajak + biayaAdmin;
  
  if (totalBelanjaElem) totalBelanjaElem.textContent = "Rp" + totalAkhir.toLocaleString();
  if (subtotalElem) subtotalElem.textContent = "Rp" + totalBelanja.toLocaleString();
  if (taxElem) taxElem.textContent = "Rp" + pajak.toLocaleString();
  if (cartCountElem) cartCountElem.textContent = cartItems.length;
  if (cartValueElem) cartValueElem.textContent = "Rp" + totalBelanja.toLocaleString();
  
  // Enable checkout button if there are items
  if (checkoutBtn) {
    if (cartItems.length > 0) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = "1";
      checkoutBtn.onclick = function() {
        window.location.href = "checkout.html";
      };
    } else {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = "0.5";
    }
  }
}

// Tambahkan produk ke keranjang dengan gambar
function pesan(namaProduk, harga) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  let existing = keranjang.find(p => p.nama === namaProduk);
  
  // Mapping gambar untuk setiap mobil
  const carImages = {
    "BMW E30": "https://i.pinimg.com/1200x/9b/dd/52/9bdd52b0f486f5a7e615be15e1928cb5.jpg",
    "L300 Solar": "https://i.pinimg.com/1200x/7b/23/00/7b23001db88efb1ab68144fa6f550672.jpg",
    "Volvo 960": "https://i.pinimg.com/1200x/a1/a4/e3/a1a4e3d97b99c66ce99dc3eedab0e4d0.jpg",
    "Mercedes-Benz C200": "https://i.pinimg.com/736x/1a/d2/16/1ad21651a2ad7c16754f58fa78db7c63.jpg",
    "Honda Civic Nouva": "https://i.pinimg.com/736x/47/25/c3/4725c3d79c9387914deffe42bc3fdcdf.jpg",
    "Mazda Astina": "https://i.pinimg.com/736x/7c/26/ff/7c26ff7ab6e8735f75f6974c81df91ff.jpg",
    "Toyota Kijang Krista": "https://i.pinimg.com/736x/91/2f/51/912f51ac6664d495bebc9e75a92af636.jpg",
    "Isuzu Panther Hi Grade": "https://i.pinimg.com/736x/91/cf/91/91cf91c56fbd3244c3360b4fdee688a3.jpg"
  };
  
  if (existing) {
    existing.jumlah += 1;
    // Pastikan item yang sudah ada juga memiliki gambar
    if (!existing.gambar) {
      existing.gambar = carImages[namaProduk] || "https://i.pinimg.com/1200x/9b/dd/52/9bdd52b0f486f5a7e615be15e1928cb5.jpg";
    }
  } else {
    keranjang.push({ 
      nama: namaProduk, 
      harga: harga, 
      jumlah: 1,
      gambar: carImages[namaProduk] || "https://i.pinimg.com/1200x/9b/dd/52/9bdd52b0f486f5a7e615be15e1928cb5.jpg" // default image
    });
  }

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  alert(`${namaProduk} ditambahkan ke keranjang.`);
}

// Hapus item dari keranjang
function hapusItem(index) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang.splice(index, 1);
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  loadCart();
}

// Update quantity dengan tombol +/-
function updateQuantity(index, change) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  if (keranjang[index]) {
    keranjang[index].jumlah += change;
    if (keranjang[index].jumlah < 1) {
      keranjang[index].jumlah = 1;
    }
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    loadCart();
  }
}

// Set quantity langsung dari input
function setQuantity(index, value) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  if (keranjang[index]) {
    let newQuantity = parseInt(value);
    if (newQuantity < 1) newQuantity = 1;
    keranjang[index].jumlah = newQuantity;
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    loadCart();
  }
}

// Update jumlah beli (untuk kompatibilitas)
function pasangEventJumlah() {
  const inputs = document.querySelectorAll(".jumlah-input");
  inputs.forEach(input => {
    input.addEventListener("change", function () {
      let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
      let i = parseInt(this.dataset.index);
      let val = parseInt(this.value);
      if (val < 1) val = 1;
      keranjang[i].jumlah = val;
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      loadCart();
    });
  });
}

// Jalankan saat halaman cart dimuat
if (window.location.pathname.includes("cart.html")) {
  document.addEventListener("DOMContentLoaded", loadCart);
}

// Initialize search functionality on main page
if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
  document.addEventListener("DOMContentLoaded", initializeSearch);
}

function cariProduk(event) {
  event.preventDefault(); // Mencegah reload halaman

  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll("#products .card");
  const searchResultsInfo = document.getElementById("search-results-info");
  const clearSearchBtn = document.getElementById("clear-search-btn");

  let jumlahDitemukan = 0;

  cards.forEach(card => {
    const nama = card.getAttribute("data-nama").toLowerCase();
    if (nama.includes(input)) {
      card.parentElement.style.display = "block"; // Tampilkan kolom
      jumlahDitemukan++;
    } else {
      card.parentElement.style.display = "none"; // Sembunyikan kolom
    }
  });

  // Update search results info and show/hide clear button
  if (input === "") {
    // Tampilkan semua produk jika input kosong
    cards.forEach(card => {
      card.parentElement.style.display = "block";
    });
    hideSearchResults();
  } else {
    showSearchResults(input, jumlahDitemukan);
  }

  return false; // Cegah form submit
}

// Function to show search results info
function showSearchResults(searchTerm, count) {
  const searchResultsInfo = document.getElementById("search-results-info");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  
  if (searchResultsInfo) {
    if (count > 0) {
      searchResultsInfo.innerHTML = `
        <div class="search-info-content">
          <i class="bi bi-search me-2"></i>
          Menampilkan <strong>${count}</strong> hasil untuk "<strong>${searchTerm}</strong>"
        </div>
      `;
    } else {
      searchResultsInfo.innerHTML = `
        <div class="search-info-content no-results">
          <i class="bi bi-exclamation-circle me-2"></i>
          Tidak ada hasil untuk "<strong>${searchTerm}</strong>"
        </div>
      `;
    }
    searchResultsInfo.style.display = "block";
  }
  
  if (clearSearchBtn) {
    clearSearchBtn.style.display = "inline-block";
  }
}

// Function to hide search results info
function hideSearchResults() {
  const searchResultsInfo = document.getElementById("search-results-info");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  
  if (searchResultsInfo) {
    searchResultsInfo.style.display = "none";
  }
  
  if (clearSearchBtn) {
    clearSearchBtn.style.display = "none";
  }
}

// Function to clear search and show all products
function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll("#products .card");
  
  // Clear search input
  if (searchInput) {
    searchInput.value = "";
  }
  
  // Show all products
  cards.forEach(card => {
    card.parentElement.style.display = "block";
  });
  
  // Hide search results info
  hideSearchResults();
  
  // Focus back to search input
  if (searchInput) {
    searchInput.focus();
  }
}

// Add event listener for real-time search
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    // Real-time search as user types
    searchInput.addEventListener("input", function() {
      const event = { preventDefault: () => {} };
      cariProduk(event);
    });
    
    // Clear search when input is cleared
    searchInput.addEventListener("keyup", function(e) {
      if (e.key === "Escape") {
        clearSearch();
      }
    });
  }
}

// Initialize search when page loads
document.addEventListener("DOMContentLoaded", function() {
  initializeSearch();
});

// Tampilkan checkout dengan layout baru
function tampilkanCheckout() {
  const cartItems = JSON.parse(localStorage.getItem("keranjang")) || [];
  const orderItemsContainer = document.getElementById("checkout-items");
  const subtotalElem = document.getElementById("checkout-subtotal");
  const taxElem = document.getElementById("checkout-tax");
  const totalElem = document.getElementById("checkout-total");
  
  if (!orderItemsContainer) return;
  
  orderItemsContainer.innerHTML = "";
  let subtotal = 0;
  
  if (cartItems.length === 0) {
    orderItemsContainer.innerHTML = `
      <div class="text-center py-4">
        <i class="bi bi-cart-x" style="font-size: 3rem; color: #6c757d;"></i>
        <p class="mt-3 text-muted">Keranjang kosong</p>
        <a href="index.html" class="btn btn-primary">Belanja Sekarang</a>
      </div>
    `;
    return;
  }
  
  cartItems.forEach((item, index) => {
    const itemTotal = item.harga * item.jumlah;
    subtotal += itemTotal;
    
    const orderItem = document.createElement("div");
    orderItem.className = "order-item";
    orderItem.innerHTML = `
      <div class="item-info">
        <h6>${item.nama}</h6>
        <div class="item-details">
          Rp${item.harga.toLocaleString()} × ${item.jumlah}
        </div>
      </div>
      <div class="item-total">
        Rp${itemTotal.toLocaleString()}
      </div>
    `;
    orderItemsContainer.appendChild(orderItem);
  });
  
  // Hitung pajak 10%
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  
  // Update tampilan total
  if (subtotalElem) subtotalElem.textContent = "Rp" + subtotal.toLocaleString();
  if (taxElem) taxElem.textContent = "Rp" + tax.toLocaleString();
  if (totalElem) totalElem.textContent = "Rp" + total.toLocaleString();
}

// Validasi form customer dan proses pembayaran
function prosesPembayaran() {
  // Validasi form customer
  const customerName = document.getElementById("customer-name")?.value.trim();
  const customerPhone = document.getElementById("customer-phone")?.value.trim();
  const customerAddress = document.getElementById("customer-address")?.value.trim();
  const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value;
  
  // Cek apakah ada item di keranjang
  const cartItems = JSON.parse(localStorage.getItem("keranjang")) || [];
  if (cartItems.length === 0) {
    alert("Keranjang kosong! Silakan tambahkan produk terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }
  
  // Validasi input customer
  if (!customerName || !customerPhone || !customerAddress) {
    alert("Mohon lengkapi semua data yang wajib diisi (Nama, Telepon, Alamat)!");
    return;
  }
  
  if (!selectedPayment) {
    alert("Mohon pilih metode pembayaran!");
    return;
  }
  
  // Hitung total pembayaran
  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += item.harga * item.jumlah;
  });
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  
  // Informasi bank berdasarkan pilihan
  const bankInfo = {
    bri: {
      name: "Bank BRI",
      account: "1234-5678-9012-3456",
      accountName: "Showroom Mobil Bekas"
    },
    bca: {
      name: "Bank BCA",
      account: "9876-5432-1098-7654",
      accountName: "Showroom Mobil Bekas"
    },
    btn: {
      name: "Bank BTN",
      account: "5555-4444-3333-2222",
      accountName: "Showroom Mobil Bekas"
    }
  };
  
  const selectedBank = bankInfo[selectedPayment];
  
  // Konfirmasi pesanan
  const orderSummary = `
=== KONFIRMASI PESANAN ===

Data Pembeli:
• Nama: ${customerName}
• Telepon: ${customerPhone}
• Alamat: ${customerAddress}

Pesanan:
${cartItems.map(item => `• ${item.nama} (${item.jumlah}x) - Rp${(item.harga * item.jumlah).toLocaleString()}`).join('\n')}

Total Pembayaran: Rp${total.toLocaleString()}

Metode Pembayaran:
${selectedBank.name}
No. Rekening: ${selectedBank.account}
Atas Nama: ${selectedBank.accountName}

Lanjutkan pesanan?`;
  
  if (confirm(orderSummary)) {
    // Simpan data pesanan (untuk keperluan tracking)
    const orderData = {
      id: 'ORD-' + Date.now(),
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        email: document.getElementById("customer-email")?.value || ''
      },
      items: cartItems,
      payment: {
        method: selectedPayment,
        bank: selectedBank,
        subtotal: subtotal,
        tax: tax,
        total: total
      },
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    // Simpan ke localStorage untuk tracking (opsional)
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Kosongkan keranjang
    localStorage.removeItem("keranjang");
    
    // Tampilkan instruksi pembayaran
    alert(`Pesanan berhasil dibuat!\n\nSilakan transfer ke:\n${selectedBank.name}\nNo. Rekening: ${selectedBank.account}\nAtas Nama: ${selectedBank.accountName}\nJumlah: Rp${total.toLocaleString()}\n\nKirim bukti transfer ke WhatsApp: 0812-3456-7890\n\nTerima kasih!`);
    
    // Redirect ke halaman utama
    window.location.href = "index.html";
  }
}
