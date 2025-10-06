import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Shield, Truck, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const products = {
  prostalisan: {
    name: "Prostalisan",
    code: "PRO-001",
    price: 89.90,
    oldPrice: 159.90,
    discount: 44,
    category: "Men's Health",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=500&fit=crop",
    description: "Advanced formula for prostate health and urinary function support. Natural ingredients clinically proven.",
    benefits: ["Supports prostate health", "Improves urinary flow", "Natural ingredients", "Clinically tested"]
  },
  "nano-slim": {
    name: "Nano Slim",
    code: "SLM-002",
    price: 79.90,
    oldPrice: 139.90,
    discount: 43,
    category: "Weight Loss",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&h=500&fit=crop",
    description: "Revolutionary nano-technology weight loss formula. Accelerate metabolism and burn fat naturally.",
    benefits: ["Burns fat naturally", "Boosts metabolism", "Reduces appetite", "Increases energy"]
  },
  detonic: {
    name: "Detonic",
    code: "DET-003",
    price: 94.90,
    oldPrice: 169.90,
    discount: 44,
    category: "Blood Pressure",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
    description: "Natural solution for healthy blood pressure levels. Supports cardiovascular health.",
    benefits: ["Maintains healthy BP", "Heart health support", "Natural formula", "Safe & effective"]
  }
};

const countries = [
  { code: "+1", name: "USA/Canada", flag: "🇺🇸" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
];

const ProductDetail = () => {
  const { productId } = useParams();
  const { toast } = useToast();
  const product = products[productId as keyof typeof products];

  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+55",
    phone: "",
    terms: false,
  });

  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms) {
      toast({
        title: "Please accept terms",
        description: "You must accept the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Send lead data to dr.cash via edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-lead`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            phone: `${formData.countryCode}${formData.phone}`,
            country: formData.countryCode,
            product: product.name,
            productCode: product.code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit order');
      }

      toast({
        title: "Order received!",
        description: "We'll contact you shortly to confirm your order.",
      });

      // Reset form
      setFormData({
        name: "",
        countryCode: "+55",
        phone: "",
        terms: false,
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <div className="absolute top-4 right-4 bg-destructive text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.benefits.map((benefit, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted text-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-xs">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">${product.oldPrice}</span>
                )}
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 bg-accent/20 border border-accent rounded-lg px-4 py-3 mb-6">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-semibold">Special price expires in:</span>
                <span className="text-2xl font-bold text-accent">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="text-xl font-semibold mb-4">Complete Your Order</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.countryCode}
                    onValueChange={(value) => setFormData({...formData, countryCode: value})}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => setFormData({...formData, terms: checked as boolean})}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the terms and conditions and privacy policy. I consent to receive information about my order.
                </Label>
              </div>

              <Button type="submit" size="lg" className="w-full text-lg py-6">
                ORDER NOW - Pay on Delivery
              </Button>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="text-xs">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="w-6 h-6 text-primary" />
                  <span className="text-xs">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <span className="text-xs">COD Available</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;