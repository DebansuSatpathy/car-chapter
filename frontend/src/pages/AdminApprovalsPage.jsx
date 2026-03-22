import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchAllListingsForAdmin, updateListingStatus, updateListingFields, deleteListing } from '../api/carApi';
import { useAuth } from '../context/AuthContext';
import './AdminApprovalsPage.css';

const TABS = [
  { key: 'pending',  label: 'Pending',  color: '#C8973A' },
  { key: 'approved', label: 'Approved', color: '#22c55e' },
  { key: 'rejected', label: 'Rejected', color: '#ef4444' },
  { key: null,       label: 'All',      color: null },
];

function formatINRDisplay(val) {
  if (!val) return '—';
  const n = parseInt(val);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  const s = String(n).replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');
  return `₹${s}`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminApprovalsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending');
  const [listings, setListings] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // listing awaiting delete confirmation
  const [lightbox, setLightbox] = useState(null); // { photos: [], index: 0 }
  const [editModal, setEditModal] = useState(null); // listing being edited before approval
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [priceEdited, setPriceEdited] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/');
  }, [authLoading, isAdmin, navigate]);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [all, pending, approved, rejected] = await Promise.all([
        fetchAllListingsForAdmin(null),
        fetchAllListingsForAdmin('pending'),
        fetchAllListingsForAdmin('approved'),
        fetchAllListingsForAdmin('rejected'),
      ]);
      setCounts({ pending: pending.length, approved: approved.length, rejected: rejected.length, all: all.length });
      const map = { pending, approved, rejected, null: all };
      setListings(map[activeTab] ?? all);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { if (isAdmin) loadListings(); }, [isAdmin, loadListings]);

  async function handleStatus(id, status) {
    setUpdating(id);
    try {
      await updateListingStatus(id, status);
      setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      // Also update counts
      setCounts(prev => {
        const oldStatus = listings.find(l => l.id === id)?.status;
        const next = { ...prev };
        if (oldStatus) next[oldStatus] = Math.max(0, next[oldStatus] - 1);
        next[status] = (next[status] || 0) + 1;
        return next;
      });
      showToast(status === 'approved' ? 'Listing approved — now live!' : 'Listing rejected.', status);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setUpdating(null);
    }
  }

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDelete(id) {
    setUpdating(id);
    try {
      await deleteListing(id);
      setListings(prev => prev.filter(l => l.id !== id));
      setCounts(prev => {
        const oldStatus = listings.find(l => l.id === id)?.status;
        const next = { ...prev };
        if (oldStatus) next[oldStatus] = Math.max(0, next[oldStatus] - 1);
        next.all = Math.max(0, next.all - 1);
        return next;
      });
      showToast('Listing deleted permanently.', 'rejected');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setUpdating(null);
      setDeleteConfirm(null);
    }
  }

  function openEditModal(listing) {
    setEditModal(listing);
    setEditForm({
      price: listing.price || '',
      description: listing.description || '',
      km_driven: listing.km_driven || '',
      condition: listing.condition || '',
      negotiable: listing.negotiable || false,
    });
    setPriceEdited(false);
  }

  function closeEditModal() {
    setEditModal(null);
    setEditForm({});
    setPriceEdited(false);
  }

  function handleEditChange(field, value) {
    setEditForm(prev => ({ ...prev, [field]: value }));
    if (field === 'price') setPriceEdited(true);
  }

  async function handleEditApprove() {
    if (!priceEdited) return;
    setEditSaving(true);
    try {
      const fields = {
        price: parseInt(editForm.price) || 0,
        description: editForm.description,
        km_driven: editForm.km_driven,
        condition: editForm.condition,
        negotiable: editForm.negotiable,
      };
      await updateListingFields(editModal.id, fields);
      await updateListingStatus(editModal.id, 'approved');
      setListings(prev =>
        prev.map(l => l.id === editModal.id ? { ...l, ...fields, status: 'approved' } : l)
      );
      setCounts(prev => {
        const next = { ...prev };
        const oldStatus = editModal.status;
        if (oldStatus) next[oldStatus] = Math.max(0, next[oldStatus] - 1);
        next.approved = (next.approved || 0) + 1;
        return next;
      });
      showToast('Listing updated & approved — now live!', 'approved');
      closeEditModal();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setEditSaving(false);
    }
  }

  const heroUrl = (listing) => {
    const photos = listing.photos || [];
    const hero = photos[listing.hero_index] || photos[0];
    return hero?.url || null;
  };

  function openLightbox(photos, startIndex = 0) {
    if (!photos || photos.length === 0) return;
    setLightbox({ photos, index: startIndex });
  }

  function lightboxNav(dir) {
    setLightbox(prev => {
      if (!prev) return null;
      const len = prev.photos.length;
      return { ...prev, index: (prev.index + dir + len) % len };
    });
  }

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e) {
      if (e.key === 'ArrowRight') lightboxNav(1);
      else if (e.key === 'ArrowLeft') lightboxNav(-1);
      else if (e.key === 'Escape') setLightbox(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const tabListings = activeTab === null
    ? listings
    : listings.filter(l => l.status === activeTab);

  return (
    <div className="admin-page">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === 'approved' && '✓ '}
          {toast.type === 'rejected' && '✕ '}
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div className="admin-hero">
        <div className="container">
          <div className="admin-hero__inner">
            <div>
              <p className="admin-eyebrow">
                <span className="admin-eyebrow__dot" />
                Admin Panel
              </p>
              <h1 className="admin-title">Listing Approvals</h1>
              <p className="admin-sub">Review, approve or reject submitted car listings before they go live.</p>
            </div>
            <div className="admin-hero__stats">
              <div className="admin-hero-stat admin-hero-stat--pending">
                <span>{counts.pending}</span>
                <label>Awaiting Review</label>
              </div>
              <div className="admin-hero-stat admin-hero-stat--approved">
                <span>{counts.approved}</span>
                <label>Live</label>
              </div>
              <div className="admin-hero-stat admin-hero-stat--rejected">
                <span>{counts.rejected}</span>
                <label>Rejected</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-body">

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map(t => (
            <button
              key={String(t.key)}
              className={`admin-tab ${activeTab === t.key ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
              style={activeTab === t.key && t.color ? { '--tab-color': t.color } : {}}
            >
              {t.label}
              <span className="admin-tab__count">
                {t.key === null ? counts.all : counts[t.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <div className="admin-error">{error}</div>}

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner" />
            Loading listings…
          </div>
        )}

        {/* Empty */}
        {!loading && !error && tabListings.length === 0 && (
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
            <h3>All clear!</h3>
            <p>No {activeTab || ''} listings to review right now.</p>
          </div>
        )}

        {/* Listings */}
        {!loading && tabListings.length > 0 && (
          <div className="admin-grid">
            {tabListings.map(listing => {
              const img = heroUrl(listing);
              const isUpdating = updating === listing.id;
              return (
                <div className={`approval-card approval-card--${listing.status}`} key={listing.id}>

                  {/* Image */}
                  <div className="approval-card__img-wrap">
                    {img
                      ? <img
                          src={img}
                          alt={`${listing.make} ${listing.model}`}
                          className="approval-card__hero-img"
                          onClick={() => openLightbox(listing.photos, listing.hero_index || 0)}
                        />
                      : <div className="approval-card__no-img">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        </div>
                    }

                    {/* Status ribbon */}
                    <div className={`approval-card__ribbon approval-card__ribbon--${listing.status}`}>
                      {listing.status === 'pending'  && '⏳ Pending'}
                      {listing.status === 'approved' && '✓ Live'}
                      {listing.status === 'rejected' && '✕ Rejected'}
                    </div>

                    {/* Photo count */}
                    {(listing.photos || []).length > 0 && (
                      <span className="approval-card__photo-count" onClick={() => openLightbox(listing.photos, 0)} style={{ cursor: 'pointer' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        {listing.photos.length}
                      </span>
                    )}

                    {/* Photo strip */}
                    {(listing.photos || []).length > 1 && (
                      <div className="approval-card__strip">
                        {listing.photos.slice(0, 4).map((p, i) => (
                          <img key={i} src={p.url} alt="" onClick={() => openLightbox(listing.photos, i)} style={{ cursor: 'pointer' }} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="approval-card__body">
                    <div className="approval-card__top">
                      <div>
                        <h3 className="approval-card__title">{listing.year} {listing.make} {listing.model}</h3>
                        {listing.variant && <p className="approval-card__variant">{listing.variant}</p>}
                      </div>
                      <span className="approval-card__price">{formatINRDisplay(listing.price)}</span>
                    </div>

                    <div className="approval-card__chips">
                      {listing.fuel        && <span>{listing.fuel}</span>}
                      {listing.transmission && <span>{listing.transmission}</span>}
                      {listing.km_driven   && <span>{parseInt(listing.km_driven).toLocaleString('en-IN')} km</span>}
                      {listing.owners      && <span>{listing.owners} Owner</span>}
                      {listing.city        && <span>{listing.city}</span>}
                      {listing.condition   && <span>{listing.condition}</span>}
                      {listing.csd_purchase && <span className="approval-card__chip--csd">CSD</span>}
                    </div>

                    {listing.description && (
                      <p className="approval-card__desc">
                        {listing.description.length > 120 ? listing.description.slice(0, 120) + '…' : listing.description}
                      </p>
                    )}

                    <div className="approval-card__meta">
                      <span className="approval-card__time">Submitted {timeAgo(listing.created_at)}</span>
                      {listing.negotiable && <span className="approval-card__neg">Negotiable</span>}
                    </div>

                    {/* Actions */}
                    <div className="approval-card__actions">
                      {listing.status !== 'approved' && (
                        <button
                          className="approval-btn approval-btn--approve"
                          onClick={() => openEditModal(listing)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <span className="admin-spinner admin-spinner--sm" /> : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          )}
                          Review & Approve
                        </button>
                      )}
                      {listing.status !== 'rejected' && (
                        <button
                          className="approval-btn approval-btn--reject"
                          onClick={() => handleStatus(listing.id, 'rejected')}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <span className="admin-spinner admin-spinner--sm" /> : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          )}
                          Reject
                        </button>
                      )}
                      {listing.status === 'approved' && (
                        <button
                          className="approval-btn approval-btn--undo"
                          onClick={() => handleStatus(listing.id, 'pending')}
                          disabled={isUpdating}
                        >
                          Move to Pending
                        </button>
                      )}
                      {listing.status === 'approved' && (
                        <button
                          className="approval-btn approval-btn--delete"
                          onClick={() => setDeleteConfirm(listing)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <span className="admin-spinner admin-spinner--sm" /> : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                          )}
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div>
                <h2 className="admin-modal__title">Delete Listing?</h2>
                <p className="admin-modal__subtitle">
                  {deleteConfirm.year} {deleteConfirm.make} {deleteConfirm.model}
                  {deleteConfirm.variant ? ` — ${deleteConfirm.variant}` : ''}
                </p>
              </div>
              <button className="admin-modal__close" onClick={() => setDeleteConfirm(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="admin-modal__body">
              <p className="admin-modal__warning">
                This will permanently delete this listing. This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="approval-btn approval-btn--undo" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="approval-btn approval-btn--delete-confirm"
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={updating === deleteConfirm.id}
              >
                {updating === deleteConfirm.id ? <span className="admin-spinner admin-spinner--sm" /> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                )}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="admin-modal-overlay" onClick={closeEditModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div>
                <h2 className="admin-modal__title">Review & Set Price</h2>
                <p className="admin-modal__subtitle">
                  {editModal.year} {editModal.make} {editModal.model}
                  {editModal.variant ? ` — ${editModal.variant}` : ''}
                </p>
              </div>
              <button className="admin-modal__close" onClick={closeEditModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="admin-modal__body">
              <div className="admin-modal__field admin-modal__field--price">
                <label>
                  Price (INR) <span className="admin-modal__required">* Required</span>
                </label>
                <div className="admin-modal__price-wrap">
                  <span className="admin-modal__currency">₹</span>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={e => handleEditChange('price', e.target.value)}
                    placeholder="Set the final price"
                    className={priceEdited ? 'edited' : ''}
                  />
                </div>
                {editForm.price && (
                  <span className="admin-modal__price-preview">
                    {formatINRDisplay(editForm.price)}
                  </span>
                )}
                {!priceEdited && (
                  <p className="admin-modal__hint">You must review and set the price before approving.</p>
                )}
              </div>

              <div className="admin-modal__field">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => handleEditChange('description', e.target.value)}
                  rows={3}
                  placeholder="Seller description"
                  maxLength={1000}
                />
              </div>

              <div className="admin-modal__row">
                <div className="admin-modal__field">
                  <label>KM Driven</label>
                  <input
                    type="number"
                    value={editForm.km_driven}
                    onChange={e => handleEditChange('km_driven', e.target.value)}
                    placeholder="Kilometers"
                  />
                </div>
                <div className="admin-modal__field">
                  <label>Condition</label>
                  <select
                    value={editForm.condition}
                    onChange={e => handleEditChange('condition', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <label className="admin-modal__checkbox">
                <input
                  type="checkbox"
                  checked={editForm.negotiable}
                  onChange={e => handleEditChange('negotiable', e.target.checked)}
                />
                Price is negotiable
              </label>
            </div>

            <div className="admin-modal__footer">
              <button className="approval-btn approval-btn--reject" onClick={closeEditModal}>
                Cancel
              </button>
              <button
                className="approval-btn approval-btn--approve"
                onClick={handleEditApprove}
                disabled={!priceEdited || editSaving}
                title={!priceEdited ? 'You must set the price first' : ''}
              >
                {editSaving ? <span className="admin-spinner admin-spinner--sm" /> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                )}
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="admin-lightbox" onClick={() => setLightbox(null)}>
          <button className="admin-lightbox__close" onClick={() => setLightbox(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <span className="admin-lightbox__counter">{lightbox.index + 1} / {lightbox.photos.length}</span>

          {lightbox.photos.length > 1 && (
            <button className="admin-lightbox__arrow admin-lightbox__arrow--left" onClick={e => { e.stopPropagation(); lightboxNav(-1); }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}

          <div className="admin-lightbox__main" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.photos[lightbox.index]?.url}
              alt={`Photo ${lightbox.index + 1}`}
              key={lightbox.index}
            />
          </div>

          {lightbox.photos.length > 1 && (
            <button className="admin-lightbox__arrow admin-lightbox__arrow--right" onClick={e => { e.stopPropagation(); lightboxNav(1); }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}

          {lightbox.photos.length > 1 && (
            <div className="admin-lightbox__thumbs" onClick={e => e.stopPropagation()}>
              {lightbox.photos.map((p, i) => (
                <img
                  key={i}
                  src={p.url}
                  alt=""
                  className={i === lightbox.index ? 'active' : ''}
                  onClick={() => setLightbox(prev => ({ ...prev, index: i }))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
