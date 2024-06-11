import all_product from "@/assets/all_product";
import data_product from "@/assets/data";
import { createLazyFileRoute } from "@tanstack/react-router";

const Index = () => {
  return (
    <div className="h-screen">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <table className="w-[800px] h-screen overflow-y-scroll">
        <thead>
          <tr className="[&>th]:text-left">
            <th>SN</th>
            <th>Image</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>New Price</th>
            <th>Old Price</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {all_product.map((product) => (
            <tr key={product.id} className="py-2">
              <td>{product.id}</td>
              <td>
                <img src={product.image} alt={product.name} className="w-10" />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.new_price}</td>
              <td>{product.old_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
