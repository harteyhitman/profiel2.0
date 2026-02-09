import DashboardLayout from '@/components/dashboard/DashboardLayout/DashboardLayout';
import ProtectedRoute from '@/components/dashboard/ProtectedRoute/ProtectedRoute';
import RestrictTeamRoutes from '@/components/dashboard/RestrictTeamRoutes/RestrictTeamRoutes';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <RestrictTeamRoutes>
        <DashboardLayout>{children}</DashboardLayout>
      </RestrictTeamRoutes>
    </ProtectedRoute>
  );
}

