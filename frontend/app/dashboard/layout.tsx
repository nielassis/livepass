import { DashboardSidebar } from "@/app/components/dashboard/sidebar";
import { AuthGuard } from "@/app/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto pt-16 lg:pt-0 lg:pl-64">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}