import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UploadFile } from "@/integrations/Core";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, PlusCircle, Edit, Trash2, EyeOff, Eye, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProductForm = ({ product, onSave, isProcessing }) => {
    const [formData, setFormData] = useState(product || {
        name: '', brand: '', stock_quantity: 0, base_price_gold: 0, base_price_silver: 0, image_url: '', description: '',
        highlights: [''], details: { size: '', purity: '', weight: '', origin: '', packaging: '' }, is_active: true
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        setFormData(product || {
            name: '', brand: '', stock_quantity: 0, base_price_gold: 0, base_price_silver: 0, image_url: '', description: '',
            highlights: [''], details: { size: '', purity: '', weight: '', origin: '', packaging: '' }, is_active: true
        });
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("details.")) {
            const detailKey = name.split('.')[1];
            setFormData(prev => ({...prev, details: {...prev.details, [detailKey]: value}}));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleHighlightChange = (index, value) => {
        const newHighlights = [...formData.highlights];
        newHighlights[index] = value;
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };
    
    const addHighlight = () => setFormData(prev => ({...prev, highlights: [...prev.highlights, '']}));
    const removeHighlight = (index) => setFormData(prev => ({...prev, highlights: prev.highlights.filter((_, i) => i !== index)}));

    const handleSave = async (e) => {
        e.preventDefault();
        let finalData = { ...formData };
        if (imageFile) {
            const { file_url } = await UploadFile({ file: imageFile });
            finalData.image_url = file_url;
        }
        
        // Calculate redemption prices with 5% markup
        if (finalData.base_price_gold > 0) {
            finalData.redemption_price_gold = Number(finalData.base_price_gold) * 1.05;
        } else {
            finalData.redemption_price_gold = 0;
        }
        
        if (finalData.base_price_silver > 0) {
            finalData.redemption_price_silver = Number(finalData.base_price_silver) * 1.05;
        } else {
            finalData.redemption_price_silver = 0;
        }
        
        finalData.stock_quantity = Number(finalData.stock_quantity);
        finalData.base_price_gold = Number(finalData.base_price_gold);
        finalData.base_price_silver = Number(finalData.base_price_silver);
        
        onSave(finalData);
    };

    return (
        <form onSubmit={handleSave} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
             <div className="grid grid-cols-2 gap-4">
                <div><Label>Product Name</Label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
                <div><Label>Brand</Label><Input name="brand" value={formData.brand} onChange={handleChange} required /></div>
             </div>
             <div className="grid grid-cols-3 gap-4">
                <div><Label>Stock Quantity</Label><Input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required/></div>
                <div><Label>Base Price (GOLD)</Label><Input type="number" step="0.01" name="base_price_gold" value={formData.base_price_gold} onChange={handleChange}/></div>
                <div><Label>Base Price (SILVER)</Label><Input type="number" step="0.01" name="base_price_silver" value={formData.base_price_silver} onChange={handleChange}/></div>
             </div>
             <div><Label>Image Upload</Label><Input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" /> {formData.image_url && <img src={formData.image_url} className="w-20 h-20 mt-2 rounded" />}</div>
             <div><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleChange} /></div>
             <div>
                <Label>Highlights</Label>
                {formData.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 mb-2"><Input value={h} onChange={(e) => handleHighlightChange(i, e.target.value)} /><Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(i)}><Trash2 className="w-4 h-4"/></Button></div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>Add Highlight</Button>
             </div>
             <fieldset className="border p-4 rounded-lg space-y-2"><legend className="px-2 font-medium">Details</legend>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Size</Label><Input name="details.size" value={formData.details.size} onChange={handleChange} /></div>
                    <div><Label>Purity</Label><Input name="details.purity" value={formData.details.purity} onChange={handleChange} /></div>
                    <div><Label>Weight</Label><Input name="details.weight" value={formData.details.weight} onChange={handleChange} /></div>
                    <div><Label>Origin</Label><Input name="details.origin" value={formData.details.origin} onChange={handleChange} /></div>
                    <div className="col-span-2"><Label>Packaging</Label><Input name="details.packaging" value={formData.details.packaging} onChange={handleChange} /></div>
                </div>
             </fieldset>
             <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isProcessing}>{isProcessing ? <Loader2 className="animate-spin" /> : 'Save Product'}</Button>
            </DialogFooter>
        </form>
    );
};

export default function PhysicalInventory({ products, onUpdate, onDelete, isLoading }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const handleSave = async (data) => {
      setIsProcessing(true);
      await onUpdate(data);
      setIsProcessing(false);
      setIsFormOpen(false);
  };
  
  const openForm = (product = null) => {
      setSelectedProduct(product);
      setIsFormOpen(true);
  };

  const handleToggleStatus = async (product) => {
      const updatedProduct = { ...product, is_active: !product.is_active };
      await onUpdate(updatedProduct);
  };

  const filteredProducts = showInactive ? products : products.filter(p => p.is_active);
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" /> 
            Physical Inventory ({filteredProducts.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowInactive(!showInactive)}
              className="gap-2"
            >
              {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showInactive ? 'Show Active Only' : 'Show All Products'}
            </Button>
            <Button onClick={() => openForm()}><PlusCircle className="w-4 h-4 mr-2" /> Add Product</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Prices</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <tr><td colSpan="5"><Loader2 className="mx-auto my-8 animate-spin"/></td></tr> :
             filteredProducts.map(p => (
              <TableRow key={p.id} className={!p.is_active ? "opacity-60 bg-gray-50" : ""}>
                <TableCell className="flex items-center gap-3">
                    <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-white"/>
                    <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                    </div>
                </TableCell>
                <TableCell><Badge variant={p.stock_quantity > 0 ? "secondary" : "destructive"}>{p.stock_quantity}</Badge></TableCell>
                <TableCell className="font-mono text-sm">
                    {p.redemption_price_gold > 0 && <div>{p.redemption_price_gold.toFixed(2)} GOLD</div>}
                    {p.redemption_price_silver > 0 && <div>{p.redemption_price_silver.toFixed(2)} SILVER</div>}
                </TableCell>
                <TableCell>
                    <Badge variant={p.is_active ? "secondary" : "outline"} className={p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                        {p.is_active ? "Listed" : "Unlisted"}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => openForm(p)} title="Edit Product">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant={p.is_active ? "outline" : "secondary"} 
                            size="icon" 
                            onClick={() => handleToggleStatus(p)}
                            title={p.is_active ? "Unlist Product" : "List Product"}
                        >
                            {p.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" title="Delete Product">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to permanently delete "{p.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDelete(p.id)} className="bg-red-600 hover:bg-red-700">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>Fill in the details for the physical product.</DialogDescription>
            </DialogHeader>
            <ProductForm product={selectedProduct} onSave={handleSave} isProcessing={isProcessing} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}