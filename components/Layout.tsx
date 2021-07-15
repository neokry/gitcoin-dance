import Header from "./Header";
import { ReactChild, ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

//Overall layout for each page
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="p-5">
      <Header />
      {children}
    </div>
  );
}
