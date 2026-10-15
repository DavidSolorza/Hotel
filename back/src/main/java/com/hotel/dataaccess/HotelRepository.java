package com.hotel.dataaccess;

import com.hotel.models.Hotel;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    Optional<Hotel> findByCorreo(String correo);
    List<Hotel> findByActivoTrue();
}
