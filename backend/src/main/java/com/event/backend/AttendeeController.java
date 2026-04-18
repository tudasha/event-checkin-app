package com.event.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Attendee registerAttendee(@RequestBody Attendee attendee) {
        Attendee saved = attendeeRepository.save(attendee);
        emailService.sendRegistrationEmail(saved);
        return saved;
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

    @PutMapping("/{id}/pay")
    public ResponseEntity<Attendee> markAsPaid(@PathVariable java.util.UUID id) {
        return attendeeRepository.findById(id).map(attendee -> {
            attendee.setHasPaid(true);
            attendee.setHasCheckedIn(true);
            return ResponseEntity.ok(attendeeRepository.save(attendee));
        }).orElse(ResponseEntity.notFound().build());
    }
}
