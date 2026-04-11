/**
 * SkeletonCard — Shimmer loading placeholder for product grids.
 * Uses the .skeleton class defined in global.css.
 */
export default function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 'var(--radius-lg, 16px)',
      border: '1px solid var(--border, #e2e8f0)',
      overflow: 'hidden',
      background: '#fff'
    }}>
      {/* Image placeholder */}
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1' }} />
      {/* Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '12px', width: '40%' }} />
        <div className="skeleton" style={{ height: '16px', width: '80%' }} />
        <div className="skeleton" style={{ height: '16px', width: '60%' }} />
        <div className="skeleton" style={{ height: '20px', width: '35%', marginTop: '8px' }} />
        <div className="skeleton" style={{ height: '44px', width: '100%', marginTop: '8px' }} />
      </div>
    </div>
  );
}
