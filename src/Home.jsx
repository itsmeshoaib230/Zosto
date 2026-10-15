
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Badge,
  IconButton,
  InputAdornment,
  Chip,
  Grid,
  Drawer,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import "./Home.css";

const products = [
  {
    id: 1,
    name: "Rice 25 kg",
    price: 1400,
    category: "Groceries",
    emoji: "🌾",
    tag: "Popular",
    color: "#fff0d5",
  },
  {
    id: 2,
    name: "Pens Box",
    price: 120,
    category: "Stationary",
    emoji: "🖊️",
    tag: "Bestseller",
    color: "#e5edff",
  },
  {
    id: 3,
    name: "Notebook Pack",
    price: 180,
    category: "Stationary",
    emoji: "📒",
    tag: "Value pack",
    color: "#f3e8ff",
  },
  {
    id: 4,
    name: "Cleaning Supplies",
    price: 250,
    category: "Household",
    emoji: "🧴",
    tag: "Essentials",
    color: "#dff7ed",
  },
  {
    id: 5,
    name: "Toor Dal 5 kg",
    price: 650,
    category: "Groceries",
    emoji: "🫘",
    tag: "Popular",
    color: "#fff1df",
  },
  {
    id: 6,
    name: "Soap Pack",
    price: 160,
    category: "Household",
    emoji: "🧼",
    tag: "Daily use",
    color: "#e1f5fe",
  },
  {
    id: 7,
    name: "Cooking Oil 5 L",
    price: 750,
    category: "Groceries",
    emoji: "🫒",
    tag: "Daily needs",
    color: "#fff8cc",
  },
  {
    id: 8,
    name: "School Supplies Kit",
    price: 299,
    category: "Stationary",
    emoji: "✏️",
    tag: "Value pack",
    color: "#ffe4ec",
  },
];

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((previous) => [...previous, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

  const total = cart.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const closeAuth = () => {
    setAuthMode("");
    setEmail("");
    setPassword("");
  };

  return (
    <Box className="zosto-app">
      {/* NAVBAR */}
      <AppBar position="sticky" elevation={0} className="navbar">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="nav-toolbar">
            {/* LOGO */}
            <Typography
              variant="h4"
              className="logo"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              zosto<span>.</span>
            </Typography>

            {/* SEARCH BETWEEN LOGO AND LOGIN */}
           
{/* SEARCH BOX */}
<Box className="nav-search">
  <TextField
    fullWidth
    size="small"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder="Search products..."
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      },
    }}
  />
</Box>

{/* LOCATION BUTTON */}
<Button
  className="location-btn"
  startIcon={<LocationOnIcon />}
  onClick={() => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        alert(
          `Latitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`
        );
      },
      () => alert("Please allow location access in your browser.")
    );
  }}
>
  Location
</Button>


            {/* LOGIN */}
            <Button
              className="login-btn"
              onClick={() => setAuthMode("Login")}
            >
              Login
            </Button>

            {/* SIGN UP */}
            <Button
              variant="contained"
              className="signup-btn"
              onClick={() => setAuthMode("Sign Up")}
            >
              Sign Up
            </Button>

            {/* CART */}
            <IconButton
              className="cart-btn"
              aria-label="Open shopping cart"
              onClick={() => setCartOpen(true)}
            >
              <Badge badgeContent={cart.length} color="warning">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* MOBILE MENU */}
            <IconButton
              className="mobile-menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE MENU DRAWER */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Box className="mobile-drawer">
          <Box className="drawer-heading">
            <Typography variant="h5" className="logo">
              zosto<span>.</span>
            </Typography>

            <IconButton onClick={() => setMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Button
            fullWidth
            onClick={() => {
              setMenuOpen(false);
              setAuthMode("Login");
            }}
          >
            Login
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setMenuOpen(false);
              setAuthMode("Sign Up");
            }}
          >
            Sign Up
          </Button>

          <Button
            fullWidth
            onClick={() => {
              setMenuOpen(false);
              setCartOpen(true);
            }}
          >
            <ShoppingCartIcon sx={{ mr: 1 }} />
            View Cart ({cart.length})
          </Button>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" className="main-container">
        {/* HERO */}
        <Box className="hero">
          <Box className="hero-content">
            <Chip
              label="YOUR DAILY SHOPPING PARTNER"
              className="hero-chip"
            />

            <Typography variant="h2" className="hero-title">
              Everything you need,
              <br />
              in one place.
            </Typography>

            <Typography className="hero-description">
              Groceries, stationary and daily essentials.
              Shop your everyday favourites at Zosto.
            </Typography>

            <Button
              variant="contained"
              className="hero-button"
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Products →
            </Button>
          </Box>

          <Box className="hero-art">
            <div className="hero-circle">🛍️</div>
            <div className="floating-item item-one">🌾</div>
            <div className="floating-item item-two">🖊️</div>
            <div className="floating-item item-three">📦</div>
          </Box>
        </Box>

        {/* CATEGORIES */}
        <Box className="category-section">
          <Typography variant="h5" className="section-title">
            Shop by category
          </Typography>

          <Box className="category-list">
            {[
              { name: "All", emoji: "🛍️" },
              { name: "Groceries", emoji: "🌾" },
              { name: "Stationary", emoji: "✏️" },
              { name: "Household", emoji: "🧹" },
            ].map((category) => (
              <Button
                key={category.name}
                className={`category-button ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span>{category.emoji}</span>
                {category.name}
              </Button>
            ))}
          </Box>
        </Box>

        {/* PRODUCTS */}
        <Box id="products" className="products-section">
          <Box className="products-heading">
            <Box>
              <Typography variant="h4" className="section-title">
                Explore products
              </Typography>

              <Typography className="section-subtitle">
                Find everything you need for everyday life.
              </Typography>
            </Box>

            <Typography className="product-count">
              {filteredProducts.length} products
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {filteredProducts.map((product) => (
              <Grid
                key={product.id}
                size={{ xs: 6, sm: 4, md: 3 }}
              >
                <Card className="product-card">
                  <Box
                    className="product-image"
                    sx={{ backgroundColor: product.color }}
                  >
                    <Chip label={product.tag} className="product-tag" />
                    <span className="product-emoji">
                      {product.emoji}
                    </span>
                  </Box>

                  <CardContent className="product-content">
                    <Typography className="product-category">
                      {product.category}
                    </Typography>

                    <Typography className="product-name">
                      {product.name}
                    </Typography>

                    <Typography className="product-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      className="add-cart-btn"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredProducts.length === 0 && (
            <Box className="empty-state">
              <Typography variant="h6">No products found</Typography>
              <Typography color="text.secondary">
                Try another search or category.
              </Typography>

              <Button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </Button>
            </Box>
          )}
        </Box>

        {/* PROMOTION */}
        <Box className="promo-banner">
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Your essentials, all together.
            </Typography>

            <Typography>
              Discover useful products for home, school and everyday life.
            </Typography>
          </Box>

          <Typography className="promo-emoji">🎁</Typography>
        </Box>
      </Container>

      {/* FOOTER */}
      <Box component="footer" className="footer">
        <Container maxWidth="xl">
          <Typography variant="h5" className="footer-logo">
            zosto<span>.</span>
          </Typography>

          <Typography className="footer-text">
            Your everyday shopping destination.
          </Typography>

          <Divider className="footer-divider" />

          <Typography className="copyright">
            © {new Date().getFullYear()} Zosto. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* CART DRAWER */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      >
        <Box className="cart-drawer">
          <Box className="drawer-heading">
            <Typography variant="h5" fontWeight={800}>
              Your Cart ({cart.length})
            </Typography>

            <IconButton onClick={() => setCartOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {cart.length === 0 ? (
            <Box className="empty-cart">
              <ShoppingCartIcon sx={{ fontSize: 55, color: "#94a3b8" }} />

              <Typography variant="h6">
                Your cart is empty
              </Typography>

              <Typography color="text.secondary">
                Add products to get started.
              </Typography>
            </Box>
          ) : (
            <>
              <Box className="cart-items">
                {cart.map((product, index) => (
                  <Box
                    className="cart-item"
                    key={`${product.id}-${index}`}
                  >
                    <span className="cart-item-emoji">
                      {product.emoji}
                    </span>

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700}>
                        {product.name}
                      </Typography>

                      <Typography color="text.secondary">
                        ₹{product.price.toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    <IconButton
                      aria-label="Remove item"
                      onClick={() => removeFromCart(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box className="cart-total">
                <Typography variant="h6" fontWeight={800}>
                  Total: ₹{total.toLocaleString("en-IN")}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    alert("Connect your checkout page here.")
                  }
                >
                  Proceed to checkout
                </Button>

                <Button fullWidth onClick={() => setCart([])}>
                  Clear cart
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* LOGIN / SIGNUP DIALOG */}
      {authMode && (
        <Box className="auth-overlay" onClick={closeAuth}>
          <Box
            className="auth-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <IconButton className="auth-close" onClick={closeAuth}>
              <CloseIcon />
            </IconButton>

            <Typography variant="h4" className="logo">
              zosto<span>.</span>
            </Typography>

            <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>
              {authMode}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {authMode === "Login"
                ? "Welcome back! Enter your details."
                : "Create your account to get started."}
            </Typography>

            <TextField
              fullWidth
              label="Email address"
              type="email"
              margin="normal"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, py: 1.3 }}
              onClick={() =>
                alert("Connect a real authentication backend here.")
              }
            >
              {authMode}
            </Button>

            <Button
              fullWidth
              sx={{ mt: 1 }}
              onClick={() =>
                setAuthMode(authMode === "Login" ? "Sign Up" : "Login")
              }
            >
              {authMode === "Login"
                ? "New here? Sign up"
                : "Already have an account? Login"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Home
