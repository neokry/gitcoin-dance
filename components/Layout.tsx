import Header from "./Header";
import Footer from "./Footer";
import { ReactChild, ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

//Overall layout for each page
export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
