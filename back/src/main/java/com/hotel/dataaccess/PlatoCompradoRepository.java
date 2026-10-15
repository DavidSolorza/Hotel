package com.hotel.dataaccess;

import com.hotel.models.PlatoComprado;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatoCompradoRepository extends JpaRepository<PlatoComprado, Long> {

    List<PlatoComprado> findByClienteId(Long clienteId);

    List<PlatoComprado> findByTipoPlatoId(Long tipoPlatoId);

    /**
     * Reporte 1 (Suma intermedia):
     * Calcular el valor total de los platos comprados por los clientes que se hospedaron
     * en una habitación durante un periodo indicado.
     */
    @Query("SELECT COALESCE(SUM(pc.valorTotal), 0) FROM PlatoComprado pc " +
           "WHERE pc.cliente.id IN (" +
           "  SELECT DISTINCT r.cliente.id FROM Reserva r " +
           "  WHERE r.habitacion.id = :habitacionId " +
           "  AND r.fechaInicio <= :fechaFin AND r.fechaFin >= :fechaInicio" +
           ")")
    BigDecimal sumTotalPlatosByHabitacionAndPeriodo(@Param("habitacionId") Long habitacionId,
                                                  @Param("fechaInicio") LocalDate fechaInicio,
                                                  @Param("fechaFin") LocalDate fechaFin);

    /**
     * Reporte 2 (Suma fácil):
     * Calcular el total pagado por las compras de platos registradas para un cliente seleccionado.
     */
    @Query("SELECT COALESCE(SUM(pc.valorTotal), 0) FROM PlatoComprado pc WHERE pc.cliente.id = :clienteId")
    BigDecimal sumTotalByClienteId(@Param("clienteId") Long clienteId);

    /**
     * Reporte 4 (Conteo fácil):
     * Contar cuántos platos compró un cliente seleccionado (sumatoria de cantidades).
     */
    @Query("SELECT COALESCE(SUM(pc.cantidad), 0) FROM PlatoComprado pc WHERE pc.cliente.id = :clienteId")
    Long countPlatosByClienteId(@Param("clienteId") Long clienteId);

    /**
     * Reporte 5 (Promedio intermedio):
     * Calcular el promedio del valor de las compras de platos realizadas por los clientes
     * que reservaron habitaciones del hotel.
     */
    @Query("SELECT COALESCE(AVG(pc.valorTotal), 0.0) FROM PlatoComprado pc " +
           "WHERE pc.cliente.id IN (SELECT DISTINCT r.cliente.id FROM Reserva r)")
    Double avgValorComprasClientesConReserva();

    /**
     * Reporte 6 (Promedio fácil):
     * Calcular el valor promedio de los platos comprados por un cliente seleccionado.
     */
    @Query("SELECT COALESCE(AVG(pc.valorTotal), 0.0) FROM PlatoComprado pc WHERE pc.cliente.id = :clienteId")
    Double avgValorComprasByClienteId(@Param("clienteId") Long clienteId);

    /**
     * Reporte 7 (Máximo intermedio):
     * Identificar el plato de mayor valor comprado por los clientes que se hospedaron
     * en una habitación seleccionada.
     */
    @Query("SELECT pc FROM PlatoComprado pc " +
           "WHERE pc.cliente.id IN (SELECT DISTINCT r.cliente.id FROM Reserva r WHERE r.habitacion.id = :habitacionId) " +
           "ORDER BY pc.valorUnitario DESC")
    List<PlatoComprado> findPlatosMayorValorByHabitacion(@Param("habitacionId") Long habitacionId);

    /**
     * Reporte 8 (Mínimo fácil):
     * Identificar el plato de menor valor entre las compras de un cliente seleccionado.
     */
    @Query("SELECT pc FROM PlatoComprado pc WHERE pc.cliente.id = :clienteId ORDER BY pc.valorUnitario ASC")
    List<PlatoComprado> findPlatosMenorValorByCliente(@Param("clienteId") Long clienteId);
}
