package com.event.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendeeRepository extends JpaRepository<Attendee, UUID> {
    Optional<Attendee> findByQrToken(String qrToken);
}
