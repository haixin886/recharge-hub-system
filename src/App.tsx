
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Recharge from "./pages/Recharge";
import RechargeSuccess from "./pages/RechargeSuccess";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Finance from "./pages/admin/Finance";
import Settings from "./pages/admin/Settings";
import Business from "./pages/admin/Business";
import Agents from "./pages/admin/Agents";
import DataPanel from "./pages/admin/DataPanel";
import AdminAuth from "./pages/admin/AdminAuth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import UserOrders from "./pages/Orders";
import WalletPage from "./pages/Wallet";
import Withdraw from "./pages/Withdraw";

// u4ee3u7406u9875u9762
import AgentLogin from "./pages/agent/AgentLogin";
import AgentDashboard from "./pages/agent/AgentDashboard";
import { LoadingSpinner } from "@/components/ui";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client"; 
import { AdminUser } from "./types";

const queryClient = new QueryClient();

// Admin route guard component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [isAdminChecking, setIsAdminChecking] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.email) {
        try {
          // Check the admin_users table for this user's email
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
            
          if (!error && data) {
            setAdminData(data as AdminUser);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        } finally {
          setIsAdminChecking(false);
        }
      } else {
        setIsAdminChecking(false);
      }
    };
    
    if (!isLoading) {
      checkAdminStatus();
    }
  }, [user, isLoading]);
  
  // Add loading indicator
  if (isLoading || isAdminChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" text="正在验证权限..." />
        </div>
      </div>
    );
  }
  
  // Update the admin check to use either the super admin email or the admin_users table
  const isAdmin = user?.email === "it@haixin.org" || adminData?.is_admin === true;
  
  console.log("AdminRoute check:", { user: user?.email, isAdmin, adminData });
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;  // Redirect to admin login
  }
  
  if (!isAdmin) {
    console.log("Not an admin, redirecting to home page");
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/recharge" element={<Recharge />} />
      <Route path="/recharge/success" element={<RechargeSuccess />} />
      <Route path="/orders" element={<UserOrders />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/withdraw" element={<Withdraw />} />
      
      {/* Admin auth route */}
      <Route path="/admin/login" element={<AdminAuth />} />
      
      {/* Admin routes with protection */}
      <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/data-panel" element={<AdminRoute><DataPanel /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/admin/finance" element={<AdminRoute><Finance /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
      <Route path="/admin/business" element={<AdminRoute><Business /></AdminRoute>} />
      <Route path="/admin/agents" element={<AdminRoute><Agents /></AdminRoute>} />
      
      {/* u4ee3u7406u8defu7531 */}
      <Route path="/vip" element={<AgentLogin />} />
      <Route path="/agent/dashboard" element={<AgentDashboard />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
