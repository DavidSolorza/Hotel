package com.hotel.dataaccess;

import com.hotel.models.Cliente;
import com.hotel.models.Reserva;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByClienteId(Long clienteId);
    List<Reserva> findByHabitacionId(Long habitacionId);

    /**
     * Clientes hospedados en una habitación específica durante un periodo indicado.
     */
    @Query("SELECT DISTINCT r.cliente FROM Reserva r " +
           "WHERE r.habitacion.id = :habitacionId " +
           "AND r.fechaInicio <= :fechaFin AND r.fechaFin >= :fechaInicio")
    List<Cliente> findClientesHospedadosEnPeriodo(@Param("habitacionId") Long habitacionId,
                                                @Param("fechaInicio") LocalDate fechaInicio,
                                                @Param("fechaFin") LocalDate fechaFin);

    /**
     * Clientes que realizaron reserva en una habitación determinada.
     */
    @Query("SELECT DISTINCT r.cliente FROM Reserva r WHERE r.habitacion.id = :habitacionId")
    List<Cliente> findClientesByHabitacionId(@Param("habitacionId") Long habitacionId);

    /**
     * Todos los clientes que han reservado alguna habitación del hotel.
     */
    @Query("SELECT DISTINCT r.cliente FROM Reserva r")
    List<Cliente> findAllClientesConReserva();
}
