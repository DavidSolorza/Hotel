package com.hotel.dataaccess;

import com.hotel.models.Habitacion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {
    List<Habitacion> findByHotelId(Long hotelId);
    List<Habitacion> findByEstado(String estado);
    Optional<Habitacion> findByHotelIdAndNumero(Long hotelId, String numero);
}
