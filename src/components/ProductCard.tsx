import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  code: string;
  image: string;
  discount?: boolean;
  category?: string;
}

const ProductCard = ({ name, code, image, discount = true, category = "Health & Beauty" }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] border-border/50">
      <div className="relative overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-64 object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount && (
            <Badge variant="destructive" className="shadow-md">
              Discount Available
            </Badge>
          )}
          <Badge variant="secondary" className="shadow-md">
            {category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-1 text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Product code: {code}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button className="w-full gap-2" variant="default">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
