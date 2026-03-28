import AppRoutes from "./Routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { NotificationProvider } from "@/contexts/NotificationContext.jsx";
import { AgentProvider } from "@/contexts/AgentContext.jsx";
import { SocketProvider } from "@/contexts/SocketContext.jsx";

import { ModalProvider } from "@/contexts/ModalContext.jsx";
import GlobalModalsRender from "@/components/modals/GlobalModalsRender.jsx";
import NotificationDisplay from "@/components/common/NotificationDisplay.jsx";

function App() {
  return (
    <ErrorBoundary>
      <ModalProvider>
        <NotificationProvider>
          <NotificationDisplay />
          <AuthProvider>
            <GlobalModalsRender />
            <AgentProvider>
              <SocketProvider socketUrl={import.meta.env.VITE_SOCKET_URL || "http://localhost:8000"}>
                <AppRoutes />
              </SocketProvider>
            </AgentProvider>
          </AuthProvider>
        </NotificationProvider>
      </ModalProvider>
    </ErrorBoundary>
  );
}

export default App;
