
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getOrders } from "@/services";
import { DashboardStats, RechargeOrder } from "@/types";
import { ArrowUpRight, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRecharges: 0,
    pendingRecharges: 0,
    completedRecharges: 0,
    failedRecharges: 0,
    totalAmount: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<RechargeOrder[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        const orders = await getOrders();
        const dashboardStats = await getDashboardStats();
        
        // Get only the 5 most recent orders
        setRecentOrders(orders.slice(0, 5));
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="h-3 w-3" />
            待处理
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-300">
            <CheckCircle className="h-3 w-3" />
            已完成
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-300">
            <XCircle className="h-3 w-3" />
            失败
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">控制面板</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                总充值数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{stats.totalRecharges}</span>
                <span className="text-green-600 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  12%
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                已完成充值
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{stats.completedRecharges}</span>
                <span className="text-green-600 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  8%
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                待处理充值
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{stats.pendingRecharges}</span>
                <span className="text-yellow-600 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  2%
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                总收入
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">¥{stats.totalAmount}</span>
                <span className="text-green-600 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  15%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
                <Card>
          <CardHeader>
            <CardTitle>最近订单</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* 桌面端表格显示 */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单号</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>运营商</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>日期</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{order.phone_number}</TableCell>
                      <TableCell>¥{order.amount}</TableCell>
                      <TableCell>{order.carrier}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* 移动端卡片显示 */}
            <div className="sm:hidden">
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm truncate">{order.order_id}</div>
                        <div className="ml-2">{getStatusBadge(order.status)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="text-gray-500">手机号:</div>
                        <div>{order.phone_number}</div>
                        <div className="text-gray-500">金额:</div>
                        <div>¥{order.amount}</div>
                        <div className="text-gray-500">运营商:</div>
                        <div>{order.carrier}</div>
                        <div className="text-gray-500">日期:</div>
                        <div className="text-xs">{formatDate(order.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">没有最近订单</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
