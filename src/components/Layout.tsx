
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserMenu } from "@/components/UserMenu";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Agent } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAgentRoute = location.pathname.startsWith("/agent");
  
  // 代理登录信息状态
  const [agent, setAgent] = useState<Agent | null>(null);
  
  // 加载代理信息
  useEffect(() => {
    const agentData = localStorage.getItem("agent");
    if (agentData) {
      try {
        setAgent(JSON.parse(agentData));
      } catch (error) {
        console.error("解析代理数据失败:", error);
      }
    }
  }, [location.pathname]);
  
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
              
              {/* 显示代理登录信息 */}
              {agent ? (
                <AgentMenu agent={agent} />
              ) : (
                <UserMenu />
              )}
              
              {/* Only show admin dashboard button if user has admin privileges */}
              {isAdmin && (
                <Link to={isAdminRoute ? "/" : "/admin"}>
                  <Button variant={isAdminRoute ? "outline" : "default"} size="sm">
                    {isAdminRoute ? "用户门户" : "管理后台"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              
              {/* 显示代理后台按钮 */}
              {agent && !isAgentRoute && (
                <Link to="/agent/dashboard">
                  <Button variant="default" size="sm">
                    代理后台
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {agent && isAgentRoute && (
                <Link to="/">
                  <Button variant="outline" size="sm">
                    返回主站
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

// 代理菜单组件
interface AgentMenuProps {
  agent: Agent;
}

function AgentMenu({ agent }: AgentMenuProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 获取代理首字母用于头像
  const getInitials = () => {
    if (!agent.name) return 'A';
    return agent.name.charAt(0).toUpperCase();
  };
  
  // 退出代理登录
  const handleLogout = () => {
    localStorage.removeItem('agent');
    localStorage.removeItem('agentLoggedIn');
    toast({
      title: '已退出',
      description: '您已成功退出代理账号',
    });
    navigate('/');
    // 刷新页面确保状态完全清除
    window.location.reload();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-blue-500 text-white">{getInitials()}</AvatarFallback>
          </Avatar>
          <span className="max-w-[100px] truncate">{agent.name || agent.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{agent.name}</p>
            <p className="text-xs text-gray-500">{agent.email}</p>
            <p className="text-xs text-green-600">代理账号</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/agent/dashboard" className="w-full">代理控制台</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-500"
        >
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Layout;
