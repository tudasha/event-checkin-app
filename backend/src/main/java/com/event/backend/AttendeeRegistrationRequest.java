package com.event.backend;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * What a self-service registration is actually allowed to set. Deliberately excludes
 * id/hasPaid/hasCheckedIn/qrToken — those are server-controlled (payment status only ever
 * flows from the verified Stripe webhook or an admin action, never from the public form).
 * Binding POST /api/attendees directly to the Attendee JPA entity let a caller set
 * "hasPaid": true on themselves and self-issue a free ticket; this DTO closes that.
 */
@Data
public class AttendeeRegistrationRequest {

    @NotBlank
    @Size(max = 200)
    private String fullName;

    @NotNull
    @Min(1)
    @Max(120)
    private Integer age;

    @Email
    @Size(max = 254)
    private String email;

    @Size(max = 100)
    private String referralSource;

    @Size(max = 500)
    private String dietaryRestrictions;

    private Boolean mediaConsent;

    private Boolean isOver18;

    private Boolean hasParentalConsent;
}
