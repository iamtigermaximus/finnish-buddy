// src/components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styled from "styled-components";
import Container from "./Container";

const HeaderContainer = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: ${(props) =>
    props.$scrolled ? "rgba(255, 255, 255, 0.98)" : "white"};
  backdrop-filter: ${(props) => (props.$scrolled ? "blur(10px)" : "none")};
  box-shadow: ${(props) =>
    props.$scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"};
  transition: all 0.3s ease;
  border-bottom: 1px solid #e0e0e0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a2e;
  text-decoration: none;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  span:first-child {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    span:first-child {
      font-size: 1.5rem;
    }
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.div<{ $isOpen: boolean }>`
  display: none;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #e0e0e0;

  ${(props) =>
    props.$isOpen &&
    `
    display: flex;
  `}
`;

const NavLink = styled(Link)`
  color: #1a1a2e;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: #1a1a2e;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #f56565;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(245, 101, 101, 0.1);
  }
`;

const LoginButton = styled(Link)`
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const SignupButton = styled(Link)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const BearAvatar = styled.span`
  font-size: 1.25rem;
  display: inline-block;
  animation: bounce 2s ease infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`;

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userName = session?.user?.name?.split(" ")[0] || "Buddy";

  return (
    <HeaderContainer $scrolled={scrolled}>
      <Container>
        <Nav>
          <Logo href="/">
            <span>🐻</span>
            <span>Finnish Buddy</span>
          </Logo>

          <DesktopNav>
            {session ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/levels">Levels</NavLink>
                <NavLink href="/progress">My Progress</NavLink>
                <UserName>
                  <BearAvatar>🐻</BearAvatar>
                  Hei, {userName}!
                </UserName>
                <LogoutButton onClick={() => signOut()}>Logout</LogoutButton>
              </>
            ) : (
              <>
                <NavLink href="/levels">Levels</NavLink>
                <LoginButton href="/login">Login</LoginButton>
                <SignupButton href="/register">Sign Up Free</SignupButton>
              </>
            )}
          </DesktopNav>

          <MobileMenuButton
            $isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </MobileMenuButton>

          <MobileNav $isOpen={isMenuOpen}>
            {session ? (
              <>
                <NavLink href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink href="/levels" onClick={() => setIsMenuOpen(false)}>
                  Levels
                </NavLink>
                <NavLink href="/progress" onClick={() => setIsMenuOpen(false)}>
                  My Progress
                </NavLink>
                <UserName>
                  <BearAvatar>🐻</BearAvatar>
                  Hei, {userName}!
                </UserName>
                <LogoutButton
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </LogoutButton>
              </>
            ) : (
              <>
                <NavLink href="/levels" onClick={() => setIsMenuOpen(false)}>
                  Levels
                </NavLink>
                <LoginButton href="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </LoginButton>
                <SignupButton
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up Free
                </SignupButton>
              </>
            )}
          </MobileNav>
        </Nav>
      </Container>
    </HeaderContainer>
  );
}
