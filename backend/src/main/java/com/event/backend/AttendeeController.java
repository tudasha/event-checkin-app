package com.event.backend;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendees")
public class AttendeeController {

    @Autowired
    private AttendeeRepository attendeeRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    @GetMapping
    public List<Attendee> getAllAttendees() {
        return attendeeRepository.findAll();
    }

    @GetMapping("/scan/{qrToken}")
    public ResponseEntity<?> getAttendeeByQrToken(@PathVariable String qrToken) {
        return attendeeRepository.findByQrToken(qrToken)
                .<ResponseEntity<?>>map(attendee -> {
                    if (Boolean.TRUE.equals(attendee.getHasCheckedIn())) {
                        return ResponseEntity.status(409).body("ALREADY_SCANNED");
                    }
                    if (Boolean.TRUE.equals(attendee.getHasPaid())) {
                        attendee.setHasCheckedIn(true);
                        attendeeRepository.save(attendee);
                    }
                    return ResponseEntity.ok(attendee);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Attendee registerAttendee(@Valid @RequestBody AttendeeRegistrationRequest request) {
        // Built server-side, field by field — hasPaid/hasCheckedIn always start false, id and
        // qrToken are always generated (Attendee's @PrePersist), never taken from the request.
        Attendee attendee = new Attendee();
        attendee.setTimestamp(LocalDateTime.now());
        attendee.setFullName(request.getFullName());
        attendee.setAge(request.getAge());
        attendee.setEmail(request.getEmail());
        attendee.setReferralSource(request.getReferralSource());
        attendee.setDietaryRestrictions(request.getDietaryRestrictions());
        attendee.setMediaConsent(request.getMediaConsent());
        attendee.setIsOver18(request.getIsOver18());
        attendee.setHasParentalConsent(request.getHasParentalConsent());
        attendee.setHasPaid(false);
        attendee.setHasCheckedIn(false);

        Attendee saved = attendeeRepository.save(attendee);
        emailService.sendRegistrationEmail(saved);
        return saved;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationError(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendee> updateAttendee(@PathVariable java.util.UUID id, @RequestBody Attendee attendeeDetails) {
        return attendeeRepository.findById(id).map(attendee -> {
            if (attendeeDetails.getFullName() != null) attendee.setFullName(attendeeDetails.getFullName());
            if (attendeeDetails.getAge() != null) attendee.setAge(attendeeDetails.getAge());
            if (attendeeDetails.getEmail() != null) attendee.setEmail(attendeeDetails.getEmail());
            return ResponseEntity.ok(attendeeRepository.save(attendee));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendee(@PathVariable java.util.UUID id) {
        if (attendeeRepository.existsById(id)) {
            attendeeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllAttendees() {
        attendeeRepository.deleteAll();
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Attendee> markAsPaid(@PathVariable java.util.UUID id) {
        return attendeeRepository.findById(id).map(attendee -> {
            attendee.setHasPaid(true);
            attendee.setHasCheckedIn(true);
            return ResponseEntity.ok(attendeeRepository.save(attendee));
        }).orElse(ResponseEntity.notFound().build());
    }
}
