import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/config/wagmi";
import { GameProvider } from "@/context/GameContext";
import LandingModern from "./pages/LandingModern";
import DashboardModern from "./pages/DashboardModern";
import Level1Modern from "./pages/Level1Modern";
import Level2Modern from "./pages/Level2Modern";
import Level3Modern from "./pages/Level3Modern";
import Quest from "./pages/Quest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingModern />} />
              <Route path="/dashboard" element={<DashboardModern />} />
              <Route path="/level/1" element={<Level1Modern />} />
              <Route path="/level/2" element={<Level2Modern />} />
              <Route path="/level/3" element={<Level3Modern />} />
              <Route path="/quest" element={<Quest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
