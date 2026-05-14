// src/app/terms/page.tsx
"use client";

import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Link from "next/link";

const PageHeader = styled.div`
  text-align: center;
  padding: 3rem 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PageDescription = styled.p`
  color: #666;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: #999;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 1rem;
  margin-top: 1.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const SubSectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a1a2e;
  margin: 1.25rem 0 0.75rem;
`;

const Text = styled.p`
  color: #444;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  margin: 1rem 0 1rem 1.5rem;
  color: #444;
  line-height: 1.6;

  li {
    margin-bottom: 0.5rem;
  }
`;

const Divider = styled.hr`
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #e0e0e0;
`;

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MainLayout>
      <Container>
        <PageHeader>
          <PageTitle>Terms of Service</PageTitle>
          <PageDescription>
            The rules and guidelines for using Finnish Buddy
          </PageDescription>
          {/* <LastUpdated>Last Updated: {currentDate}</LastUpdated> */}
        </PageHeader>

        <ContentSection>
          <SectionTitle>1. Acceptance of Terms</SectionTitle>
          <Text>
            By accessing or using Finnish Buddy (&quot;we,&quot;
            &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these
            Terms of Service (&quot;Terms&quot;). If you do not agree to these
            Terms, please do not use our services.
          </Text>

          <SectionTitle>2. Description of Service</SectionTitle>
          <Text>
            Finnish Buddy is an online language learning platform that provides
            AI-powered Finnish lessons, quizzes, practice exercises, and grammar
            explanations. Our service includes:
          </Text>
          <List>
            <li>Interactive lessons for all CEFR levels (A1 to C2)</li>
            <li>AI-generated quizzes and practice exercises</li>
            <li>Progress tracking and personalized learning paths</li>
            <li>Grammar assistant &quot;Ask Otso&quot; feature</li>
            <li>Word of the Day vocabulary building</li>
          </List>

          <SectionTitle>3. User Accounts</SectionTitle>
          <SubSectionTitle>3.1 Account Creation</SubSectionTitle>
          <Text>
            To access certain features, you must create an account. You agree to
            provide accurate, current, and complete information during
            registration and to update it as necessary.
          </Text>

          <SubSectionTitle>3.2 Account Security</SubSectionTitle>
          <Text>
            You are responsible for safeguarding your password and for all
            activities that occur under your account. You agree to notify us
            immediately of any unauthorized use of your account.
          </Text>

          <SubSectionTitle>3.3 Account Termination</SubSectionTitle>
          <Text>
            We reserve the right to suspend or terminate your account at our
            sole discretion, without notice, for conduct that violates these
            Terms or is harmful to other users or us.
          </Text>

          <SectionTitle>4. User Conduct</SectionTitle>
          <Text>You agree not to:</Text>
          <List>
            <li>
              Use the service for any illegal purpose or in violation of any
              laws
            </li>
            <li>
              Attempt to gain unauthorized access to our systems or other
              users&apos; accounts
            </li>
            <li>Interfere with or disrupt the service or servers</li>
            <li>
              Reverse engineer, decompile, or disassemble any part of the
              service
            </li>
            <li>
              Use the service to transmit viruses, malware, or harmful code
            </li>
            <li>Harass, abuse, or harm other users</li>
            <li>Impersonate any person or entity</li>
            <li>
              Use automated means to access the service (bots, scrapers, etc.)
            </li>
          </List>

          <SectionTitle>5. Intellectual Property</SectionTitle>
          <SubSectionTitle>5.1 Our Content</SubSectionTitle>
          <Text>
            Finnish Buddy and its original content, features, and functionality
            are owned by us and are protected by copyright, trademark, and other
            intellectual property laws. You may not copy, modify, distribute, or
            create derivative works without our express permission.
          </Text>

          <SubSectionTitle>5.2 User Content</SubSectionTitle>
          <Text>
            You retain ownership of your answers, progress data, and other
            content you submit. By submitting content, you grant us a license to
            use it to provide and improve our services.
          </Text>

          <SectionTitle>6. AI-Generated Content</SectionTitle>
          <Text>
            Finnish Buddy uses artificial intelligence to generate lessons,
            quizzes, and explanations. While we strive for accuracy,
            AI-generated content may contain errors. You agree to use the
            content as a learning aid and not as a sole source of factual
            information.
          </Text>

          <SectionTitle>7. Payments and Subscriptions</SectionTitle>
          <Text>
            Finnish Buddy currently offers free access to all features. If we
            introduce paid plans in the future, we will notify you and provide
            clear terms for billing, cancellations, and refunds.
          </Text>

          <SectionTitle>8. Third-Party Links</SectionTitle>
          <Text>
            Our service may contain links to third-party websites. We are not
            responsible for the content, privacy policies, or practices of any
            third-party sites.
          </Text>

          <SectionTitle>9. Disclaimer of Warranties</SectionTitle>
          <Text>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
            IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
            ERROR-FREE, OR SECURE.
          </Text>

          <SectionTitle>10. Limitation of Liability</SectionTitle>
          <Text>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL FINNISH
            BUDDY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION,
            LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH
            YOUR USE OF THE SERVICE.
          </Text>

          <SectionTitle>11. Indemnification</SectionTitle>
          <Text>
            You agree to indemnify and hold harmless Finnish Buddy and its
            employees from any claims, damages, losses, liabilities, costs, or
            expenses arising from your use of the service or violation of these
            Terms.
          </Text>

          <SectionTitle>12. Modifications to Service</SectionTitle>
          <Text>
            We reserve the right to modify, suspend, or discontinue any part of
            the service at any time without notice. We will not be liable to you
            or any third party for any modification, suspension, or
            discontinuation.
          </Text>

          <SectionTitle>13. Changes to Terms</SectionTitle>
          <Text>
            We may update these Terms from time to time. We will notify you of
            any changes by posting the new Terms on this page. Your continued
            use of the service after changes become effective constitutes
            acceptance of the new Terms.
          </Text>

          <SectionTitle>14. Governing Law</SectionTitle>
          <Text>
            These Terms shall be governed by and construed in accordance with
            the laws of Finland, without regard to its conflict of law
            provisions.
          </Text>

          <SectionTitle>15. Severability</SectionTitle>
          <Text>
            If any provision of these Terms is found to be unenforceable or
            invalid, that provision shall be limited or eliminated to the
            minimum extent necessary, and the remaining provisions shall remain
            in full force and effect.
          </Text>

          <SectionTitle>16. Entire Agreement</SectionTitle>
          <Text>
            These Terms constitute the entire agreement between you and Finnish
            Buddy regarding your use of the service and supersede all prior
            agreements.
          </Text>

          <SectionTitle>17. Contact Information</SectionTitle>
          <Text>
            If you have any questions about these Terms, please contact us:
          </Text>
          <List>
            <li>
              Email: <strong>legal@finnishbuddy.com</strong>
            </li>
            <li>
              Through our website: <Link href="/contact">Contact Us</Link>
            </li>
          </List>
        </ContentSection>
      </Container>
    </MainLayout>
  );
}
