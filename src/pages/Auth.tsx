
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'react-router-dom';
import Layout from "@/components/Layout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get the return path from URL param or default to "/"
  const returnTo = searchParams.get('returnTo') || "/";

  const renderAuthForm = () => {
    if (showForgotPassword) {
      return (
        <ForgotPasswordForm 
          email={email} 
          setEmail={setEmail} 
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      );
    }

    if (isLogin) {
      return (
        <LoginForm 
          email={email}
          setEmail={setEmail}
          onForgotPassword={() => setShowForgotPassword(true)}
          onSwitchToSignup={() => setIsLogin(false)}
          returnTo={returnTo}
        />
      );
    }

    return (
      <SignupForm 
        email={email}
        setEmail={setEmail}
        onSwitchToLogin={() => setIsLogin(true)}
        returnTo={returnTo}
      />
    );
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {showForgotPassword ? "重置密码" : isLogin ? "登录" : "注册"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {renderAuthForm()}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
