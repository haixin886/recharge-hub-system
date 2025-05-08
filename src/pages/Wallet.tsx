
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { getPaymentAddresses } from "@/services/paymentService";
import { 
  getUserWalletByUserId,
  getWalletTransactionsByUserId,
  getWalletRechargeRequestsByUserId,
  ensureUserWallet
} from "@/services/walletService";
import { PaymentAddress, WalletTransaction, WalletRechargeRequest } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import the components we created
import WalletBalance from "@/components/wallet/WalletBalance";
import TransactionList, { CombinedTransactionItem } from "@/components/wallet/TransactionList";
import RechargeDialog from "@/components/wallet/RechargeDialog";

const WalletPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [paymentAddresses, setPaymentAddresses] = useState<PaymentAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rechargeRequests, setRechargeRequests] = useState<WalletRechargeRequest[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  
  // Fetch payment addresses
  useEffect(() => {
    const fetchPaymentAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const addresses = await getPaymentAddresses();
        setPaymentAddresses(addresses.filter(addr => addr.active));
        setIsLoadingAddresses(false);
      } catch (error) {
        console.error("Error fetching payment addresses:", error);
        setIsLoadingAddresses(false);
      }
    };
    
    fetchPaymentAddresses();
  }, []);
  
  // Fetch user wallet balance and transactions
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  const fetchUserData = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingBalance(true);
    setIsLoadingTransactions(true);
    try {
      console.log("Fetching wallet data for user:", user.id);
      
      // Ensure user has a wallet
      await ensureUserWallet(user.id);
      
      // Fetch wallet balance
      const wallet = await getUserWalletByUserId(user.id);
      console.log("User wallet data:", wallet);
      if (wallet) {
        setUserBalance(wallet.balance);
      } else {
        console.log("No wallet found for user, setting balance to 0");
        setUserBalance(0);
      }
      
      // Fetch wallet transactions
      const transactions = await getWalletTransactionsByUserId(user.id);
      console.log("User transactions:", transactions);
      setTransactions(transactions);
      
      // Fetch recharge requests
      const requests = await getWalletRechargeRequestsByUserId(user.id);
      console.log("User recharge requests:", requests);
      setRechargeRequests(requests);
    } catch (error) {
      console.error("Error fetching user wallet data:", error);
      toast({
        title: "获取钱包数据失败",
        description: "请稍后再试或联系客服",
        variant: "destructive",
      });
      setUserBalance(0);
    } finally {
      setIsLoadingBalance(false);
      setIsLoadingTransactions(false);
    }
  }, [user, toast]);

  // Add a polling interval to refresh wallet data periodically (every 30 seconds)
  useEffect(() => {
    if (!user) return;
    
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing wallet data...");
      fetchUserData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchUserData, user]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">未登录</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate("/auth")}>前往登录</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Combine transactions and recharge requests for display with proper typing
  const allTransactions: CombinedTransactionItem[] = [
    ...transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      date: tx.created_at,
      isTransaction: true,
      isRequest: false
    })),
    ...rechargeRequests.map(req => ({
      id: req.id,
      type: 'recharge',
      amount: req.amount,
      status: req.status,
      date: req.created_at,
      isTransaction: false,
      isRequest: true
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto">
          {/* Wallet balance card */}
          <WalletBalance 
            balance={userBalance} 
            isLoading={isLoadingBalance} 
            onRechargeClick={() => setShowRechargeDialog(true)} 
          />
          
          {/* Transaction list */}
          <TransactionList 
            transactions={allTransactions} 
            isLoading={isLoadingTransactions} 
          />
        </div>
      </div>

      {/* USDT Recharge Dialog */}
      <RechargeDialog 
        open={showRechargeDialog} 
        onOpenChange={setShowRechargeDialog}
        paymentAddresses={paymentAddresses}
        userId={user?.id || ''}
        isLoadingAddresses={isLoadingAddresses}
        onRechargeComplete={fetchUserData}
      />
    </Layout>
  );
};

export default WalletPage;
