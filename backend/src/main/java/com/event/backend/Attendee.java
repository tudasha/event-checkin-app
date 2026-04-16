package com.event.backend;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attendees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private Integer age;

    private String email;

    // "where did they find out about the event"
    private String referralSource;

    private String dietaryRestrictions;

    // "can pe photografed or filmed during the event"
    private Boolean mediaConsent;

    // "has above 18 years"
    private Boolean isOver18;

    // "if not if the parent has completed a declaration"
    private Boolean hasParentalConsent;

    // Has paid / donated
    private Boolean hasPaid;

    // Has the attendee checked in at the door?
    private Boolean hasCheckedIn = false;

    // Unique identifier stored in the QR code
    @Column(unique = true)
    private String qrToken;
    
    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (qrToken == null) {
            qrToken = UUID.randomUUID().toString();
        }
    }
}
