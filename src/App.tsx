import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Check,
  Menu,
  X,
  Receipt,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  PRODUCTS,
  CATEGORIES,
  THEME_OPTIONS,
  HERO_IMAGE_URL,
  Product,
  formatNaira,
  STORE_DISPLAY_PHONE,
} from './data/products';
import { SmartProductImage } from './components/SmartProductImage';
import { ThemeSelector } from './components/ThemeSelector';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import {
  WhatsAppOrderModal,
  ConfirmedOrder,
} from './components/WhatsAppOrderModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';

const CART_STORAGE_KEY = 'whatsapp_store_cart_v2';
const ORDER_STORAGE_KEY = 'whatsapp_store_order_v2';
const THEME_STORAGE_KEY = 'whatsapp_store_theme_v2';

export default function App() {
  // Theme state: default is 'emerald' (Botanical Pine & Emerald)
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved && THEME_OPTIONS.some((t) => t.id === saved)
        ? saved
        : 'emerald';
    } catch {
      return 'emerald';
    }
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch {
      // Ignore
    }
  }, [currentTheme]);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Last confirmed order state
  const [lastOrder, setLastOrder] = useState<ConfirmedOrder | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI state
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Modals & Drawers
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [directOrderItems, setDirectOrderItems] = useState<CartItem[] | null>(
    null
  );
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const headerSearchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    if (lastOrder) {
      try {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      } catch {
        // Ignore
      }
    }
  }, [lastOrder]);

  useEffect(() => {
    if (searchOpen && headerSearchInputRef.current) {
      headerSearchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Global ESC handler for search panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAddToCart = (
    product: Product,
    quantity = 1,
    variant?: string
  ) => {
    const chosenVariant = variant || product.variants?.[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.variant === chosenVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity, variant: chosenVariant }];
    });

    triggerToast(`Added ${product.name} to cart`);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    variant: string | undefined,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.variant === variant) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (
    productId: string,
    variant: string | undefined
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variant === variant)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleDirectWhatsAppOrder = (
    product: Product,
    quantity: number,
    variant?: string
  ) => {
    const chosenVariant = variant || product.variants?.[0];
    setActiveProduct(null);
    setDirectOrderItems([{ product, quantity, variant: chosenVariant }]);
    setWhatsAppModalOpen(true);
  };

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const inName = product.name.toLowerCase().includes(q);
      const inTagline = product.tagline.toLowerCase().includes(q);
      const inDescription = product.description.toLowerCase().includes(q);
      const inCategory = product.category.toLowerCase().includes(q);
      const inBestFor = product.bestFor.toLowerCase().includes(q);
      const inBenefits = product.benefits.some(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.detail.toLowerCase().includes(q)
      );

      return (
        inName ||
        inTagline ||
        inDescription ||
        inCategory ||
        inBestFor ||
        inBenefits
      );
    });

    if (sortBy === 'low') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'high') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: PRODUCTS.length };
    for (const p of PRODUCTS) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  const featuredHeroProduct =
    PRODUCTS.find((p) => p.id === 'everyday-desk-bundle') || PRODUCTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-main)] transition-colors duration-200">
      {/* HEADER — One-Row 3-Zone Contract with Color Scheme Selector */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element Brand wordmark */}
          <a
            href="#"
            className="font-serif-display text-xl font-bold tracking-tight text-[var(--color-text-main)] whitespace-nowrap flex items-center gap-2"
          >
            <span>WhatsApp Store</span>
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            <a
              href="#shop"
              className="hover:text-[var(--color-text-main)] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Shop
            </a>
            <a
              href="#categories"
              className="hover:text-[var(--color-text-main)] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Categories
            </a>
            <a
              href="#about"
              className="hover:text-[var(--color-text-main)] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Why WhatsApp
            </a>
            {lastOrder && (
              <button
                type="button"
                onClick={() => setReceiptModalOpen(true)}
                className="text-[var(--color-accent)] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Order #{lastOrder.orderId}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Actions (Palette Switcher, Search, Cart) */}
          <div className="flex items-center gap-2">
            {/* Color Palette Switcher */}
            <ThemeSelector
              currentTheme={currentTheme}
              onSelectTheme={(themeId) => setCurrentTheme(themeId)}
            />

            <button
              id="searchToggle"
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search products"
              className="w-10 h-10 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-main)] transition-colors cursor-pointer bg-[var(--color-surface)]"
            >
              <Search className="w-4 h-4" strokeWidth={1.8} />
            </button>

            <button
              id="cartButton"
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`Shopping cart with ${totalCartCount} items`}
              className="h-10 px-3.5 rounded-xl bg-[var(--color-text-main)] text-[var(--color-surface)] hover:opacity-90 flex items-center gap-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Cart</span>
              <span
                id="cartCount"
                className="px-1.5 py-0.5 rounded-md bg-white/20 text-current text-[11px] tabular-nums font-mono"
              >
                {totalCartCount}
              </span>
            </button>

            <button
              id="mobileMenu"
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden w-10 h-10 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-main)] transition-colors cursor-pointer bg-[var(--color-surface)]"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* EXPANDABLE SEARCH BAR */}
        {searchOpen && (
          <div
            id="searchPanel"
            className="border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
          >
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-3">
              <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 h-11">
                <Search className="w-4 h-4 text-[var(--color-text-subtle)] shrink-0" />
                <input
                  ref={headerSearchInputRef}
                  id="searchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, benefits or features (e.g. 'cold water', 'power cut', 'carafe')..."
                  autoComplete="off"
                  className="flex-1 text-xs bg-transparent text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] px-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  id="closeSearch"
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-2 py-1 text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-border)] rounded-md transition-colors cursor-pointer"
                >
                  ESC
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE NAV */}
        {mobileMenuOpen && (
          <div
            id="mobileNav"
            className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 flex flex-col gap-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-main)]"
          >
            <a
              href="#shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--color-accent)]"
            >
              Shop
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--color-accent)]"
            >
              Categories
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[var(--color-accent)]"
            >
              Why WhatsApp
            </a>
            {lastOrder && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setReceiptModalOpen(true);
                }}
                className="py-1 text-left text-[var(--color-accent)] flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>View Order #{lastOrder.orderId}</span>
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION WITH REALISTIC PHOTOGRAPHY */}
        <section className="py-12 sm:py-16 lg:py-20 border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface-subtle)]/50">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                <span>Direct WhatsApp Commerce</span>
                <span aria-hidden="true">·</span>
                <span>Verified Quality</span>
              </div>

              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-[56px] font-medium text-[var(--color-text-main)] leading-[1.08] tracking-tight">
                Quality products.
                <br />
                <em className="font-normal italic opacity-90">
                  Ordered on WhatsApp.
                </em>
              </h1>

              <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed max-w-[52ch]">
                Find thoughtfully designed everyday essentials without checkout friction.
                Examine clear benefits, pick your items, and place your order directly with our team on WhatsApp.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#shop"
                  className="h-12 px-6 bg-[var(--color-text-main)] text-[var(--color-surface)] hover:opacity-90 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2.5 whitespace-nowrap shadow-sm"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#categories"
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-main)] hover:text-[var(--color-accent)] underline underline-offset-4 transition-colors whitespace-nowrap"
                >
                  Browse categories
                </a>
              </div>
            </div>

            {/* Hero Visual Card with Realistic Photography */}
            <div className="lg:col-span-6">
              <div
                onClick={() => setActiveProduct(featuredHeroProduct)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveProduct(featuredHeroProduct);
                  }
                }}
                className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden card-lift cursor-pointer shadow-sm"
              >
                <div className="aspect-4/3 overflow-hidden bg-[var(--color-surface-subtle)] relative">
                  <SmartProductImage
                    src={HERO_IMAGE_URL}
                    alt="Featured everyday essentials collection"
                    type="everyday-desk-bundle"
                    imageClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-[var(--color-text-main)]/80 backdrop-blur-xs text-[var(--color-surface)] px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                    Studio Photo
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-[var(--color-surface)] flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)] mb-1">
                      <span>Curated Bundle</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-semibold text-[var(--color-text-main)]">
                        {formatNaira(featuredHeroProduct.price)}
                      </span>
                    </div>
                    <h3 className="font-serif-display text-lg font-medium text-[var(--color-text-main)]">
                      The Calm Desk Starter Set (3-Piece Daily Collection)
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface-subtle)] group-hover:bg-[var(--color-text-main)] text-[var(--color-text-main)] group-hover:text-[var(--color-surface)] flex items-center justify-center transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="py-8 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-semibold text-[var(--color-accent)] pt-0.5">
                01.
              </span>
              <div>
                <strong className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-main)] block mb-0.5">
                  Verified Quality
                </strong>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Every product is tested for durability, daily ergonomics, and longevity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-semibold text-[var(--color-accent)] pt-0.5">
                02.
              </span>
              <div>
                <strong className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-main)] block mb-0.5">
                  Seamless WhatsApp Ordering
                </strong>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  No account setup needed. Send your pre-formatted order directly on WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-semibold text-[var(--color-accent)] pt-0.5">
                03.
              </span>
              <div>
                <strong className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-main)] block mb-0.5">
                  Real Person Support
                </strong>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Chat with dispatch coordinators to confirm delivery time before payment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section id="categories" className="pt-14 sm:pt-16 pb-4">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block mb-1">
                  Catalog Categories
                </span>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[var(--color-text-main)]">
                  Explore by Purpose.
                </h2>
              </div>

              <p className="text-xs text-[var(--color-text-muted)] max-w-sm">
                Select a collection to filter curated everyday tools designed for daily reliability.
              </p>
            </div>

            {/* Interactive Category Filter Bar */}
            <div
              id="categoryList"
              className="flex flex-wrap items-center gap-2 p-1.5 bg-[var(--color-surface-subtle)] rounded-2xl border border-[var(--color-border)]"
              role="tablist"
              aria-label="Product categories"
            >
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category.id;
                const count = categoryCounts[category.id] || 0;
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-text-main)] text-[var(--color-surface)] shadow-xs'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span
                      className={`tabular-nums text-[10px] ${
                        isSelected ? 'opacity-70' : 'text-[var(--color-text-subtle)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SHOP CATALOG SECTION WITH REALISTIC PRODUCT IMAGERY */}
        <section id="shop" className="py-8 sm:py-10">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block mb-1">
                  Everyday Essentials
                </span>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[var(--color-text-main)]">
                  Built for reliable use.
                </h2>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 h-10 min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-[var(--color-text-subtle)] shrink-0" />
                  <input
                    id="desktopSearch"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog..."
                    className="w-full text-xs text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  id="sortProducts"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  className="h-10 px-3 text-xs font-semibold text-[var(--color-text-main)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="low">Price: Low to high</option>
                  <option value="high">Price: High to low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Active Filter Bar */}
            {(selectedCategory !== 'all' || searchQuery.trim() !== '') && (
              <div
                id="activeFilter"
                className="mt-6 flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 rounded-xl bg-[var(--color-surface-subtle)] text-xs text-[var(--color-text-muted)] border border-[var(--color-border)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span>Displaying</span>
                  <strong className="text-[var(--color-text-main)] tabular-nums">
                    {filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'item' : 'items'}
                  </strong>
                  {selectedCategory !== 'all' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        Category:{' '}
                        <strong className="text-[var(--color-text-main)]">
                          {selectedCategory}
                        </strong>
                      </span>
                    </>
                  )}
                  {searchQuery.trim() !== '' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        Matching:{' '}
                        <strong className="text-[var(--color-text-main)]">
                          “{searchQuery.trim()}”
                        </strong>
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSortBy('default');
                  }}
                  className="text-xs font-semibold text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 cursor-pointer whitespace-nowrap"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* PRODUCTS GRID (3 columns on desktop, 2 on tablet, 1 on mobile) */}
            {filteredProducts.length > 0 ? (
              <div
                id="productsGrid"
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
              >
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    onClick={() => setActiveProduct(product)}
                    className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col justify-between card-lift cursor-pointer shadow-xs"
                  >
                    <div>
                      {/* Realistic Product Photography (4:3 ratio) */}
                      <div className="aspect-4/3 bg-[var(--color-surface-subtle)] overflow-hidden relative">
                        <SmartProductImage
                          src={product.imageUrl}
                          alt={product.name}
                          type={product.id}
                          imageClassName="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)] mb-1.5">
                          <span>{product.category}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              product.availability === 'Low Stock'
                                ? 'text-[#B45309] font-medium'
                                : 'text-[var(--color-accent)] font-medium'
                            }
                          >
                            {product.availability}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-[var(--color-text-main)] group-hover:underline underline-offset-2 leading-snug mb-1.5">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                          {product.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Price & Quick Add Footer */}
                    <div className="px-5 pb-5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-subtle)] block uppercase font-mono">
                          Price
                        </span>
                        <span className="text-sm font-bold text-[var(--color-text-main)] tabular-nums">
                          {formatNaira(product.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProduct(product);
                          }}
                          className="h-8 px-2.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] rounded-lg hover:bg-[var(--color-surface-subtle)] transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Specs
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product, 1);
                          }}
                          aria-label={`Add ${product.name} to cart`}
                          className="h-8 px-3 bg-[var(--color-text-main)] hover:opacity-90 text-[var(--color-surface)] text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* NO RESULTS */
              <div
                id="noResults"
                className="mt-8 py-14 px-6 text-center bg-[var(--color-surface-subtle)] rounded-2xl border border-[var(--color-border)]"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] mx-auto flex items-center justify-center text-[var(--color-text-subtle)] mb-3 border border-[var(--color-border)]">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display text-lg font-medium text-[var(--color-text-main)] mb-1">
                  No products found
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto mb-4">
                  We couldn’t find items matching “{searchQuery}”. Try
                  another keyword or reset your filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-[var(--color-text-main)] text-[var(--color-surface)] text-xs font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-xs"
                >
                  Show all products
                </button>
              </div>
            )}
          </div>
        </section>

        {/* WHY WHATSAPP / ABOUT SECTION */}
        <section
          id="about"
          className="py-14 sm:py-18 bg-[var(--color-surface)] border-t border-[var(--color-border)]"
        >
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)] block mb-1">
                Direct Communication
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-medium text-[var(--color-text-main)] leading-tight">
                Shopping should feel{' '}
                <em className="font-normal italic">direct & simple.</em>
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              <p>
                Traditional online stores force you through confusing checkout funnels, unknown delivery schedules, and automated chatbots.
              </p>

              <p>
                At WhatsApp Store, you browse vetted everyday objects, preview the exact formatted WhatsApp order message with your delivery address, and confirm directly with our dispatch manager before parting with any money.
              </p>

              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--color-border)]">
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-main)] mb-1">
                    <Truck className="w-4 h-4 text-[var(--color-accent)]" />
                    <span>Same-Day Dispatch</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Parcels leave our central hub twice daily. Free delivery on orders over ₦60,000.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-main)] mb-1">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
                    <span>Pay On Inspection</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Inspect your items when the rider arrives and pay via transfer or card terminal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 bg-[var(--color-bg)] border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-serif-display text-sm font-bold text-[var(--color-text-main)]">
              WhatsApp Store
            </span>
            <span aria-hidden="true">·</span>
            <span>Direct WhatsApp Ordering</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono text-[11px]">
              Direct Desk: {STORE_DISPLAY_PHONE}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#shop" className="hover:text-[var(--color-text-main)] transition-colors">
              Shop
            </a>
            <a
              href="#categories"
              className="hover:text-[var(--color-text-main)] transition-colors"
            >
              Categories
            </a>
            <a href="#about" className="hover:text-[var(--color-text-main)] transition-colors">
              About
            </a>
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
            >
              Cart ({totalCartCount})
            </button>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectWhatsApp={handleDirectWhatsAppOrder}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToWhatsApp={() => {
          setCartDrawerOpen(false);
          setDirectOrderItems(null);
          setWhatsAppModalOpen(true);
        }}
      />

      {/* WHATSAPP ORDER DISPATCH MODAL */}
      <WhatsAppOrderModal
        isOpen={whatsAppModalOpen}
        onClose={() => {
          setWhatsAppModalOpen(false);
          setDirectOrderItems(null);
        }}
        items={directOrderItems || cart}
        onOrderConfirmed={(confirmed) => {
          setLastOrder(confirmed);
          if (!directOrderItems) {
            setCart([]);
          }
          setDirectOrderItems(null);
          setWhatsAppModalOpen(false);
          setReceiptModalOpen(true);
          triggerToast(`Order #${confirmed.orderId} placed on WhatsApp`);
        }}
      />

      {/* ORDER RECEIPT & WHATSAPP LIVE THREAD MODAL */}
      <OrderReceiptModal
        order={receiptModalOpen ? lastOrder : null}
        onClose={() => setReceiptModalOpen(false)}
      />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          id="toast"
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[var(--color-text-main)] text-[var(--color-surface)] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-fadeIn"
        >
          <span className="w-4 h-4 rounded-full bg-[var(--color-whatsapp)] text-[#0B2518] flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
