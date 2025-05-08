export type CarrierType = "中国移动" | "中国联通" | "中国电信";

export type RechargeOrder = {
  id?: string;
  order_id: string;
  phone_number: string;
  amount: number;
  carrier: CarrierType;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  completed_at?: string;
  name?: string;
  is_batch?: boolean;
  batch_count?: number;
  balance?: number;
  province?: string;
  city?: string;
  original_carrier?: string;
  user_id?: string; // 用户ID
  processed_by?: string; // 处理该订单的代理ID
  proof_image?: string; // 充值凭证图片URL
};

export interface User {
  id: string;
  email: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin?: boolean;
  admin_permissions?: string[];
}

// Admin user type specifically for the admin_users table
export type AdminUser = {
  id: string;
  email: string;
  is_admin: boolean;
  admin_permissions: string[];
  created_at: string;
  updated_at: string;
  sql_script?: string; // SQL脚本用于手动添加管理员
  password?: string; // 临时存储密码用于前端展示
};

export type DashboardStats = {
  totalRecharges: number;
  pendingRecharges: number;
  completedRecharges: number;
  failedRecharges: number;
  totalAmount: number;
};

export type RechargeOption = {
  value: number;
  label: string;
  discount?: number;
};

// New types for business management
export type BusinessType = {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RechargeProduct = {
  id: string;
  business_type_id: string;
  name: string;
  value: number;
  discount?: number;
  exchange_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// New types for finance management
export type PaymentAddressType = "TRC20" | "ERC20";

export type PaymentAddress = {
  id: string;
  type: PaymentAddressType;
  address: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type TransactionType = "deposit" | "withdrawal" | "adjustment";
export type TransactionStatus = "pending" | "completed" | "rejected";

export type WalletTransaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  transaction_hash?: string;
  network?: PaymentAddressType;
  reference_id?: string;
  note?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  user_email?: string; // For display purposes
};

export type UserWallet = {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
  user_email?: string; // For display purposes
};

// Add a new type for wallet recharge requests
export type WalletRechargeRequest = {
  id: string;
  user_id: string;
  amount: number;
  status: "pending" | "completed" | "rejected";
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  user_email?: string; // For display purposes
};

// Agent user type
export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // 登录密码，仅在创建时使用，不应返回到前端
  commission_rate: number; // u4f63u91d1u6bd4u4f8bu767eu5206u6bd4
  status: "active" | "inactive";
  balance: number; // u4ee3u7406u8d26u6237u4f59u989d
  total_commission: number; // u603bu8ba1u4f63u91d1
  created_at: string;
  updated_at: string;
  
  // u6dfbu52a0u56feu8868u4e2du663eu793au7684u5b57u6bb5
  processing_orders_count?: number; // u5904u7406u4e2du8ba2u5355u6570u91cf
  completed_orders_count?: number; // u5df2u5b8cu6210u8ba2u5355u6570u91cf
  today_orders_amount?: number; // u4eecu65e5u8ba2u5355u91d1u989d
  is_online?: boolean; // u5728u7ebfu72b6u6001
};

// Agent transaction record
export type AgentTransaction = {
  id: string;
  agent_id: string;
  amount: number;
  type: "commission" | "withdrawal" | "adjustment";
  status: "pending" | "completed" | "rejected";
  reference_id?: string; // u5173u8054u8ba2u5355u7f16u53f7u7b49
  description?: string;
  created_at: string;
  updated_at: string;
  agent_name?: string; // For display purposes
};
