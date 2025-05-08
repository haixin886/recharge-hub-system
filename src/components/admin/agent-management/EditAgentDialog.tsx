import React, { useState } from "react";
import { Agent } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { updateAgent } from "@/services/agentService";

interface EditAgentDialogProps {
  agent: Agent;
  onAgentUpdated: (agent: Agent) => void;
}

const EditAgentDialog: React.FC<EditAgentDialogProps> = ({ agent, onAgentUpdated }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: agent.name,
    email: agent.email,
    phone: agent.phone,
    commission_rate: agent.commission_rate,
    status: agent.status
  });
  const { toast } = useToast();

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 特殊处理佣金比例字段，确保是数字
    if (name === 'commission_rate') {
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : Math.min(Math.max(numValue, 0), 100),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // 处理状态选择变化
  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as "active" | "inactive",
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 验证表单
      if (!formData.name) throw new Error("代理名称不能为空");
      if (!formData.email) throw new Error("邮箱不能为空");
      if (!formData.phone) throw new Error("手机号不能为空");
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("邮箱格式不正确");
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error("手机号格式不正确");
      }

      // 更新代理
      const updatedAgent = await updateAgent(agent.id, formData);
      
      // 通知父组件更新
      onAgentUpdated(updatedAgent);
      
      toast({
        title: "更新成功",
        description: `代理 ${updatedAgent.name} 信息已更新`,
        variant: "default",
      });
      
      // 关闭对话框
      setDialogOpen(false);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: error instanceof Error ? error.message : "未知错误",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑代理</DialogTitle>
          <DialogDescription>
            更新代理用户的信息和佣金比例
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                代理名称
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                邮箱
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                手机号
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commission_rate" className="text-right">
                佣金比例(%)
              </Label>
              <Input
                id="commission_rate"
                name="commission_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.commission_rate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                状态
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中
                </>
              ) : (
                "保存"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgentDialog;
