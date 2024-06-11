import React from "react";
import { Button } from "../ui/button";
import { PieChartIcon, HomeIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Link } from "@tanstack/react-router";
const Sidebar = () => {
  const links = [
    { name: "Product List", href: "/", icon: HomeIcon },
    { name: "Add Product", href: "/add-product", icon: PieChartIcon },
  ];

  return (
    <section className="h-screen w-fit border-r-2">
      <div className="flex flex-col gap-4 p-4">
        <TooltipProvider>
          {links.map((link, index) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={link.href}>
                  <Button key={index} variant="ghost" size="icon">
                    <link.icon className="h-6 w-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{link.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </section>
  );
};

export default Sidebar;
