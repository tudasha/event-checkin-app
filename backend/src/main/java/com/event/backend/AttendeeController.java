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

    @GetMapping
    public List<Attendee> getAllAttendees() {
        return attendeeRepository.findAll();
    }

    @GetMapping("/scan/{qrToken}")
    public ResponseEntity<Attendee> getAttendeeByQrToken(@PathVariable String qrToken) {
        return attendeeRepository.findByQrToken(qrToken)
                .map(attendee -> {
                    if (attendee.getHasPaid() != null && attendee.getHasPaid()) {
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

    @PutMapping("/{id}/pay")
    public ResponseEntity<Attendee> markAsPaid(@PathVariable java.util.UUID id) {
        return attendeeRepository.findById(id).map(attendee -> {
            attendee.setHasPaid(true);
            attendee.setHasCheckedIn(true);
            return ResponseEntity.ok(attendeeRepository.save(attendee));
        }).orElse(ResponseEntity.notFound().build());
    }
}
