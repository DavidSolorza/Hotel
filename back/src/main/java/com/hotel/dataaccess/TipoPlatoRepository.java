package com.hotel.dataaccess;

import com.hotel.models.TipoPlato;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoPlatoRepository extends JpaRepository<TipoPlato, Long> {
    List<TipoPlato> findByRestauranteId(Long restauranteId);
    List<TipoPlato> findByActivoTrue();
}
