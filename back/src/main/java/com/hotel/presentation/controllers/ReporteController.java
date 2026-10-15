package com.hotel.presentation.controllers;

import com.hotel.business.ReporteService;
import com.hotel.presentation.dto.ClienteDTO;
import com.hotel.presentation.dto.PlatoCompradoDTO;
import com.hotel.presentation.dto.ReporteDTO;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador de Reportes Analíticos (10 Reportes de Negocio)
 * Correspondiente a la especificación de la cátedra de Backend (Universidad de Caldas).
 */
@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    /**
     * 1. Suma (nivel intermedio):
     * Calcular el valor total de los platos comprados por los clientes que se hospedaron
     * en una habitación durante un periodo indicado.
     */
    @GetMapping("/suma/habitacion-periodo")
    public ResponseEntity<ReporteDTO.SumaReporteDTO> sumaPlatosPorHabitacionYPeriodo(
            @RequestParam Long habitacionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reporteService.sumaPlatosPorHabitacionYPeriodo(habitacionId, fechaInicio, fechaFin));
    }

    /**
     * 2. Suma (nivel fácil):
     * Calcular el total pagado por las compras de platos registradas para un cliente seleccionado.
     */
    @GetMapping("/suma/cliente/{clienteId}")
    public ResponseEntity<ReporteDTO.SumaReporteDTO> sumaTotalPagadoPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reporteService.sumaTotalPagadoPorCliente(clienteId));
    }

    /**
     * 3. Conteo (nivel intermedio):
     * Contar cuántos platos ha comprado cada cliente que realizó una reserva en una habitación determinada.
     */
    @GetMapping("/conteo/habitacion/{habitacionId}")
    public ResponseEntity<List<ReporteDTO.ConteoClienteDTO>> conteoPlatosPorClienteEnHabitacion(@PathVariable Long habitacionId) {
        return ResponseEntity.ok(reporteService.conteoPlatosPorClienteEnHabitacion(habitacionId));
    }

    /**
     * 4. Conteo (nivel fácil):
     * Contar cuántos platos compró un cliente seleccionado.
     */
    @GetMapping("/conteo/cliente/{clienteId}")
    public ResponseEntity<ReporteDTO.ConteoReporteDTO> conteoPlatosPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reporteService.conteoPlatosPorCliente(clienteId));
    }

    /**
     * 5. Promedio (nivel intermedio):
     * Calcular el promedio del valor de las compras de platos realizadas por los clientes que reservaron habitaciones del hotel.
     */
    @GetMapping("/promedio/clientes-con-reserva")
    public ResponseEntity<ReporteDTO.PromedioReporteDTO> promedioComprasClientesConReserva() {
        return ResponseEntity.ok(reporteService.promedioComprasClientesConReserva());
    }

    /**
     * 6. Promedio (nivel fácil):
     * Calcular el valor promedio de los platos comprados por un cliente seleccionado.
     */
    @GetMapping("/promedio/cliente/{clienteId}")
    public ResponseEntity<ReporteDTO.PromedioReporteDTO> promedioComprasPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reporteService.promedioComprasPorCliente(clienteId));
    }

    /**
     * 7. Máximo o mínimo (nivel intermedio):
     * Identificar el plato de mayor valor comprado por los clientes que se hospedaron en una habitación seleccionada.
     */
    @GetMapping("/extremo/mayor-valor/habitacion/{habitacionId}")
    public ResponseEntity<ReporteDTO.PlatoExtremoDTO> platoMayorValorPorHabitacion(@PathVariable Long habitacionId) {
        return ResponseEntity.ok(reporteService.platoMayorValorPorHabitacion(habitacionId));
    }

    /**
     * 8. Máximo o mínimo (nivel fácil):
     * Identificar el plato de menor valor entre las compras de un cliente seleccionado.
     */
    @GetMapping("/extremo/menor-valor/cliente/{clienteId}")
    public ResponseEntity<ReporteDTO.PlatoExtremoDTO> platoMenorValorPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reporteService.platoMenorValorPorCliente(clienteId));
    }

    /**
     * 9. Búsqueda (nivel intermedio):
     * Buscar los clientes que compraron un plato perteneciente a un tipo de plato indicado
     * y que además reservaron al menos una habitación en el hotel.
     */
    @GetMapping("/busqueda/tipo-plato-y-reserva")
    public ResponseEntity<List<ClienteDTO>> buscarClientesPorTipoPlatoYConReserva(@RequestParam Long tipoPlatoId) {
        return ResponseEntity.ok(reporteService.buscarClientesPorTipoPlatoYConReserva(tipoPlatoId));
    }

    /**
     * 10. Búsqueda (nivel fácil):
     * Buscar los platos comprados por un cliente seleccionado.
     */
    @GetMapping("/busqueda/platos-por-cliente/{clienteId}")
    public ResponseEntity<List<PlatoCompradoDTO>> buscarPlatosCompradosPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reporteService.buscarPlatosCompradosPorCliente(clienteId));
    }
}
