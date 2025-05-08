import { FC, useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, XCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { RechargeOrder } from '@/types';

interface ProcessOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: RechargeOrder;
  onOrderProcessed: (order?: RechargeOrder) => void;
  agentId: string;
}

const ProcessOrderDialog: FC<ProcessOrderDialogProps> = ({ open, onOpenChange, order, onOrderProcessed, agentId }) => {
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'completed' | 'failed'>('completed');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // 处理图片上传
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: '无效的文件类型',
        description: '请上传图片文件（JPG, PNG, 等）'
      });
      return;
    }
    
    // 检查文件大小 (限制为5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: '文件过大',
        description: '请上传5MB以下的图片'
      });
      return;
    }
    
    setImageFile(file);
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // 上传图片到Supabase存储
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    try {
      // 创建唯一的文件名
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${order.order_id}_${Date.now()}.${fileExt}`;
      const filePath = `orderproofs/${fileName}`;
      
      // 上传到Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('orderproofs')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      // 获取公共URL
      const { data } = supabase.storage
        .from('orderproofs')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('上传图片失败:', error);
      toast({
        variant: 'destructive',
        title: '上传图片失败',
        description: '请稍后重试'
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // 处理订单状态变更
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const now = new Date().toISOString();
      
      // 如果选择完成并且有图片，则上传图片
      let proofImageUrl = null;
      if (result === 'completed' && imageFile) {
        proofImageUrl = await uploadImage();
        if (!proofImageUrl && result === 'completed') {
          toast({
            variant: 'destructive',
            title: '上传凭证失败',
            description: '无法上传充值凭证，请重试'
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // 更新订单状态
      const { data, error } = await supabase
        .from('recharge_orders')
        .update({
          status: result,
          processed_by: agentId,
          processed_at: now,
          process_notes: notes || '',  // 确保notes不为undefined
          proof_image: proofImageUrl // 保存凭证图片URL
        })
        .eq('id', order.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      // 如果是成功完成的订单，需要记录代理佣金
      if (result === 'completed') {
        // 查询代理的佣金比例 (假设在Supabase中有agents表)
        try {
          interface AgentData {
            id: string;
            name: string;
            commission_rate: number;
            balance: number;
            total_commission: number;
            [key: string]: any; // 其他可能的字段
          }
          
          const agentResponse = await supabase
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single();
          
          if (agentResponse.data && !agentResponse.error) {
            const agentData = agentResponse.data as AgentData;
            // 计算佣金 (订单金额 * 佣金比例%)
            const commissionRate = agentData.commission_rate || 0;
            const commissionAmount = (order.amount * commissionRate) / 100;
            
            if (commissionAmount > 0) {
              // 更新代理余额
              await supabase
                .from('agents')
                .update({
                  balance: (agentData.balance || 0) + commissionAmount,
                  total_commission: (agentData.total_commission || 0) + commissionAmount
                })
                .eq('id', agentId);
                
              // 添加交易记录
              await supabase
                .from('agent_transactions')
                .insert({
                  agent_id: agentId,
                  amount: commissionAmount,
                  type: 'commission',
                  status: 'completed',
                  reference_id: order.order_id,
                  description: `订单${order.order_id}的佣金 - ${order.phone_number}充值${order.amount}元`,
                  created_at: now,
                  updated_at: now
                });
            }
          }
        } catch (error) {
          console.error("处理代理佣金时出错:", error);
          // 继续执行，不中断订单处理过程
        }
      }
      
      // 更新成功，通知父组件
      onOrderProcessed(data as RechargeOrder);
      
      toast({
        title: result === 'completed' ? "订单已完成" : "订单已标记为失败",
        description: `订单 ${order.order_id} 已${result === 'completed' ? '成功处理' : '标记为失败'}`
      });
      
      // 关闭对话框
      onOpenChange(false);
    } catch (error) {
      console.error('处理订单时出错:', error);
      toast({
        variant: 'destructive',
        title: '处理订单失败',
        description: '处理订单时发生错误，请重试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>处理充值订单</DialogTitle>
          <DialogDescription>
            请选择处理结果并添加必要的备注信息。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">订单信息</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>订单编号: <span className="font-medium">{order.order_id}</span></div>
              <div>手机号码: <span className="font-medium">{order.phone_number}</span></div>
              <div>充值金额: <span className="font-medium">{order.amount} 元</span></div>
              <div>运营商: <span className="font-medium">{order.carrier}</span></div>
              <div>订单时间: <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span></div>
              <div>状态: <span className="font-medium">{order.status}</span></div>
              {order.city && <div>归属地: <span className="font-medium">{order.city}</span></div>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-base">处理结果</Label>
            <RadioGroup defaultValue="completed" value={result} onValueChange={(value) => setResult(value as 'completed' | 'failed')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  已完成充值
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="failed" id="failed" />
                <Label htmlFor="failed" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  充值失败
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-base">备注</Label>
            <Textarea
              id="notes"
              placeholder="添加备注信息后方便客户查询"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>

          {result === 'completed' && (
            <div className="grid gap-2">
              <Label className="text-base">上传充值凭证</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                    id="proof-image"
                  />
                  <Label htmlFor="proof-image" className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded-md flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    选择图片
                  </Label>
                </div>

                {imagePreview && (
                  <div className="relative border rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="充值凭证预览"
                      className="max-h-[200px] object-contain mx-auto p-2"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                    <p>上传充值交易凭证截图</p>
                    <p className="text-xs">支持JPG、PNG格式，大小不超过5MB</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading || (result === 'completed' && !imageFile)}
          >
            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? '上传图片中...' : '提交'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessOrderDialog;
