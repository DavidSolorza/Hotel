package com.hotel.dataaccess;

import com.hotel.models.Cliente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByNumeroDocumento(String numeroDocumento);

    /**
     * Reporte 9 (Búsqueda intermedia): Buscar los clientes que compraron un plato
     * perteneciente a un tipo de plato indicado y que además reservaron al menos una habitación en el hotel.
     */
    @Query("SELECT DISTINCT c FROM Cliente c " +
           "WHERE c.id IN (SELECT pc.cliente.id FROM PlatoComprado pc WHERE pc.tipoPlato.id = :tipoPlatoId) " +
           "AND c.id IN (SELECT r.cliente.id FROM Reserva r)")
    List<Cliente> findClientesByTipoPlatoCompradoYConReserva(@Param("tipoPlatoId") Long tipoPlatoId);
}
