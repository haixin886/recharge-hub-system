
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllOrders } from "@/services/orderManagement";
import { RechargeOrder } from "@/types";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import OrderDetailDialog from "@/components/OrderDetailDialog";

const Orders = () => {
  const [orders, setOrders] = useState<RechargeOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<RechargeOrder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user?.id) {
          setIsLoading(true);
          // getAllOrders 不再接受 userId 参数，获取所有订单后在客户端过滤
          const allOrders = await getAllOrders();
          
          // TODO: 目前数据库表没有用户关联，暂时显示所有订单
          // 后续需要在数据库中添加用户关联或根据其他方式过滤
          setOrders(allOrders);
          
          // 当数据库表添加了用户关联后，可以使用以下代码过滤：
          // const userOrders = allOrders.filter(order => order.user_id === user.id);
          // setOrders(userOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "获取订单失败",
          description: "无法获取您的充值订单，请稍后再试",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast, user]);

  // Format date function
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  };

  // Map order status to badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">已完成</Badge>;
      case "failed":
        return <Badge variant="destructive">失败</Badge>;
      case "pending":
      default:
        return <Badge variant="outline">处理中</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">我的订单</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>充值记录</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length > 0 ? (
              <>
                {/* 桌面版表格 - 在中等屏幕以上显示 */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead>充值号码</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>创建时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow 
                          key={order.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDialogOpen(true);
                          }}
                        >
                          <TableCell className="font-medium">{order.order_id.substring(0, 8)}</TableCell>
                          <TableCell>{order.phone_number}</TableCell>
                          <TableCell>¥{order.amount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* 移动版卡片列表 - 仅在小屏幕上显示 */}
                <div className="md:hidden space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold">订单号: {order.order_id.substring(0, 8)}</span>
                        <span>{getStatusBadge(order.status)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">充值号码:</span>
                        <span>{order.phone_number}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">金额:</span>
                        <span>¥{order.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">创建时间:</span>
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>您还没有充值记录</p>
                <p className="text-sm mt-2">完成充值后，订单将显示在这里</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* 订单详情对话框组件 */}
      <OrderDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
      />
    </Layout>
  );
};

export default Orders;
