// src/app/privacy/page.tsx
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  th,
  td {
    border: 1px solid #e0e0e0;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background: #f5f7fa;
    font-weight: 600;
  }
`;

const Divider = styled.hr`
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #e0e0e0;
`;

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MainLayout>
      <Container>
        <PageHeader>
          <PageTitle>Privacy Policy</PageTitle>
          <PageDescription>
            How Finnish Buddy collects, uses, and protects your information
          </PageDescription>
          {/* <LastUpdated>Last Updated: {currentDate}</LastUpdated> */}
        </PageHeader>

        <ContentSection>
          <SectionTitle>1. Introduction</SectionTitle>
          <Text>
            Welcome to Finnish Buddy (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;). We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our website and language learning application.
          </Text>
          <Text>
            By using Finnish Buddy, you agree to the collection and use of
            information in accordance with this policy. If you do not agree with
            any part of this policy, please do not use our services.
          </Text>

          <SectionTitle>2. Information We Collect</SectionTitle>
          <SubSectionTitle>
            2.1 Personal Information You Provide
          </SubSectionTitle>
          <List>
            <li>
              <strong>Account Information:</strong> Name, email address, and
              password when you create an account
            </li>
            <li>
              <strong>Profile Information:</strong> Your learning preferences
              and language goals
            </li>
            <li>
              <strong>User Content:</strong> Answers to quizzes, practice
              exercises, and questions you ask Otso
            </li>
            <li>
              <strong>Communication:</strong> Messages you send us for support
              or feedback
            </li>
          </List>

          <SubSectionTitle>
            2.2 Automatically Collected Information
          </SubSectionTitle>
          <List>
            <li>
              <strong>Usage Data:</strong> Topics viewed, quiz scores, time
              spent learning, and progress tracking
            </li>
            <li>
              <strong>Device Information:</strong> Browser type, operating
              system, and device type
            </li>
            <li>
              <strong>IP Address:</strong> For security and analytics purposes
            </li>
            <li>
              <strong>Cookies:</strong> To remember your preferences and keep
              you logged in
            </li>
          </List>

          <SectionTitle>3. How We Use Your Information</SectionTitle>
          <List>
            <li>
              To provide, operate, and maintain our language learning services
            </li>
            <li>
              To personalize your learning experience and track your progress
            </li>
            <li>To generate AI-powered lessons, quizzes, and explanations</li>
            <li>To improve our AI models and content quality</li>
            <li>To communicate with you about your account and updates</li>
            <li>
              To detect, prevent, and address technical issues and security
              concerns
            </li>
            <li>To comply with legal obligations</li>
          </List>

          <SectionTitle>4. AI and Data Processing</SectionTitle>
          <Text>
            Finnish Buddy uses AI to generate personalized lessons, quizzes, and
            grammar explanations. When you use these features, your questions
            and relevant context are sent to our AI provider to generate
            responses. This data is processed in real-time and is not used to
            train AI models unless explicitly stated.
          </Text>

          <SectionTitle>5. Data Sharing and Disclosure</SectionTitle>
          <SubSectionTitle>5.1 Third-Party Service Providers</SubSectionTitle>
          <Text>
            We may share your information with trusted third-party services that
            help us operate:
          </Text>
          <Table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Purpose</th>
                <th>Data Shared</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vercel</td>
                <td>Hosting and deployment</td>
                <td>Usage data, account info</td>
              </tr>
              <tr>
                <td>Supabase</td>
                <td>Database and authentication</td>
                <td>Account info, progress data</td>
              </tr>
              <tr>
                <td>DeepSeek</td>
                <td>AI content generation</td>
                <td>Questions, lesson context</td>
              </tr>
            </tbody>
          </Table>

          <SubSectionTitle>5.2 Legal Requirements</SubSectionTitle>
          <Text>
            We may disclose your information if required by law or in response
            to valid legal process, such as a court order or subpoena.
          </Text>

          <SectionTitle>6. Data Security</SectionTitle>
          <Text>
            We implement appropriate technical and organizational measures to
            protect your personal information, including encryption, secure
            servers, and access controls. However, no method of transmission
            over the Internet is 100% secure, and we cannot guarantee absolute
            security.
          </Text>

          <SectionTitle>7. Data Retention</SectionTitle>
          <Text>
            We retain your personal information for as long as your account is
            active. If you delete your account, we will delete your personal
            information within 30 days, except where we are required to retain
            it for legal compliance or legitimate business purposes.
          </Text>

          <SectionTitle>8. Your Rights</SectionTitle>
          <Text>
            Depending on your location, you may have the following rights:
          </Text>
          <List>
            <li>
              <strong>Access:</strong> Request a copy of your personal data
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate data
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal data
            </li>
            <li>
              <strong>Restriction:</strong> Request restriction of data
              processing
            </li>
            <li>
              <strong>Portability:</strong> Request transfer of your data
            </li>
            <li>
              <strong>Opt-out:</strong> Opt out of marketing communications
            </li>
          </List>
          <Text>
            To exercise these rights, please contact us at{" "}
            <strong>privacy@finnishbuddy.com</strong>.
          </Text>

          <SectionTitle>9. Children&apos;s Privacy</SectionTitle>
          <Text>
            Finnish Buddy is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us.
          </Text>

          <SectionTitle>10. Cookies and Tracking</SectionTitle>
          <Text>
            We use cookies and similar tracking technologies to track activity
            on our service and store certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent. However, some features may not function properly without
            cookies.
          </Text>

          <SectionTitle>11. International Data Transfers</SectionTitle>
          <Text>
            Your information may be transferred to and processed in countries
            other than your own. We take appropriate safeguards to ensure your
            data is protected in accordance with this Privacy Policy.
          </Text>

          <SectionTitle>12. Changes to This Privacy Policy</SectionTitle>
          <Text>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last Updated&quot; date. You are advised to
            review this Privacy Policy periodically for any changes.
          </Text>

          <SectionTitle>13. Contact Us</SectionTitle>
          <Text>
            If you have any questions about this Privacy Policy, please contact
            us:
          </Text>
          <List>
            <li>
              Email: <strong>privacy@finnishbuddy.com</strong>
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
