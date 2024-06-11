import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddProduct = () => {
  return (
    <div className="flex items-center h-screen mx-auto w-full justify-center">
      <form className="p-2 h-fit border">
        <Input label="Product Name" />
        <Input label="Price" />
        <Button type="submit">Add Product</Button>
      </form>
    </div>
  );
};

export const Route = createLazyFileRoute("/add-product")({
  component: AddProduct,
});
