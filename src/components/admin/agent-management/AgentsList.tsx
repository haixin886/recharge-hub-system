import React from "react";
import { Agent } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";

interface AgentsListProps {
  agents: Agent[];
}

const AgentsList: React.FC<AgentsListProps> = ({ agents }) => {
  // 编辑代理信息
  const handleEditAgent = (agent: Agent) => {
    // 这里实际项目中实现编辑代理对话框
    console.log('编辑代理:', agent);
    alert('编辑代理功能待实现');
  };

  // 删除代理
  const handleDeleteAgent = (agent: Agent) => {
    // 这里实际项目中实现删除代理确认
    console.log('删除代理:', agent);
    alert('删除代理功能待实现');
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">名称</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>处理中订单</TableHead>
            <TableHead>已完成订单</TableHead>
            <TableHead>今日订单金额</TableHead>
            <TableHead>在线状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                暂无代理数据
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">{agent.name || "代理" + agent.id.slice(0, 4)}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium text-primary cursor-pointer hover:text-primary/80">{agent.processing_orders_count || 0}</span>
                    <span className="text-xs text-muted-foreground ml-1">笔</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium text-green-600">{agent.completed_orders_count || 0}</span>
                    <span className="text-xs text-muted-foreground ml-1">笔</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-primary">{formatAmount(agent.today_orders_amount || 0)}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={agent.is_online ? "default" : "outline"} className={agent.is_online ? "bg-green-500 hover:bg-green-500/80" : "text-muted-foreground"}>
                    {agent.is_online ? "在线" : "离线"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={() => handleEditAgent(agent)}
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      编辑
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-red-500 hover:text-red-500/90"
                      onClick={() => handleDeleteAgent(agent)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentsList;
