import ProductCard from "./ProductCard";

const products = [
  {
    name: "Prostalisan",
    code: "PRN-14350",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
  },
  {
    name: "Nano Slim",
    code: "NNS-14293",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop",
  },
  {
    name: "Probamin™",
    code: "PBN-14270",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
  },
  {
    name: "Hyper Caps",
    code: "HPC-14225",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
  },
  {
    name: "Gastro Zen",
    code: "GST-14225",
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
  },
  {
    name: "Osteon Gel",
    code: "STG-14205",
    image: "https://images.unsplash.com/photo-1629116955159-e84c31e79d0f?w=400&h=400&fit=crop",
  },
  {
    name: "Jointerra",
    code: "JNR-14133",
    image: "https://images.unsplash.com/photo-1599932587935-567f7039b8ec?w=400&h=400&fit=crop",
  },
  {
    name: "Slimogi™",
    code: "SLM-14029",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop",
  },
  {
    name: "Reduslim™ Forte",
    code: "RDF-13999",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
  },
];

const ProductGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Health & Beauty Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our premium selection of natural supplements
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.code} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
