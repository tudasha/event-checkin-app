package com.event.backend;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/stripe")
public class StripeWebhookController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @Autowired
    private AttendeeRepository attendeeRepository;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(
            @RequestHeader("Stripe-Signature") String sigHeader,
            @RequestBody String payload) {

        Stripe.apiKey = stripeApiKey;
        Event event = null;

        try {
            // Verify signature using the SDK
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            System.err.println("⚠️  Webhook error while validating signature.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signature Verification Failed");
        } catch (Exception e) {
            System.err.println("⚠️  Webhook payload parsing error.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

        // Handle the checkout.session.completed event
        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            String clientReferenceId = null;

            // Attempt pure object deserialization
            if (dataObjectDeserializer.getObject().isPresent()) {
                Session session = (Session) dataObjectDeserializer.getObject().get();
                clientReferenceId = session.getClientReferenceId();
            } else {
                // Fallback to Raw JSON if SDK version mismatches the payload API version
                String rawJsonString = dataObjectDeserializer.getRawJson();
                if (rawJsonString != null) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode rawJson = mapper.readTree(rawJsonString);
                        if (rawJson.has("client_reference_id") && !rawJson.get("client_reference_id").isNull()) {
                            clientReferenceId = rawJson.get("client_reference_id").asText();
                        }
                    } catch (Exception parseEx) {
                        System.err.println("⚠️ JSON Parser Error: " + parseEx.getMessage());
                    }
                }
                
                if (clientReferenceId == null) {
                    System.err.println("⚠️ Unable to deserialize session object and no client_reference_id found in raw JSON.");
                }
            }

            if (clientReferenceId != null && !clientReferenceId.isEmpty()) {
                try {
                    UUID attendeeId = UUID.fromString(clientReferenceId);
                    Optional<Attendee> optionalAttendee = attendeeRepository.findById(attendeeId);
                    
                    if (optionalAttendee.isPresent()) {
                        Attendee attendee = optionalAttendee.get();
                        attendee.setHasPaid(true); // Mark as paid!
                        attendeeRepository.save(attendee);
                        System.out.println("✅ Attendee " + attendee.getId() + " marked as PAID via Stripe Webhook!");
                    } else {
                        System.err.println("⚠️  Attendee not found for client_reference_id: " + clientReferenceId);
                    }
                } catch (IllegalArgumentException e) {
                    System.err.println("⚠️  Invalid UUID passed as client_reference_id: " + clientReferenceId);
                }
            }
        }

        return ResponseEntity.ok("Success");
    }
}
