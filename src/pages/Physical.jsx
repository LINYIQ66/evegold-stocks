
import React, { useState, useEffect } from "react";
import { User, PhysicalProduct, PhysicalRedemption, Transaction } from "@/entities/all";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Package, ShieldCheck, Truck, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Physical() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [redemptionResult, setRedemptionResult] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [userData, productsData] = await Promise.all([
                User.me(),
                PhysicalProduct.filter({ is_active: true }, "-created_date")
            ]);
            setUser(userData);
            setProducts(productsData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
        setIsLoading(false);
    };

    const handleRedeemClick = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setRedemptionResult(null);
        setIsModalOpen(true);
    };

    const handleConfirmRedemption = async () => {
        if (!selectedProduct || !user) return;
        
        setIsProcessing(true);

        const isGoldProduct = (selectedProduct.redemption_price_gold || 0) > 0;
        const redemptionPrice = (isGoldProduct ? selectedProduct.redemption_price_gold : selectedProduct.redemption_price_silver) || 0;
        const userBalance = isGoldProduct ? (user.wallet_balances?.gold || 0) : (user.wallet_balances?.silver || 0);
        const costAsset = isGoldProduct ? 'gold' : 'silver';
        const totalCost = redemptionPrice * quantity;

        if (userBalance < totalCost) {
            setRedemptionResult({ success: false, message: `Insufficient ${costAsset.toUpperCase()} balance.` });
            setIsProcessing(false);
            return;
        }

        try {
            // Deduct from user's balance
            const newBalances = { ...user.wallet_balances };
            newBalances[costAsset] -= totalCost;
            await User.update(user.id, { wallet_balances: newBalances });

            // Decrement product stock
            const newStock = selectedProduct.stock_quantity - quantity;
            await PhysicalProduct.update(selectedProduct.id, { stock_quantity: newStock });

            // Create redemption record
            const redemptionData = {
                user_email: user.email,
                product_id: selectedProduct.id,
                product_name: selectedProduct.name,
                quantity: quantity,
                delivery_address: user.residential_address,
                status: "processing",
                total_cost_gold: isGoldProduct ? totalCost : 0,
                total_cost_silver: !isGoldProduct ? totalCost : 0,
            };
            await PhysicalRedemption.create(redemptionData);
            
            // Create transaction log
            await Transaction.create({
                transaction_type: "physical_redemption",
                user_email: user.email,
                from_asset: costAsset.toUpperCase(),
                amount_usd: 0, // USD value can be calculated if needed
                total_cost_gold: isGoldProduct ? totalCost : 0,
                total_cost_silver: !isGoldProduct ? totalCost : 0,
                status: "completed",
                description: `Redeemed ${quantity} x ${selectedProduct.name}`
            });

            setRedemptionResult({ success: true, message: "Redemption successful! Your order is being processed." });
            loadData(); // Refresh data
        } catch (error) {
            console.error("Redemption error:", error);
            setRedemptionResult({ success: false, message: "An error occurred during redemption. Please try again." });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const goldBalance = user?.wallet_balances?.gold || 0;
    const silverBalance = user?.wallet_balances?.silver || 0;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                                Physical Assets
                            </h1>
                            <p className="text-slate-600 mt-2">Redeem your digital assets for real, tangible products.</p>
                        </div>
                        <Card className="p-4 bg-white/50 backdrop-blur-sm">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <Coins className="w-6 h-6 text-yellow-500" />
                                    <div>
                                        <p className="text-sm text-slate-600">Your GOLD Balance</p>
                                        <p className="font-bold text-lg text-slate-900">{goldBalance.toFixed(4)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Coins className="w-6 h-6 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-600">Your SILVER Balance</p>
                                        <p className="font-bold text-lg text-slate-900">{silverBalance.toFixed(4)}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                    
                    {isLoading ? (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                            <SkeletonCard /> <SkeletonCard />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} onRedeemClick={handleRedeemClick} goldBalance={goldBalance} silverBalance={silverBalance}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedProduct && (
                 <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        {!redemptionResult ? (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Confirm Redemption</DialogTitle>
                                    <DialogDescription>
                                        You are about to redeem your GOLD for a physical item. Please review the details below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                        <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-20 h-20 object-contain rounded-md bg-white"/>
                                        <div>
                                            <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                                            <p className="text-sm text-slate-500">{selectedProduct.brand}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="quantity" className="font-medium">Quantity</label>
                                        <select
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="px-3 py-1 border rounded-md"
                                            disabled={isProcessing}
                                        >
                                            {[...Array(Math.min(3, selectedProduct.stock_quantity)).keys()].map(i => (
                                                <option key={i+1} value={i+1}>{i+1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="p-4 border rounded-lg space-y-2">
                                        <div className="flex justify-between"><span className="text-slate-600">Price per item:</span><span className="font-mono">{( (selectedProduct.redemption_price_gold > 0 ? selectedProduct.redemption_price_gold : selectedProduct.redemption_price_silver) || 0).toFixed(2)} {(selectedProduct.redemption_price_gold > 0 ? 'GOLD' : 'SILVER')}</span></div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-2"><span className="text-slate-800">Total Cost:</span><span className="font-mono text-blue-600">{ ( ((selectedProduct.redemption_price_gold > 0 ? selectedProduct.redemption_price_gold : selectedProduct.redemption_price_silver) || 0) * quantity).toFixed(4)} {(selectedProduct.redemption_price_gold > 0 ? 'GOLD' : 'SILVER')}</span></div>
                                    </div>
                                    <p className="text-xs text-slate-500">Delivery to your registered address: <br/><strong>{user?.residential_address || "Address not found"}</strong></p>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>Cancel</Button>
                                    <Button onClick={handleConfirmRedemption} disabled={isProcessing || ( (selectedProduct.redemption_price_gold > 0 ? goldBalance : silverBalance) < (((selectedProduct.redemption_price_gold > 0 ? selectedProduct.redemption_price_gold : selectedProduct.redemption_price_silver) || 0) * quantity))}>
                                        {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Confirm & Redeem'}
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : (
                            <div className="py-8 text-center">
                                {redemptionResult.success ? <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /> : <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />}
                                <h3 className="text-xl font-bold mb-2">{redemptionResult.success ? "Success!" : "Failed"}</h3>
                                <p className="text-slate-600 mb-6">{redemptionResult.message}</p>
                                <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

const ProductCard = ({ product, onRedeemClick, goldBalance, silverBalance }) => {
    const isGoldProduct = (product.redemption_price_gold || 0) > 0;
    const cost = (isGoldProduct ? product.redemption_price_gold : product.redemption_price_silver) || 0;
    const currency = isGoldProduct ? 'GOLD' : 'SILVER';
    const balance = isGoldProduct ? goldBalance : silverBalance;
    const canAfford = balance >= cost;
    const inStock = product.stock_quantity > 0;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-white flex items-center justify-center p-6">
                    <img src={product.image_url} alt={product.name} className="max-h-64 object-contain" />
                </div>
                <div className="md:w-2/3 p-6 flex flex-col">
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <Badge className="bg-yellow-400 text-yellow-900 mb-2">{product.brand}</Badge>
                             <Badge variant={inStock ? "secondary" : "destructive"} className="bg-green-100 text-green-800">{inStock ? `${product.stock_quantity} in stock` : 'Out of Stock'}</Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
                        <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600"/><span>Purity: {product.details.purity}</span></div>
                            <div className="flex items-center gap-2"><Package className="w-4 h-4 text-slate-600"/><span>Weight: {product.details.weight}</span></div>
                            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-slate-600"/><span>Origin: {product.details.origin}</span></div>
                            <div className="flex items-center gap-2"><Package className="w-4 h-4 text-slate-600"/><span>Packaging: {product.details.packaging}</span></div>
                        </div>
                        <div className="p-4 bg-slate-100 rounded-lg space-y-2">
                             {product.highlights.map((h, i) => <p key={i} className="text-xs text-slate-700">&#x2022; {h}</p>)}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-6 border-t">
                        <div className="mb-4 md:mb-0">
                             <p className="text-sm text-slate-600">Redemption Price</p>
                             <p className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                                <Coins className={`w-6 h-6 ${isGoldProduct ? 'text-yellow-500' : 'text-slate-400'}`}/>
                                {cost.toFixed(2)} {currency}
                             </p>
                             <p className="text-xs text-slate-500">Includes 5% admin & delivery fee</p>
                        </div>
                        <Button size="lg" onClick={() => onRedeemClick(product)} disabled={!canAfford || !inStock}>
                            { !inStock ? 'Out of Stock' : (!canAfford ? 'Insufficient Balance' : 'Redeem Now')}
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

const SkeletonCard = () => (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
        <div className="md:w-1/3 bg-slate-200 h-64 md:h-auto"></div>
        <div className="md:w-2/3 p-6 flex flex-col">
            <div className="flex-1">
                <div className="h-5 w-24 bg-slate-200 rounded mb-2"></div>
                <div className="h-8 w-3/4 bg-slate-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                </div>
                 <div className="p-4 bg-slate-100 rounded-lg space-y-2">
                     <div className="h-3 w-full bg-slate-200 rounded"></div>
                     <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
                 </div>
            </div>
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="h-10 w-32 bg-slate-200 rounded"></div>
                <div className="h-12 w-32 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
    </Card>
);
