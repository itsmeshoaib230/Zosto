import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const categories = [
  "Groceries",
  "Dairy",
  "Fruits & Vegetables",
  "Bakery",
  "Snacks",
  "Beverages",
  "Household",
  "Personal Care",
  "Electronics",
  "Other",
];

const units = ["Pieces", "Kg", "Grams", "Litres", "ML", "Packets", "Boxes", "Dozens"];

const initialForm = {
  name: "",
  category: "",
  brand: "",
  unit: "",
  barcode: "",
  sku: "",
  description: "",
  purchasePrice: "",
  sellingPrice: "",
  mrp: "",
  quantity: "",
  lowStock: "10",
  expiryTracking: "Yes",
  storageLocation: "",
  supplier: "",
  tags: "",
  featured: false,
};

export default function AddProduct({ onAddProduct }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setMessage("");
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = [];
    let warning = "";

    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        warning = "Use JPG, PNG, or WEBP images only.";
        continue;
      }

      if (file.size > 2 * 1024 * 1024) {
        warning = "Each image must be smaller than 2 MB.";
        continue;
      }

      if (images.length + validFiles.length >= 5) {
        warning = "You can upload a maximum of 5 images.";
        break;
      }

      validFiles.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      });
    }

    if (validFiles.length) {
      setImages((previous) => [...previous, ...validFiles]);
    }

    setMessage(warning);
    event.target.value = "";
  };

  const removeImage = (id) => {
    setImages((previous) => {
      const imageToRemove = previous.find((image) => image.id === id);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.url);
      return previous.filter((image) => image.id !== id);
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (!form.category) nextErrors.category = "Select a category.";
    if (!form.unit) nextErrors.unit = "Select a unit.";

    ["purchasePrice", "sellingPrice", "quantity", "lowStock"].forEach((field) => {
      if (form[field] === "" || !Number.isFinite(Number(form[field]))) {
        nextErrors[field] = "Enter a valid number.";
      } else if (Number(form[field]) < 0) {
        nextErrors[field] = "Value cannot be negative.";
      }
    });

    if (form.mrp !== "" && Number(form.mrp) < 0) {
      nextErrors.mrp = "MRP cannot be negative.";
    }

    if (form.sellingPrice !== "" && Number(form.sellingPrice) < 0) {
      nextErrors.sellingPrice = "Selling price cannot be negative.";
    }

    if (form.quantity !== "" && !Number.isInteger(Number(form.quantity))) {
      nextErrors.quantity = "Quantity must be a whole number.";
    }

    if (form.lowStock !== "" && !Number.isInteger(Number(form.lowStock))) {
      nextErrors.lowStock = "Enter a whole number.";
    }

    if (
      form.purchasePrice !== "" &&
      form.sellingPrice !== "" &&
      Number(form.purchasePrice) < 0
    ) {
      nextErrors.purchasePrice = "Purchase price cannot be negative.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setSaving(true);

    const product = {
      id: `PROD-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      unit: form.unit,
      barcode: form.barcode.trim(),
      sku: form.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      description: form.description.trim(),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      mrp: form.mrp === "" ? null : Number(form.mrp),
      quantity: Number(form.quantity),
      lowStock: Number(form.lowStock),
      expiryTracking: form.expiryTracking === "Yes",
      storageLocation: form.storageLocation,
      supplier: form.supplier,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: form.featured,
      images: images.map((image) => image.url),
      createdAt: new Date().toISOString(),
    };

    try {
      if (onAddProduct) {
        onAddProduct(product);
      } else {
        const existing = JSON.parse(localStorage.getItem("zostoProducts") || "[]");
        localStorage.setItem("zostoProducts", JSON.stringify([product, ...existing]));
      }

      setMessage("Product added successfully.");
      setForm(initialForm);
      setImages([]);
      setErrors({});

      setTimeout(() => {
        navigate("/inventory");
      }, 700);
    } catch (error) {
      console.error("Unable to save product:", error);
      setMessage("Unable to save the product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="add-product-page">
      <div className="ap-breadcrumb">
        <button type="button" onClick={() => navigate("/inventory")}>
          Inventory
        </button>
        <span>›</span>
        <span>Add Product</span>
      </div>

      <header className="ap-header">
        <div>
          <h1>Add Product</h1>
          <p>Add a new product to your inventory.</p>
        </div>

        <button
          type="button"
          className="ap-outline-button"
          onClick={() => navigate("/inventory")}
        >
          <span>←</span> Back to Inventory
        </button>
      </header>

      {message && (
        <div
          className={`ap-message ${
            message.includes("successfully") ? "success" : "warning"
          }`}
          role="status"
        >
          {message}
        </div>
      )}

      <form className="ap-layout" onSubmit={handleSubmit} noValidate>
        <div className="ap-column">
          <section className="ap-card">
            <div className="ap-card-heading">
              <span className="ap-heading-icon blue">▣</span>
              <div>
                <h2>Product Details</h2>
                <p>Enter basic information about the product.</p>
              </div>
            </div>

            <div className="ap-fields">
              <label className="ap-field">
                Product Name <b>*</b>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Amul Milk 1L"
                  maxLength={100}
                />
                {errors.name && <small>{errors.name}</small>}
              </label>

              <label className="ap-field">
                Category <b>*</b>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <small>{errors.category}</small>}
              </label>

              <label className="ap-field">
                Brand
                <input
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="e.g. Amul"
                />
              </label>

              <label className="ap-field">
                Unit <b>*</b>
                <select
                  value={form.unit}
                  onChange={(e) => updateField("unit", e.target.value)}
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
                {errors.unit && <small>{errors.unit}</small>}
              </label>

              <label className="ap-field">
                Barcode (Optional)
                <input
                  value={form.barcode}
                  onChange={(e) => updateField("barcode", e.target.value)}
                  placeholder="e.g. 8901262001234"
                />
              </label>

              <label className="ap-field">
                SKU (Optional)
                <input
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="e.g. AMUL001"
                />
              </label>

              <label className="ap-field ap-full">
                Description (Optional)
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Enter product description..."
                  rows={3}
                  maxLength={500}
                />
              </label>
            </div>
          </section>

          <section className="ap-card">
            <div className="ap-card-heading">
              <span className="ap-heading-icon green">₹</span>
              <div>
                <h2>Pricing &amp; Stock</h2>
                <p>Set pricing and stock details.</p>
              </div>
            </div>

            <div className="ap-fields ap-three-columns">
              <label className="ap-field">
                Purchase Price (₹) <b>*</b>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={(e) => updateField("purchasePrice", e.target.value)}
                  placeholder="e.g. 45.00"
                />
                {errors.purchasePrice && <small>{errors.purchasePrice}</small>}
              </label>

              <label className="ap-field">
                Selling Price (₹) <b>*</b>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={(e) => updateField("sellingPrice", e.target.value)}
                  placeholder="e.g. 50.00"
                />
                {errors.sellingPrice && <small>{errors.sellingPrice}</small>}
              </label>

              <label className="ap-field">
                MRP (₹)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.mrp}
                  onChange={(e) => updateField("mrp", e.target.value)}
                  placeholder="e.g. 55.00"
                />
                {errors.mrp && <small>{errors.mrp}</small>}
              </label>

              <label className="ap-field">
                Initial Stock Quantity <b>*</b>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                  placeholder="e.g. 100"
                />
                {errors.quantity && <small>{errors.quantity}</small>}
              </label>

              <label className="ap-field">
                Low Stock Alert <b>*</b>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.lowStock}
                  onChange={(e) => updateField("lowStock", e.target.value)}
                />
                {errors.lowStock && <small>{errors.lowStock}</small>}
              </label>

              <label className="ap-field">
                Expiry Tracking
                <select
                  value={form.expiryTracking}
                  onChange={(e) => updateField("expiryTracking", e.target.value)}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        <div className="ap-column">
          <section className="ap-card">
            <div className="ap-card-heading">
              <span className="ap-heading-icon pink">▧</span>
              <div>
                <h2>Product Images</h2>
                <p>Upload product images (maximum 5 images).</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              hidden
              onChange={handleImageUpload}
            />

            <button
              type="button"
              className="ap-upload-area"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= 5}
            >
              <span className="ap-upload-icon">▧</span>
              <strong>Click to upload images</strong>
              <span>PNG, JPG, WEBP (Max 2 MB each)</span>
              <span>{images.length}/5 images uploaded</span>
            </button>

            {images.length > 0 && (
              <div className="ap-image-grid">
                {images.map((image) => (
                  <div className="ap-image-preview" key={image.id}>
                    <img src={image.url} alt={image.file.name} />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      aria-label={`Remove ${image.file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    className="ap-add-image"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span>＋</span>
                    Add Image
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="ap-card ap-additional-card">
            <div className="ap-card-heading">
              <span className="ap-heading-icon blue">⚙</span>
              <div>
                <h2>Additional Settings</h2>
                <p>Configure additional product details.</p>
              </div>
            </div>

            <div className="ap-fields">
              <label className="ap-field">
                Storage Location (Optional)
                <select
                  value={form.storageLocation}
                  onChange={(e) => updateField("storageLocation", e.target.value)}
                >
                  <option value="">Select Location</option>
                  <option>Main Store</option>
                  <option>Warehouse</option>
                  <option>Refrigerator</option>
                  <option>Display Shelf</option>
                </select>
              </label>

              <label className="ap-field">
                Supplier (Optional)
                <input
                  list="ap-supplier-list"
                  value={form.supplier}
                  onChange={(e) => updateField("supplier", e.target.value)}
                  placeholder="Enter supplier name"
                />
                <datalist id="ap-supplier-list">
                  <option value="Fresh Foods Co." />
                  <option value="Dairy Mart" />
                  <option value="Grain Baskets" />
                  <option value="Snacks Bazaar" />
                </datalist>
              </label>

              <label className="ap-field">
                Tags (Optional)
                <input
                  value={form.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                  placeholder="e.g. dairy, breakfast, essential"
                />
                <span className="ap-hint">Separate tags with commas.</span>
              </label>

              <label className="ap-featured">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                />
                <span>
                  <strong>Featured Product</strong>
                  <small>Highlight this product on your dashboard.</small>
                </span>
              </label>
            </div>

            <div className="ap-form-actions">
              <button
                type="button"
                className="ap-outline-button"
                onClick={() => navigate("/inventory")}
              >
                Cancel
              </button>

              <button type="submit" className="ap-primary-button" disabled={saving}>
                {saving ? "Saving..." : "Add Product"}
              </button>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}