
import React from "react";
import { useAuth } from "@/components/AuthProvider";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CreditCard, Package, Settings, LogOut } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();

  // Get user initials or first letter of email for avatar fallback
  const getInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">未登录</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link to="/auth">
                <Button>前往登录</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata?.avatar_url || "/touxiang.png"} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle>{user.email}</CardTitle>
              <p className="text-sm text-gray-500">账户 ID: {user.id.substring(0, 8)}...</p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          <Card>
            <Link to="/orders">
              <div className="p-4 flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-500" />
                <div>我的订单</div>
              </div>
            </Link>
          </Card>
          
          <Card>
            <Link to="/recharge">
              <div className="p-4 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-green-500" />
                <div>充值中心</div>
              </div>
            </Link>
          </Card>
          
          <Card>
            <Link to="/admin/settings">
              <div className="p-4 flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-500" />
                <div>设置</div>
              </div>
            </Link>
          </Card>
          
          <Card className="mt-4">
            <div 
              className="p-4 flex items-center gap-3 text-red-500 cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5" />
              <div>退出登录</div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
