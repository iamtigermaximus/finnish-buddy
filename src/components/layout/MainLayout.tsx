// src/components/layout/MainLayout.tsx
"use client";

import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const Main = styled.main`
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <LayoutWrapper>
      {showHeader && <Header />}
      <Main>{children}</Main>
      {showFooter && <Footer />}
    </LayoutWrapper>
  );
}
