
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/UserMenu";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  // Update admin check to use the specific email
  const isAdmin = user?.email === "it@haixin.org";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 flex items-center">
            畅充<span className="text-orange-500">宝</span>
          </Link>
          
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/">首页</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/recharge">充值</Link>
                </DropdownMenuItem>
                {!user ? (
                  <DropdownMenuItem asChild>
                    <Link to="/auth">登录 / 注册</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/profile">个人中心</Link>
                  </DropdownMenuItem>
                )}
                {/* Only show admin dashboard link if user has admin privileges */}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">管理后台</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex gap-6 items-center">
              <Link 
                to="/" 
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors",
                  location.pathname === "/" && "text-blue-600 font-medium"
                )}
              >
                首页
              </Link>
              <Link 
                to="/recharge" 
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors",
                  location.pathname === "/recharge" && "text-blue-600 font-medium"
                )}
              >
                充值
              </Link>
              <UserMenu />
              {/* Only show admin dashboard button if user has admin privileges */}
              {isAdmin && (
                <Link to={isAdminRoute ? "/" : "/admin"}>
                  <Button variant={isAdminRoute ? "outline" : "default"} size="sm">
                    {isAdminRoute ? "用户门户" : "管理后台"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 畅充宝. 保留所有权利.</p>
          <p className="text-sm mt-1">安全的手机话费充值服务平台.</p>
        </div>
      </footer>
      
      {/* Add bottom navigation only on mobile */}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default Layout;
