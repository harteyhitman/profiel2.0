import DashboardLoadingSkeleton from '@/components/dashboard/DashboardLoadingSkeleton/DashboardLoadingSkeleton';

/**
 * Shown during client-side navigation to /dashboard and sibling segment loads.
 * Gives immediate feedback so the main content area doesn’t feel stuck.
 */
export default function DashboardLoading() {
  return <DashboardLoadingSkeleton />;
}
