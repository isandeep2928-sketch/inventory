// Inventory Management System - Working Version

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inventory-form");
  const tableBody = document.getElementById("inventory-body");
  const cancelBtn = document.getElementById("cancel-btn");
  const saveBtn = document.getElementById("save-btn");
  const formTitle = document.getElementById("form-title");

  // Load existing data from localStorage
  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  // Render table
  function renderInventory() {
    tableBody.innerHTML = "";

    if (inventory.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="8" style="text-align:center; color:gray;">No items in inventory</td>`;
      tableBody.appendChild(row);
      return;
    }

    inventory.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.sku}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>${item.supplier}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.location}</td>
        <td>
          <button class="action-btn edit-btn" data-index="${index}">Edit</button>
          <button class="action-btn delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Save to LocalStorage
  function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }

  // Add or Update Item
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("item-id").value;
    const name = document.getElementById("product-name").value.trim();
    const sku = document.getElementById("sku").value.trim();
    const category = document.getElementById("category").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const supplier = document.getElementById("supplier").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const location = document.getElementById("location").value.trim();

    if (!name || !sku || isNaN(quantity) || isNaN(price)) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const duplicate = inventory.some((item, idx) => item.sku === sku && idx != id);
    if (duplicate) {
      alert("Duplicate SKU detected. Please use a unique SKU.");
      return;
    }

    const newItem = { name, sku, category, quantity, supplier, price, location };

    if (id) {
      inventory[id] = newItem;
      alert("Item updated successfully!");
    } else {
      inventory.push(newItem);
      alert("Item added successfully!");
    }

    saveInventory();
    renderInventory();
    form.reset();

    document.getElementById("item-id").value = "";
    saveBtn.textContent = "Add Item";
    formTitle.textContent = "Add Inventory Item";
    cancelBtn.classList.add("hidden");
  });

  // Edit Item
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const index = e.target.dataset.index;
      const item = inventory[index];

      document.getElementById("item-id").value = index;
      document.getElementById("product-name").value = item.name;
      document.getElementById("sku").value = item.sku;
      document.getElementById("category").value = item.category;
      document.getElementById("quantity").value = item.quantity;
      document.getElementById("supplier").value = item.supplier;
      document.getElementById("price").value = item.price;
      document.getElementById("location").value = item.location;

      formTitle.textContent = "Update Inventory Item";
      saveBtn.textContent = "Update Item";
      cancelBtn.classList.remove("hidden");
    }
  });

  // Delete Item
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.dataset.index;
      if (confirm("Are you sure you want to delete this item?")) {
        inventory.splice(index, 1);
        saveInventory();
        renderInventory();
      }
    }
  });

  // Cancel Edit
  cancelBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("item-id").value = "";
    saveBtn.textContent = "Add Item";
    formTitle.textContent = "Add Inventory Item";
    cancelBtn.classList.add("hidden");
  });

  // Initial Load
  renderInventory();
});
