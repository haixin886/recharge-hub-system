import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import AgentManagement from "@/components/admin/agent-management/AgentManagement";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types";

const AgentsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentAdminProfile, setCurrentAdminProfile] = useState<AdminUser | null>(null);
  
  // 获取当前管理员的资料
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (user?.email) {
        try {
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
          
          if (error) throw error;
          setCurrentAdminProfile(data as AdminUser);
        } catch (error) {
          console.error("Error fetching admin profile:", error);
        }
      }
    };
    
    fetchAdminProfile();
  }, [user]);
  
  return (
    <AdminLayout currentUser={currentAdminProfile}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">代理管理</h2>
          <p className="text-muted-foreground">
            管理系统代理用户，设置佣金比例和查看代理业绩
          </p>
        </div>
        
        <AgentManagement currentUser={currentAdminProfile} />
      </div>
    </AdminLayout>
  );
};

export default AgentsPage;
