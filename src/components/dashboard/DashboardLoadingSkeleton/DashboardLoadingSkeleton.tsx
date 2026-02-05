/**
 * Shared loading skeleton for dashboard route segments.
 * Used by loading.tsx in dashboard and sub-routes so navigation shows immediate feedback.
 * Fills content area and uses a subtle pulse so users see that loading is in progress.
 */
const skeletonBlock = {
  background: 'var(--border-subtle)',
  borderRadius: 6,
  animation: 'skeleton-pulse 1.2s ease-in-out infinite',
} as const;

export default function DashboardLoadingSkeleton() {
  return (
    <div
      style={{
        minHeight: 'min(600px, 60vh)',
        padding: 'var(--space-lg)',
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ height: 28, width: 180, marginBottom: 8, ...skeletonBlock }} />
        <div style={{ height: 16, width: '70%', marginBottom: 8, ...skeletonBlock }} />
        <div style={{ height: 16, width: '50%', marginBottom: 8, ...skeletonBlock }} />
        <div style={{ height: 16, width: '40%', marginBottom: 24, ...skeletonBlock }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}
        >
          <div style={{ height: 200, borderRadius: 14, ...skeletonBlock }} />
          <div style={{ height: 200, borderRadius: 14, ...skeletonBlock }} />
        </div>
      </div>
    </div>
  );
}
