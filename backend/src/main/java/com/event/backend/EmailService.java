package com.event.backend;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendRegistrationEmail(Attendee attendee) {
        if (attendee.getEmail() == null || attendee.getEmail().isBlank()) {
            return; // No email provided
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("tudasherxd@gmail.com");
            helper.setTo(attendee.getEmail());

            if (attendee.getHasCheckedIn() != null && attendee.getHasCheckedIn()) {
                // Thank You Email
                helper.setSubject("Thank You for Joining Us!");
                
                String htmlMsg = """
                        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background: #fcf9f2; border-radius: 12px;">
                            <h1 style="color: #ff914d;">Welcome, %s!</h1>
                            <p>Thank you so much for registering and checking in to our event today!</p>
                            <p>We hope you have an incredible time!</p>
                        </div>
                        """.formatted(attendee.getFullName());
                
                helper.setText(htmlMsg, true);
            } else {
                // Ticket Email
                helper.setSubject("Your Event Ticket is Here!");
                
                String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + attendee.getQrToken();
                
                String htmlMsg = """
                        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background: #fcf9f2; border-radius: 12px;">
                            <h1 style="color: #ff914d;">Your Ticket is Ready!</h1>
                            <p>Hi %s,</p>
                            <p style="margin-bottom: 20px;">You have successfully registered. Please present the QR code below at the entrance to check in.</p>
                            <img src="%s" alt="Your Ticket QR Code" style="margin: 20px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 10px; background: white;" />
                            <p style="font-size: 0.9em; color: gray;">Ticket ID: %s</p>
                        </div>
                        """.formatted(attendee.getFullName(), qrUrl, attendee.getQrToken());
                
                helper.setText(htmlMsg, true);
            }

            mailSender.send(message);
            System.out.println("Email successfully sent to: " + attendee.getEmail());
            
        } catch (MessagingException e) {
            System.err.println("Failed to send email to " + attendee.getEmail() + " : " + e.getMessage());
        }
    }
}
