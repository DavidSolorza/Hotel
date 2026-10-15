package com.hotel.dataaccess;

import com.hotel.models.Restaurante;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {
    List<Restaurante> findByHotelId(Long hotelId);
    List<Restaurante> findByActivoTrue();
}
