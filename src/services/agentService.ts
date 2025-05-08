import { Agent, AgentTransaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// 代理登录
export const agentLogin = async (email: string, password: string): Promise<Agent> => {
  try {
    // 验证输入
    if (!email) throw new Error("邮箱不能为空");
    if (!password) throw new Error("密码不能为空");
    
    // 查询代理
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('email', email)
      .eq('password', password) // 将来应该使用哈希值比较
      .single();
    
    if (error || !data) {
      console.error("Error during agent login:", error);
      throw new Error("邮箱或密码错误");
    }
    
    // 检查代理状态
    if (data.status !== 'active') {
      throw new Error("您的账号已停用，请联系管理员");
    }
    
    // 更新代理登录状态
    await supabase
      .from('agents')
      .update({
        is_online: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);
      
    // 不要返回密码
    const returnData = {
      ...data,
      password: undefined
    } as Agent;
    
    return returnData;
  } catch (error) {
    console.error("Error in agentLogin:", error);
    throw error;
  }
};

// 代理登出
export const agentLogout = async (agentId: string): Promise<boolean> => {
  try {
    // 更新代理在线状态
    const { error } = await supabase
      .from('agents')
      .update({
        is_online: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', agentId);
    
    if (error) {
      console.error("Error during agent logout:", error);
      throw new Error("登出失败");
    }
    
    return true;
  } catch (error) {
    console.error("Error in agentLogout:", error);
    throw error;
  }
};

// 获取所有代理列表
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching agents:", error);
      throw new Error("获取代理列表失败");
    }
    
    return data as Agent[];
  } catch (error) {
    console.error("Error in getAgents:", error);
    throw error;
  }
};

// 获取单个代理信息
export const getAgentById = async (id: string): Promise<Agent | null> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching agent:", error);
      throw new Error("获取代理信息失败");
    }
    
    return data as Agent;
  } catch (error) {
    console.error("Error in getAgentById:", error);
    throw error;
  }
};

// 添加新代理 - 简化版本
export const addAgent = async (agent: Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'balance' | 'total_commission'>): Promise<Agent> => {
  try {
    // 基本验证
    if (!agent.name || !agent.email || !agent.phone || !agent.password) {
      throw new Error("所有字段必填");
    }
    
    // 调试信息
    console.log("添加代理", { agent });
    
    // 最简单的数据模型
    const simpleAgent = {
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      password: agent.password,
      commission_rate: agent.commission_rate || 0,
      status: 'active',
      balance: 0,
      total_commission: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // 直接插入
    const { data, error } = await supabase
      .from('agents')
      .insert(simpleAgent)
      .select();
    
    if (error) {
      console.error("添加代理失败", error);
      throw new Error("添加代理失败: " + error.message);
    }
    
    return data?.[0] as Agent;
  } catch (error) {
    console.error("addAgent错误", error);
    throw error;
  }
};

// 更新代理信息
export const updateAgent = async (id: string, updates: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>): Promise<Agent> => {
  try {
    // 验证更新内容
    if (updates.commission_rate !== undefined && (updates.commission_rate < 0 || updates.commission_rate > 100)) {
      throw new Error("佣金比例必须在0-100之间");
    }
    
    // 准备更新数据
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // 更新数据库
    const { data, error } = await supabase
      .from('agents')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating agent:", error);
      throw new Error("更新代理信息失败");
    }
    
    return data as Agent;
  } catch (error) {
    console.error("Error in updateAgent:", error);
    throw error;
  }
};

// 删除代理
export const deleteAgent = async (id: string): Promise<boolean> => {
  try {
    // 检查是否有关联交易
    const { data: transactions, error: checkError } = await supabase
      .from('agent_transactions')
      .select('id')
      .eq('agent_id', id)
      .limit(1);
    
    if (checkError) {
      console.error("Error checking agent transactions:", checkError);
      throw new Error("检查代理交易记录失败");
    }
    
    if (transactions && transactions.length > 0) {
      throw new Error("该代理存在交易记录，无法删除");
    }
    
    // 执行删除
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting agent:", error);
      throw new Error("删除代理失败");
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteAgent:", error);
    throw error;
  }
};

// 获取代理交易记录
export const getAgentTransactions = async (agentId?: string): Promise<AgentTransaction[]> => {
  try {
    let query = supabase
      .from('agent_transactions')
      .select('*, agents(name)');
    
    if (agentId) {
      query = query.eq('agent_id', agentId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching agent transactions:", error);
      throw new Error("获取代理交易记录失败");
    }
    
    // 格式化数据，将agents.name转换为agent_name
    const formattedData = data.map(item => ({
      ...item,
      agent_name: item.agents?.name,
      agents: undefined
    }));
    
    return formattedData as AgentTransaction[];
  } catch (error) {
    console.error("Error in getAgentTransactions:", error);
    throw error;
  }
};

// 添加代理交易记录
export const addAgentTransaction = async (transaction: Omit<AgentTransaction, 'id' | 'created_at' | 'updated_at' | 'agent_name'>): Promise<AgentTransaction> => {
  try {
    // 验证输入
    if (!transaction.agent_id) throw new Error("代理ID不能为空");
    if (!transaction.amount) throw new Error("交易金额不能为空");
    if (!transaction.type) throw new Error("交易类型不能为空");
    
    // 准备新交易数据
    const newTransaction = {
      ...transaction,
      status: transaction.status || "completed" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // 开始数据库事务
    const { data, error } = await supabase.rpc('add_agent_transaction', {
      p_agent_id: transaction.agent_id,
      p_amount: transaction.amount,
      p_type: transaction.type,
      p_status: newTransaction.status,
      p_reference_id: transaction.reference_id || null,
      p_description: transaction.description || null
    });
    
    if (error) {
      console.error("Error adding agent transaction:", error);
      throw new Error("添加代理交易记录失败: " + error.message);
    }
    
    return data as AgentTransaction;
  } catch (error) {
    console.error("Error in addAgentTransaction:", error);
    throw error;
  }
};

// 获取代理统计数据
export const getAgentStats = async (): Promise<{ total: number, active: number, inactive: number }> => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('status');
    
    if (error) {
      console.error("Error fetching agent stats:", error);
      throw new Error("获取代理统计数据失败");
    }
    
    const total = data.length;
    const active = data.filter(agent => agent.status === 'active').length;
    const inactive = data.filter(agent => agent.status === 'inactive').length;
    
    return { total, active, inactive };
  } catch (error) {
    console.error("Error in getAgentStats:", error);
    throw error;
  }
};
