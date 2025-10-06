import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Leaf, Award, Recycle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95">
        <img 
          src={heroBg} 
          alt="Natural herbs background" 
          className="w-full h-full object-cover mix-blend-overlay opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            Premium Natural Products
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Your Health, Our Priority
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Discover our selection of premium natural supplements and health products, 
            crafted with 100% natural ingredients and backed by quality control.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <Button size="lg" variant="secondary" className="font-semibold">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Learn More
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <CheckCircle className="h-8 w-8 text-white" />
              <span className="text-sm font-medium text-white text-center">Genuine Goods</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Leaf className="h-8 w-8 text-white" />
              <span className="text-sm font-medium text-white text-center">100% Natural</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Award className="h-8 w-8 text-white" />
              <span className="text-sm font-medium text-white text-center">Quality Control</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Recycle className="h-8 w-8 text-white" />
              <span className="text-sm font-medium text-white text-center">Eco-Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
