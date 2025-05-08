import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Agent, RechargeOrder } from "@/types";
import AgentLayout from "@/components/agent/AgentLayout";
import ProcessOrderDialog from "@/components/agent/ProcessOrderDialog";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<RechargeOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<RechargeOrder | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  // 加载待处理订单
  const loadPendingOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('recharge_orders')
        .select('*')
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPendingOrders(data as RechargeOrder[]);
    } catch (error) {
      console.error("Error loading pending orders:", error);
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "无法加载待处理订单",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // 加载代理信息和订单
  useEffect(() => {
    // 获取存储的代理信息
    const agentData = localStorage.getItem("agent");
    console.log("从本地存储读取的代理数据:", agentData);
    
    if (!agentData) {
      toast({
        variant: "destructive",
        title: "未登录",
        description: "请先登录代理账号",
      });
      navigate("/vip");
      return;
    }
    
    try {
      // 确保解析正确
      const parsedAgent = JSON.parse(agentData);
      console.log("解析后的代理数据:", parsedAgent);
      
      if (!parsedAgent || !parsedAgent.id) {
        throw new Error("代理信息不完整");
      }
      
      // 如果收到已经解析的对象，直接使用
      setAgent(parsedAgent);
      
      // 添加日志显示设置后的agent值
      console.log("设置后的代理状态:", parsedAgent);
      
      // 加载订单列表
      loadPendingOrders();
    } catch (error) {
      console.error("代理数据解析错误:", error);
      localStorage.removeItem("agent");
      toast({
        variant: "destructive",
        title: "登录信息错误",
        description: "请重新登录代理账号",
      });
      navigate("/vip");
    }
  }, [navigate, toast, loadPendingOrders]);

  // 刷新订单列表
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPendingOrders();
    setIsRefreshing(false);
  };

  // 抢单
  const handleClaimOrder = async (order: RechargeOrder) => {
    try {
      if (!agent) {
        toast({
          variant: "destructive",
          title: "未登录",
          description: "请先登录代理账号",
        });
        return;
      }
      
      // 确保代理ID存在
      if (!agent.id) {
        throw new Error('代理信息不完整，请重新登录');
      }
      
      // 更新订单状态为处理中，并添加代理ID
      const { error } = await supabase
        .from('recharge_orders')
        .update({
          status: 'processing',
          processed_by: agent.id
        })
        .eq('id', order.id)
        .eq('status', 'pending'); // 确保只有待处理的订单可以被抢
      
      if (error) throw error;
      
      // 刷新订单列表
      await loadPendingOrders();
      
      toast({
        title: "抢单成功",
        description: `订单 ${order.order_id || ''}已被您锁定，请尽快处理`,
      });
      
      // 打开处理对话框
      openProcessDialog(order);
    } catch (error) {
      console.error("Error claiming order:", error);
      toast({
        variant: "destructive",
        title: "抢单失败",
        description: error instanceof Error ? error.message : "系统错误，请重试",
      });
    }
  };

  // 打开处理订单对话框
  const openProcessDialog = (order: RechargeOrder) => {
    setSelectedOrder(order);
    setProcessDialogOpen(true);
  };

  // 处理订单成功
  const handleOrderProcessed = async (processedOrder: RechargeOrder) => {
    toast({
      title: "处理成功",
      description: `订单 ${processedOrder.order_id || ''} 处理完成`,
    });
    
    // 刷新订单列表
    await loadPendingOrders();
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem("agent");
    toast({
      title: "已退出登录",
    });
    navigate("/vip");
  };

  return (
    <AgentLayout>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">代理控制台</h2>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待处理订单</CardTitle>
              <Badge variant="outline">{pendingOrders.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                待处理订单数量
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="space-y-0">
            <div className="flex items-center justify-between">
              <CardTitle>待处理充值订单</CardTitle>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                刷新
              </Button>
            </div>
            <CardDescription>
              点击处理按钮来完成或标记订单失败
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                当前没有待处理的订单
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单编号</TableHead>
                      <TableHead>充值金额</TableHead>
                      <TableHead>运营商/归属地</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.map((order, index) => {
                      // 格式化订单ID - 如果order_id看起来像UUID或哈希值，则使用友好格式代替
                      const displayOrderId = order.order_id && order.order_id.length > 20 
                        ? `订单-${String(index+1).padStart(3, '0')}` 
                        : order.order_id || `订单-${String(index+1).padStart(3, '0')}`;
                      
                      // 格式化创建时间
                      const orderDate = order.created_at 
                        ? new Date(order.created_at).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '未知时间';
                        
                      // 格式化运营商信息
                      const carrierDisplay = typeof order.carrier === 'string' && order.carrier.length < 20 
                        ? order.carrier
                        : '未知运营商';
                        
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{displayOrderId}</span>
                              <span className="text-xs text-muted-foreground">{order.phone_number}</span>
                              <span className="text-xs text-muted-foreground">{orderDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-primary">￥{order.amount || 0}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{carrierDisplay}</span>
                              <span className="text-xs text-muted-foreground">{order.city || '未知地区'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.processed_by ? (
                              <Badge variant="outline" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                已锁定
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">
                                新订单
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {order.processed_by ? (
                              order.processed_by === agent?.id ? (
                                <Button variant="default" className="w-full" onClick={() => openProcessDialog(order)}>
                                  查看详情
                                </Button>
                              ) : (
                                <Button variant="outline" className="w-full" disabled>
                                  已被锁定
                                </Button>
                              )
                            ) : (
                              <Button 
                                variant="default" 
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleClaimOrder(order)}
                              >
                                抢单
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* 处理订单对话框 */}
      {selectedOrder && (
        <ProcessOrderDialog 
          open={processDialogOpen} 
          onOpenChange={setProcessDialogOpen} 
          order={selectedOrder} 
          onOrderProcessed={(order) => {
            if (order) handleOrderProcessed(order);
          }}
          agentId={agent?.id ?? ''}
        />
      )}
    </AgentLayout>
  );
}
