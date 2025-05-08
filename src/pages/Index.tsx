import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowRight, Phone, ShieldCheck, Zap } from "lucide-react";
import { rechargeOptions } from "@/services/orderService";

const Index = () => {
  const navigate = useNavigate();

  const goToRecharge = () => {
    navigate("/recharge");
  };

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            快速安全的<span className="text-blue-600">手机话费充值</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            使用畅充宝立即为您的手机充值。 
            支持所有主要运营商，并提供独家优惠。
          </p>
          <Button onClick={goToRecharge} size="lg" className="text-lg px-8">
            立即充值 <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>即时充值</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  通过我们的快速处理系统，几秒钟内为手机充值。无延迟，无等待。
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>100% 安全</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  您的支付和个人信息受到银行级别的安全保护。
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>全部运营商</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持中国移动、中国联通、中国电信等多家运营商。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">热门充值选项</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {rechargeOptions.map((option) => (
              <div 
                key={option.value} 
                className="recharge-option"
                onClick={goToRecharge}
              >
                <p className="text-2xl font-bold text-blue-600">{option.label}</p>
                {option.discount && (
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full mt-2">
                    省 ¥{option.discount}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" onClick={goToRecharge}>
              查看所有选项
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">受到数千用户信赖</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                "畅充宝在我急需给手机充值时帮了我大忙。
                服务快速可靠！"
              </p>
              <p className="font-semibold">— 张伟</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                "我喜欢大额充值时的折扣。我已经使用这项服务几个月了。"
              </p>
              <p className="font-semibold">— 李梅</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                "我用过的最好的充值平台。界面简单，处理即时。"
              </p>
              <p className="font-semibold">— 王杰</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
