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
            
            helper.setFrom("oradeamusiclab@gmail.com");
            helper.setTo(attendee.getEmail());

            if (attendee.getHasCheckedIn() != null && attendee.getHasCheckedIn()) {
                // Thank You Email
                helper.setSubject("Îți mulțumim pentru participare - Oradea Music Lab!");
                
                String htmlMsg = """
                        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background: #fcf9f2; border-radius: 12px;">
                            <h1 style="color: #ff914d;">Salutare, %s!</h1>
                            <p>Îți mulțumim enorm că te-ai înregistrat și ai participat la ediția noastră Oradea Music Lab (OML)!</p>
                            <p>Sperăm că te-ai simțit excelent, ai susținut noile talente locale și că ai savurat muzica alături de comunitatea noastră.</p>
                            <p style="margin-top: 20px; font-weight: bold; color: #ff914d;">Ne revedem la următorul open-mic!</p>
                        </div>
                        """.formatted(attendee.getFullName());
                
                helper.setText(htmlMsg, true);
            } else {
                // Ticket Email
                helper.setSubject("Biletul tău OML este aici!");
                
                String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + attendee.getQrToken();
                
                String htmlMsg = """
                        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background: #fcf9f2; border-radius: 12px;">
                            <h1 style="color: #ff914d;">Biletul tău OML este pregătit! 🎵</h1>
                            <p>Salutare, <strong>%s</strong>,</p>
                            <p style="margin-bottom: 20px;">Te-ai înregistrat cu succes la Oradea Music Lab. Te rugăm să pregătești codul QR de mai jos și să-l scanezi împreună cu staff-ul la intrarea în locație.</p>
                            <img src="%s" alt="Codul QR al biletului tău OML" style="margin: 20px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 10px; background: white;" />
                            <p style="font-size: 0.9em; color: gray;">Ticket ID: %s</p>
                            <p style="margin-top: 15px; font-weight: bold;">Abia așteptăm să te ascultăm / să te vedem în public!</p>
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
