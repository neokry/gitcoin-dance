import Header from "./Header";
import { ReactChild, ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="p-5">
      <Header />
      {children}
    </div>
  );
}
