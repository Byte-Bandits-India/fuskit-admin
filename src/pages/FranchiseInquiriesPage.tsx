import { useState, useEffect, useCallback } from 'react';
import { franchiseApi, FranchiseInquiryDTO } from '@/services/api';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

export function FranchiseInquiriesPage() {
  const [inquiries, setInquiries] = useState<FranchiseInquiryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toasts, showToast, dismissToast } = useToast();

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await franchiseApi.list({
        page,
        pageSize: 8,
        search,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setInquiries(res.data);
      setTotalPages(res.pagination.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, showToast]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Debounced search input handler
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await franchiseApi.updateStatus(id, newStatus);
      showToast('Status updated successfully', 'success');
      // Update local state directly
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus as any } : inq))
      );
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this franchise inquiry?')) return;
    try {
      await franchiseApi.delete(id);
      showToast('Inquiry deleted successfully', 'success');
      fetchInquiries();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete inquiry', 'error');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { backgroundColor: 'var(--orange-light)', color: 'var(--orange)' };
      case 'CONTACTED':
        return { backgroundColor: 'var(--blue-bg)', color: 'var(--blue)' };
      case 'APPROVED':
        return { backgroundColor: 'var(--green-bg)', color: 'var(--green)' };
      case 'REJECTED':
        return { backgroundColor: 'var(--red-bg)', color: 'var(--red)' };
      default:
        return { backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4 p-3 md:p-5 md:px-6 bg-[#F7F3EE] min-h-full rounded-xl">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="font-display text-lg md:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Franchise Inquiries
          </h1>
          <p className="text-xs mt-[2px]" style={{ color: 'var(--text-muted)' }}>
            Review and manage franchise partnership requests from expansion targets.
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 min-w-[280px] max-w-[360px] px-3 py-[8px] rounded-lg transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none bg-transparent text-xs w-full"
            style={{ color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PENDING', 'CONTACTED', 'APPROVED', 'REJECTED'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setStatusFilter(filter);
                setPage(1);
              }}
              className="px-[14px] py-[8px] rounded-lg text-xs cursor-pointer transition-all font-semibold uppercase tracking-wider"
              style={{
                background: statusFilter === filter ? 'var(--orange)' : 'var(--bg-card)',
                border: `1px solid ${statusFilter === filter ? 'var(--orange)' : 'var(--border)'}`,
                color: statusFilter === filter ? '#fff' : 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries table / grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl animate-pulse h-40"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <span className="text-4xl mb-3">📋</span>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>No Inquiries Found</h3>
          <p className="text-xs mt-1 max-w-[280px]" style={{ color: 'var(--text-muted)' }}>
            No franchise applications match your search filter or parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="p-5 sm:p-6 rounded-xl transition-all flex flex-col md:flex-row md:items-start justify-between gap-5 relative"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              {/* Left detail area */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-sm md:text-base font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{inquiry.fullName}</h2>
                  <span
                    className="text-[9.5px] px-2 py-0.5 rounded-[20px] font-bold uppercase tracking-wider"
                    style={getStatusStyle(inquiry.status)}
                  >
                    {inquiry.status}
                  </span>
                  <span className="text-[10px] font-semibold sm:ml-auto md:ml-0" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(inquiry.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs font-medium mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">📧</span>
                    <a href={`mailto:${inquiry.email}`} className="hover:underline hover:text-[var(--text-primary)] truncate">
                      {inquiry.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">📞</span>
                    <a href={`tel:${inquiry.phone}`} className="hover:underline hover:text-[var(--text-primary)]">
                      {inquiry.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">📍</span>
                    <span className="truncate font-semibold" style={{ color: 'var(--text-primary)' }}>{inquiry.cityState}</span>
                  </div>
                </div>

                {inquiry.message && (
                  <div className="mt-3.5 p-3.5 rounded-lg text-xs leading-relaxed max-w-[900px]"
                       style={{
                         background: 'var(--bg-card2)',
                         border: '1px solid var(--border)',
                         color: 'var(--text-secondary)'
                       }}>
                    <span className="font-extrabold text-[10px] uppercase block mb-1" style={{ color: 'var(--orange)' }}>
                      Notes &amp; Background
                    </span>
                    {inquiry.message}
                  </div>
                )}
              </div>

              {/* Right action control area */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 flex-none border-t border-[var(--border)] md:border-t-0 pt-4 md:pt-0">
                <div className="flex flex-col gap-1 w-32 md:w-36">
                  <label className="text-[9px] uppercase tracking-wider font-bold block" style={{ color: 'var(--text-muted)' }}>
                    Update Status
                  </label>
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                    className="rounded-lg border px-2.5 py-1.5 text-[11px] font-bold cursor-pointer focus:outline-none focus:ring-1 transition-all w-full"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="PENDING" style={{ color: 'var(--text-primary)', background: 'var(--bg-card)' }}>Pending Review</option>
                    <option value="CONTACTED" style={{ color: 'var(--text-primary)', background: 'var(--bg-card)' }}>Contacted Agent</option>
                    <option value="APPROVED" style={{ color: 'var(--text-primary)', background: 'var(--bg-card)' }}>Approved Outlet</option>
                    <option value="REJECTED" style={{ color: 'var(--text-primary)', background: 'var(--bg-card)' }}>Rejected Request</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(inquiry.id)}
                  className="px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold tracking-wider border transition-all flex items-center gap-1.5 md:mt-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)'; (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                >
                  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                  </svg>
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            ‹ Previous
          </button>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
