
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPhoneCarrier } from "@/services/carrierDetection";
import { CarrierType, RechargeOption, BusinessType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { rechargePhone } from "@/services/rechargeOptions";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getUserWalletByUserId } from "@/services/walletService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getBusinessTypes, getProductsForBusinessType } from "@/services/businessService";

const Recharge: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [detecting, setDetecting] = useState<boolean>(false);
  const [carrier, setCarrier] = useState<CarrierType | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [parsedPhoneCount, setParsedPhoneCount] = useState<number>(0);
  const [options, setOptions] = useState<RechargeOption[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState<boolean>(true);
  const [discount, setDiscount] = useState<number>(0.2); // 折扣率 (20%)
  const [exchangeRate, setExchangeRate] = useState<number>(7.2); // 人民币兑USDT汇率
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");
  const [isLoadingBusinessTypes, setIsLoadingBusinessTypes] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch user wallet balance - 优化钱包加载性能
  useEffect(() => {
    let isMounted = true; // 组件挂载状态跟踪
    let timeoutId: NodeJS.Timeout | null = null;
    
    const fetchWalletBalance = async () => {
      if (!user) {
        setIsLoadingWallet(false);
        return;
      }
      
      // 高优先级显示一个占位值，避免空白闪烁
      setBalance(prev => prev ?? 0);
      
      try {
        setIsLoadingWallet(true);
        // 采用Promise.race设置超时，最多等待3秒
        const timeoutPromise = new Promise<null>((resolve) => {
          timeoutId = setTimeout(() => resolve(null), 3000);
        });
        
        const walletPromise = getUserWalletByUserId(user.id);
        const result = await Promise.race([walletPromise, timeoutPromise]);
        
        if (!isMounted) return;
        
        if (result !== null) {
          // 清除超时定时器
          if (timeoutId) clearTimeout(timeoutId);
          
          // 使用wallet数据
          setBalance(result.balance || 0);
        } else {
          // 超时处理逻辑，但仍然将会后台继续API调用
          console.log('Wallet data fetch timeout, showing cached or default value');
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error fetching wallet:", error);
        // 只在空余额时显示错误，避免繁琐通知
        if (balance === null) {
          toast({
            title: "获取钱包余额失败",
            description: "正在使用缓存数据，请刷新页面获取最新余额",
            variant: "default", // 降低严重程度，避免引起用户不必要的担忧
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingWallet(false);
        }
      }
    };
    
    // 立即调用一次
    fetchWalletBalance();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, toast, balance]);
  
  // 加载业务类型
  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        setIsLoadingBusinessTypes(true);
        const types = await getBusinessTypes();
        if (types && types.length > 0) {
          setBusinessTypes(types);
          // 默认选择第一个业务类型
          setSelectedBusinessType(types[0].id);
          console.log("加载业务类型成功:", types);
        }
      } catch (error) {
        console.error("加载业务类型失败:", error);
        toast({
          title: "加载业务类型失败",
          description: "无法获取业务类型，请刷新后重试",
          variant: "destructive"
        });
      } finally {
        setIsLoadingBusinessTypes(false);
      }
    };

    loadBusinessTypes();
  }, [toast]);

  // 根据选择的业务类型加载充值产品
  useEffect(() => {
    const loadProductsForBusinessType = async () => {
      if (!selectedBusinessType) return;
      
      try {
        setOptions([]);
        console.log("正在加载业务类型的充值产品:", selectedBusinessType);
        const products = await getProductsForBusinessType(selectedBusinessType);
        
        if (products && products.length > 0) {
          // 格式化产品选项
          const formattedOptions = products.map(product => ({
            value: product.value,
            label: `${product.value}元${product.discount ? ` (优惠${product.discount}元)` : ''}`,
            discount: product.discount
          }));
          setOptions(formattedOptions);
          console.log("成功加载产品:", formattedOptions);
          
          // 重置选择的金额和自定义金额
          setAmount(0);
          setCustomAmount('');
          setIsCustomAmount(false);
        } else {
          // 没有找到产品时使用默认选项
          const defaultOptions = [
            { value: 100, label: "100元" },
            { value: 200, label: "200元" }
          ];
          setOptions(defaultOptions);
          console.log("没有找到产品，使用默认选项");
        }
      } catch (error) {
        console.error("加载产品失败:", error);
        toast({
          title: "加载充值产品失败",
          description: "无法获取充值产品，请刷新后重试",
          variant: "destructive"
        });
      }
    };

    loadProductsForBusinessType();
  }, [selectedBusinessType, toast]);

  // Handle phone number change and autodetect carrier
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    if (isBatchMode) {
      // 批量模式：解析多行手机号
      const phoneLines = value.split('\n').filter(line => line.trim().length > 0);
      setParsedPhoneCount(phoneLines.length);
      
      // 如果有第一个有效的号码，用它来检测运营商
      const firstValidPhone = phoneLines.find(p => p.trim().replace(/\D/g, '').length === 11);
      if (firstValidPhone && firstValidPhone.length === 11) {
        detectCarrier(firstValidPhone);
      }
    } else {
      // 单个号码模式
      const cleanValue = value.replace(/\D/g, '').substring(0, 11);
      setPhoneNumber(cleanValue);
      setParsedPhoneCount(cleanValue.length === 11 ? 1 : 0);
      
      // Auto-detect carrier when phone number is 11 digits
      if (cleanValue.length === 11) {
        detectCarrier(cleanValue);
      } else if (carrier) {
        // Reset carrier when phone number changes
        setCarrier(null);
      }
    }
  };
  
  // Detect carrier from phone number
  const detectCarrier = useCallback(async (phone: string) => {
    if (phone.length !== 11) return;
    
    try {
      setDetecting(true);
      const detectedCarrier = await getPhoneCarrier(phone);
      setCarrier(detectedCarrier as CarrierType);
    } catch (error) {
      console.error("Error detecting carrier:", error);
      toast({
        title: "检测运营商失败",
        description: "无法自动检测运营商，请手动选择",
        variant: "destructive",
      });
    } finally {
      setDetecting(false);
    }
  }, [toast]);

  // Handle amount selection
  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setIsCustomAmount(false);
    setCustomAmount("");
  };

  // Handle custom amount change
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 仅允许数字输入
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setIsCustomAmount(true);
    
    // 如果有效金额，更新amount
    if (value && parseInt(value) > 0) {
      setAmount(parseInt(value));
    } else {
      setAmount(0);
    }
  };

  // Handle business type change
  const handleBusinessTypeChange = (typeId: string) => {
    setSelectedBusinessType(typeId);
  };

  // Handle recharge submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 检查用户是否已登录
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能提交充值订单",
        variant: "destructive"
      });
      // 重定向到登录页面
      navigate('/login', { state: { returnUrl: '/recharge' } });
      return;
    }

    // 校验表单
    if (!carrier) {
      toast({
        title: "请检查手机号",
        description: "无法检测到手机运营商，请输入有效的手机号码",
        variant: "destructive"
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "请选择充值金额",
        description: "请选择一个有效的充值金额或输入自定义金额",
        variant: "destructive"
      });
      return;
    }
    
    // 如果是自定义金额，做额外验证
    if (isCustomAmount) {
      if (parseInt(customAmount) < 1) {
        toast({
          title: "自定义金额无效",
          description: "自定义金额必须大于0元",
          variant: "destructive"
        });
        return;
      }
    }
    
    // 计算总金额（批量模式下是 amount * parsedPhoneCount）
    const totalAmount = isBatchMode ? amount * parsedPhoneCount : amount;
    const discountedTotal = totalAmount * (1 - discount); // 扣除折扣后的金额
    const usdtAmount = +(discountedTotal / exchangeRate).toFixed(2); // 转换为USDT
    
    // Check if user has enough balance
    if (balance !== null && usdtAmount > balance) {
      toast({
        title: "余额不足",
        description: "您的钱包余额不足，请先充值",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // 处理批量充值或单号码充值
      if (isBatchMode) {
        // 批量模式：解析多行手机号并逐个提交
        const phoneLines = phoneNumber.split('\n')
          .map(line => line.trim().replace(/\D/g, ''))
          .filter(line => line.length === 11);
          
        if (phoneLines.length === 0) {
          throw new Error("没有有效的手机号码");
        }
        
        // 批量充值，这里可以做成一个批量API调用
        const order = await rechargePhone({
          phoneNumber: phoneLines.join(','), // 用逗号分隔多个号码
          amount,
          carrier,
          userId: user.id,
          isBatch: true,
          batchCount: phoneLines.length,
          name: customerName || undefined
        });
        
        if (order) {
          toast({
            title: "批量充值申请已提交",
            description: `${phoneLines.length}个号码的充值申请已成功提交，正在处理中`,
          });
          navigate("/recharge/success", { 
            state: { 
              orderId: order.order_id,
              phoneNumbers: phoneLines,
              phoneNumber: phoneLines[0], // 第一个号码
              amount: order.amount,
              batchCount: phoneLines.length,
              isBatch: true,
              name: customerName || undefined,
              totalAmount: amount * phoneLines.length
            } 
          });
        }
      } else {
        // 单号码充值
        const order = await rechargePhone({
          phoneNumber,
          amount,
          carrier,
          userId: user.id,
          name: customerName || undefined
        });
        
        if (order) {
          toast({
            title: "充值申请已提交",
            description: "您的充值申请已成功提交，正在处理中",
          });
          navigate("/recharge/success", { 
            state: { 
              orderId: order.order_id,
              phoneNumber: order.phone_number,
              amount: order.amount,
              isBatch: false,
              name: customerName || undefined
            } 
          });
        }
      }
    } catch (error) {
      console.error("Error submitting recharge:", error);
      toast({
        title: "充值失败",
        description: "提交充值请求失败，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle carrier selection
  const handleCarrierChange = (value: string) => {
    setCarrier(value as CarrierType);
  };
  
  // 切换批量充值模式
  const toggleBatchMode = () => {
    setIsBatchMode(!isBatchMode);
    setPhoneNumber(""); // 切换模式时清空输入
    setParsedPhoneCount(0);
  };
  
  // 计算总金额、折扣和USDT金额
  const totalAmount = isBatchMode && parsedPhoneCount > 0 ? amount * parsedPhoneCount : amount;
  const discountAmount = totalAmount * discount;
  const finalAmount = totalAmount - discountAmount;
  const usdtAmount = +(finalAmount / exchangeRate).toFixed(2); // 转换为USDT并保留2位小数
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center">充值业务</h1>
        
        {isLoadingBusinessTypes ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">加载业务类型...</span>
          </div>
        ) : businessTypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">暂无可用的充值业务</p>
          </div>
        ) : (
          <Tabs 
            value={selectedBusinessType} 
            onValueChange={handleBusinessTypeChange}
            className="space-y-6"
          >
            <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(businessTypes.length, 4)}, 1fr)` }}>
              {businessTypes.map(type => (
                <TabsTrigger key={type.id} value={type.id}>
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* 在每个业务类型下显示对应的表单 */}
            {businessTypes.map(type => (
              <TabsContent key={type.id} value={type.id} className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="mb-6">
                        <Label htmlFor="customerName" className="text-base">
                          充值人姓名（选填）
                        </Label>
                        <Input
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="输入充值人姓名"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="phoneNumber" className="text-base">
                            手机号码
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsBatchMode(!isBatchMode)}
                          >
                            {isBatchMode ? "单个充值" : "批量充值"}
                          </Button>
                        </div>
                        
                        {isBatchMode ? (
                          <>
                            <Textarea
                              id="phoneNumber"
                              value={phoneNumber}
                              onChange={handlePhoneChange}
                              placeholder="请输入手机号码，每行一个"
                              className="min-h-[120px]"
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                              已成功识别 <span className="font-medium">{parsedPhoneCount}</span> 个手机号
                            </p>
                          </>
                        ) : (
                          <div className="relative">
                            <Input
                              id="phoneNumber"
                              value={phoneNumber}
                              onChange={handlePhoneChange}
                              placeholder="请输入手机号码"
                              maxLength={11}
                              className="pr-24"
                            />
                            {detecting ? (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              </div>
                            ) : carrier ? (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                                {carrier}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-base block">充值金额</Label>
                        
                        {/* 快捷金额选择 */}
                        <div className="grid grid-cols-3 gap-3">
                          {options.map((option) => {
                            const isSelected = amount === option.value && !isCustomAmount;
                            return (
                              <div 
                                key={option.value}
                                className={`relative rounded-md overflow-hidden transition-all duration-200 ${isSelected ? "ring-2 ring-primary" : ""}`}
                              >
                                <Button
                                  type="button"
                                  variant={isSelected ? "default" : "outline"}
                                  className={`w-full h-20 p-3 flex flex-col justify-center relative transition-all`}
                                  onClick={() => handleAmountSelect(option.value)}
                                >
                                  <div className="text-center w-full">
                                    <div className={`text-lg font-bold ${isSelected ? "text-white" : ""}`}>
                                      {option.value}元
                                    </div>
                                    {option.discount && (
                                      <div className={`text-xs font-medium px-2 py-0.5 mt-1 inline-block rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                                        优惠{option.discount}元
                                      </div>
                                    )}
                                  </div>
                                </Button>
                                {isSelected && (
                                  <div className="absolute top-0 right-0 bg-primary p-1 rounded-bl-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* 自定义金额输入 */}
                        <div className="mt-4">
                          <Label htmlFor="customAmount" className="text-sm">自定义金额</Label>
                          <div className="relative mt-1">
                            <Input
                              id="customAmount"
                              value={customAmount}
                              onChange={handleCustomAmountChange}
                              placeholder="输入自定义充值金额"
                              className={isCustomAmount ? "border-primary" : ""}
                            />
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                              <span className="text-muted-foreground">¥</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium">充值金额</span>
                        <span className="text-lg font-bold">
                          ¥{isBatchMode && parsedPhoneCount > 1 ? `${amount} x ${parsedPhoneCount} = ${amount * parsedPhoneCount}` : amount}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium">USDT价格</span>
                        <span className="text-lg">
                          {isBatchMode && parsedPhoneCount > 1 
                            ? `${(amount * parsedPhoneCount / exchangeRate).toFixed(2)}` 
                            : `${(amount / exchangeRate).toFixed(2)}`
                          } USDT
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>参考汇率: 1 USDT = {exchangeRate} CNY</span>
                      </div>
                      
                      {user && (
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-base font-medium">钱包余额</span>
                          {isLoadingWallet ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-lg font-bold">
                              {balance?.toFixed(2) || "0.00"} USDT
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      返回
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={loading || (!carrier) || amount <= 0 || (isBatchMode && parsedPhoneCount === 0)}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          处理中...
                        </>
                      ) : (
                        <>
                          立即充值
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Recharge;
