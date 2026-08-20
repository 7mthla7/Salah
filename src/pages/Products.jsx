import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useStore(s => s.products);
  const categories = useStore(s => s.categories);

  const [showFilters, setShowFilters] = useState(false);
  // Local filter state — initialised from URL once on mount
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(() => searchParams.get('category') || '');
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'featured');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStock, setInStock] = useState(false);

  // Only re-sync from URL when navigating here fresh (e.g. clicking a category link)
  // We track the previous searchParams string so typing in the filter panel doesn't
  // get wiped by the effect rerunning.
  const prevParamsRef = React.useRef(searchParams.toString());
  useEffect(() => {
    const next = searchParams.toString();
    if (next !== prevParamsRef.current) {
      prevParamsRef.current = next;
      setSearch(searchParams.get('search') || '');
      setSelectedCat(searchParams.get('category') || '');
      setSort(searchParams.get('sort') || 'featured');
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = products.filter(p => p.status === 'active');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCat) list = list.filter(p => p.category === selectedCat);
    if (inStock) list = list.filter(p => p.stock > 0);
    if (priceMin !== '') list = list.filter(p => (p.discountPrice ?? p.price) >= Number(priceMin));
    if (priceMax !== '') list = list.filter(p => (p.discountPrice ?? p.price) <= Number(priceMax));

    switch (sort) {
      case 'newest': return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'price-asc': return [...list].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      case 'price-desc': return [...list].sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      default: return [...list].sort((a, b) => b.reviews - a.reviews);
    }
  }, [products, search, selectedCat, sort, priceMin, priceMax, inStock]);

  function clearFilters() {
    setSearch('');
    setSelectedCat('');
    setPriceMin('');
    setPriceMax('');
    setInStock(false);
    setSort('featured');
    setSearchParams({});
  }

  const hasFilters = search || selectedCat || priceMin || priceMax || inStock;

  return (
    <div className="products-page page-enter">
      <div className="container">
        <div className="products-page-header">
          <div>
            <h1 className="page-title">
              {selectedCat ? selectedCat : search ? `Results for "${search}"` : 'All Products'}
            </h1>
            <p className="page-sub">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="products-toolbar">
            <select
              className="form-input toolbar-sort"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              className={`btn btn-outline btn-sm filter-toggle${showFilters ? ' active' : ''}`}
              onClick={() => setShowFilters(o => !o)}
            >
              <SlidersHorizontal size={15} />
              Filters {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="form-group">
                <label className="form-label">Search</label>
                <input
                  className="form-input"
                  placeholder="Search products…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Price ($)</label>
                <input className="form-input" type="number" min="0" placeholder="0" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Price ($)</label>
                <input className="form-input" type="number" min="0" placeholder="∞" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
              </div>
            </div>
            <div className="filters-footer">
              <label className="check-label">
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                In Stock Only
              </label>
              {hasFilters && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {hasFilters && (
          <div className="filter-chips">
            {search && <Chip label={`"${search}"`} onRemove={() => setSearch('')} />}
            {selectedCat && <Chip label={selectedCat} onRemove={() => setSelectedCat('')} />}
            {priceMin && <Chip label={`Min: $${priceMin}`} onRemove={() => setPriceMin('')} />}
            {priceMax && <Chip label={`Max: $${priceMax}`} onRemove={() => setPriceMax('')} />}
            {inStock && <Chip label="In Stock" onRemove={() => setInStock(false)} />}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="filter-chip">
      {label}
      <button onClick={onRemove}><X size={12} /></button>
    </span>
  );
}
