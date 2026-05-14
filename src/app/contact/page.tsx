// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const InfoSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1a1a2e;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .icon {
    font-size: 2rem;
  }

  .content {
    flex: 1;

    h3 {
      margin-bottom: 0.25rem;
      font-size: 1rem;
    }

    p {
      color: #666;
      font-size: 0.875rem;
    }

    a {
      color: #667eea;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SuccessMessage = styled.div`
  background: #48bb7820;
  color: #48bb78;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: #f5656520;
  color: #f56565;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const HelpfulLinks = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;

  h3 {
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  ul {
    list-style: none;

    li {
      margin-bottom: 0.5rem;

      a {
        color: #667eea;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const OtsoMessage = styled.div`
  background: linear-gradient(135deg, #8b6914 0%, #a0822a 100%);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;

  .bear-icon {
    font-size: 3rem;
  }

  p {
    flex: 1;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

export default function ContactPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    // For now, just simulate sending (you can connect to a real email API later)
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 1000);

    // Uncomment this when you have an email API endpoint:
    /*
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again later.");
      setTimeout(() => setStatus("idle"), 5000);
    }
    */
  };

  return (
    <MainLayout>
      <Container>
        <PageHeader>
          <PageTitle>Contact Us</PageTitle>
          <PageDescription>
            Get in touch with Otso and the Finnish Buddy team
          </PageDescription>
        </PageHeader>

        <OtsoMessage>
          <div className="bear-icon">🐻</div>
          <p>
            Hei ystävä! Have a question, suggestion, or just want to say hello?
            I&apos;d love to hear from you! Fill out the form below or use one
            of the other contact methods. I&apos;ll get back to you as soon as I
            can! 💬
          </p>
        </OtsoMessage>

        <ContactGrid>
          <ContactForm>
            <h2 style={{ marginBottom: "1.5rem", color: "#1a1a2e" }}>
              Send us a message
            </h2>

            {status === "success" && (
              <SuccessMessage>
                🎉 Message sent successfully! Otso will reply soon.
              </SuccessMessage>
            )}

            {status === "error" && (
              <ErrorMessage>⚠️ {errorMessage}</ErrorMessage>
            )}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Your Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Subject</Label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Message</Label>
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  required
                />
              </FormGroup>
              <div style={{ width: "100%" }}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Message "}
                </Button>
              </div>
            </form>
          </ContactForm>

          <InfoSection>
            <h2 style={{ marginBottom: "1.5rem", color: "#1a1a2e" }}>
              Get in touch
            </h2>

            <InfoItem>
              <div className="content">
                <h3>Email</h3>
                <p>
                  <a href="mailto:hello@finnishbuddy.com">
                    hello@finnishbuddy.com
                  </a>
                </p>
              </div>
            </InfoItem>

            <InfoItem>
              <div className="content">
                <h3>Support</h3>
                <p>
                  <a href="mailto:support@finnishbuddy.com">
                    support@finnishbuddy.com
                  </a>
                </p>
              </div>
            </InfoItem>

            <InfoItem>
              <div className="content">
                <h3>Privacy</h3>
                <p>
                  <a href="mailto:privacy@finnishbuddy.com">
                    privacy@finnishbuddy.com
                  </a>
                </p>
              </div>
            </InfoItem>

            <InfoItem>
              <div className="content">
                <h3>Legal</h3>
                <p>
                  <a href="mailto:legal@finnishbuddy.com">
                    legal@finnishbuddy.com
                  </a>
                </p>
              </div>
            </InfoItem>

            <HelpfulLinks>
              <h3> Helpful Resources</h3>
              <ul>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/ask-otso">Ask Otso (Grammar Help)</Link>
                </li>
                <li>
                  <Link href="/levels">Browse All Levels</Link>
                </li>
              </ul>
            </HelpfulLinks>
          </InfoSection>
        </ContactGrid>
      </Container>
    </MainLayout>
  );
}
