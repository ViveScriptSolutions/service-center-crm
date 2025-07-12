import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface JobCreatedEmailProps {
  jobId: number;
}

export const JobCreatedEmail = ({ jobId }: JobCreatedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your job has been created</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi there,</Text>
        <Text style={paragraph}>
          Your job with ID {jobId} has been successfully created.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default JobCreatedEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};
