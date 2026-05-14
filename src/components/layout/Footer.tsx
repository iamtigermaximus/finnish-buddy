// src/components/layout/Footer.tsx
"use client";

import styled from "styled-components";
import Link from "next/link";
import Container from "./Container";

const FooterContainer = styled.footer`
  background: ${(props) => props.theme.colors.text};
  color: white;
  margin-top: auto;
  padding: ${(props) => props.theme.spacing.xxl} 0
    ${(props) => props.theme.spacing.lg};
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    gap: ${(props) => props.theme.spacing.lg};
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.125rem;
    margin-bottom: ${(props) => props.theme.spacing.md};
    color: white;
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${(props) => props.theme.colors.border};
  text-decoration: none;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${(props) => props.theme.colors.border};
  text-decoration: none;
  font-size: 1.25rem;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: ${(props) => props.theme.colors.border};
  font-size: 0.75rem;
`;

const BearIcon = styled.span`
  font-size: 1rem;
  display: inline-block;
  margin: 0 0.25rem;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <Container>
        <FooterGrid>
          <FooterSection>
            <h3>🐻 Finnish Buddy</h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#ccc",
                marginTop: "0.5rem",
              }}
            >
              Learn Finnish with Otso the bear. From A1 to C2 mastery.
            </p>
            {/* <SocialLinks>
              <SocialLink href="#" target="_blank">
                📘
              </SocialLink>
              <SocialLink href="#" target="_blank">
                🐦
              </SocialLink>
              <SocialLink href="#" target="_blank">
                📷
              </SocialLink>
            </SocialLinks> */}
          </FooterSection>

          <FooterSection>
            <h3>Learning</h3>
            <FooterLink href="/levels">All Levels</FooterLink>
            <FooterLink href="/levels?level=A1">A1 Beginner</FooterLink>
            <FooterLink href="/levels?level=A2">A2 Elementary</FooterLink>
            <FooterLink href="/levels?level=B1">B1 Intermediate</FooterLink>
            <FooterLink href="/levels?level=B2">
              B2 Upper Intermediate
            </FooterLink>
            <FooterLink href="/levels?level=C1">C1 Advanced</FooterLink>{" "}
            <FooterLink href="/levels?level=C2">C2 Proficient</FooterLink>
          </FooterSection>

          {/* <FooterSection>
            <h3>Resources</h3>
            <FooterLink href="/grammar">Grammar Guide</FooterLink>
            <FooterLink href="/vocabulary">Vocabulary</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
          </FooterSection> */}

          <FooterSection>
            <h3>Company</h3>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </FooterSection>
        </FooterGrid>

        <Copyright>
          © 2025 Finnish Buddy <BearIcon>🐻</BearIcon> Learn Finnish with a
          Friend. All rights reserved.
        </Copyright>
      </Container>
    </FooterContainer>
  );
}
