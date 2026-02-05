import DashboardLayout from '@/components/dashboard/DashboardLayout/DashboardLayout';
import ProtectedRoute from '@/components/dashboard/ProtectedRoute/ProtectedRoute';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

