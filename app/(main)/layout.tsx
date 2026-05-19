import { Sidebar } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/shared/PageTransition";
import { MapBackground } from "@/components/map/MapBackground";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell flex overflow-hidden relative">
      {/* Map background image — outside PageTransition for instant display */}
      <MapBackground />

      {/* Dark overlay covering entire page including sidebar */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.08)" }}
        aria-hidden="true"
      />
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
