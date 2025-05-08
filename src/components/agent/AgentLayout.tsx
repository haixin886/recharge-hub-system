import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { Loader2 } from "lucide-react";
import { Agent } from "@/types";

interface AgentLayoutProps {
  children: React.ReactNode;
}

const AgentLayout: React.FC<AgentLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isAgentChecking, setIsAgentChecking] = useState(true);
  
  // u786eu8ba4u4ee3u7406u767bu5f55u72b6u6001
  useEffect(() => {
    const checkAgentStatus = () => {
      const agentData = localStorage.getItem("agent");
      const agentLoggedIn = localStorage.getItem("agentLoggedIn");
      
      if (!agentData || !agentLoggedIn) {
        toast({
          variant: "destructive",
          title: "未登录",
          description: "请先登录代理账号",
        });
        navigate("/agent/login");
        return;
      }
      
      try {
        setAgent(JSON.parse(agentData));
      } catch (error) {
        console.error("Error parsing agent data:", error);
        localStorage.removeItem("agent");
        localStorage.removeItem("agentLoggedIn");
        navigate("/agent/login");
      } finally {
        setIsAgentChecking(false);
      }
    };
    
    checkAgentStatus();
  }, [navigate, toast]);
  
  // u663eu793au52a0u8f7du4e2du72b6u6001
  if (isAgentChecking) {
    return (
      <Layout>
        <div className="flex h-full min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-500">u6b63u5728u9a8cu8bc1u4ee3u7406u8d26u53f7...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // u4ee3u7406u672au767bu5f55u4e0du5c55u793au5185u5bb9
  if (!agent) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-6">
        {children}
      </div>
    </Layout>
  );
};

export default AgentLayout;
