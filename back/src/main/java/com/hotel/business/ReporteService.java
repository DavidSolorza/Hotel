package com.hotel.business;

import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.ClienteRepository;
import com.hotel.dataaccess.HabitacionRepository;
import com.hotel.dataaccess.PlatoCompradoRepository;
import com.hotel.dataaccess.ReservaRepository;
import com.hotel.dataaccess.TipoPlatoRepository;
import com.hotel.models.Cliente;
import com.hotel.models.Habitacion;
import com.hotel.models.PlatoComprado;
import com.hotel.models.TipoPlato;
import com.hotel.presentation.dto.ClienteDTO;
import com.hotel.presentation.dto.PlatoCompradoDTO;
import com.hotel.presentation.dto.ReporteDTO;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Capa de Negocio (Business): Implementa los 10 reportes analíticos
 * requeridos en la especificación académica de la Cátedra de Backend (Universidad de Caldas).
 */
@Service
@Transactional(readOnly = true)
public class ReporteService {

    private final PlatoCompradoRepository platoCompradoRepository;
    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;
    private final ClienteRepository clienteRepository;
    private final TipoPlatoRepository tipoPlatoRepository;
    private final ClienteService clienteService;
    private final PlatoCompradoService platoCompradoService;

    public ReporteService(PlatoCompradoRepository platoCompradoRepository,
                          ReservaRepository reservaRepository,
                          HabitacionRepository habitacionRepository,
                          ClienteRepository clienteRepository,
                          TipoPlatoRepository tipoPlatoRepository,
                          ClienteService clienteService,
                          PlatoCompradoService platoCompradoService) {
        this.platoCompradoRepository = platoCompradoRepository;
        this.reservaRepository = reservaRepository;
        this.habitacionRepository = habitacionRepository;
        this.clienteRepository = clienteRepository;
        this.tipoPlatoRepository = tipoPlatoRepository;
        this.clienteService = clienteService;
        this.platoCompradoService = platoCompradoService;
    }

    /**
     * 1. Suma (nivel intermedio):
     * Calcular el valor total de los platos comprados por los clientes que se hospedaron
     * en una habitación durante un periodo indicado.
     */
    public ReporteDTO.SumaReporteDTO sumaPlatosPorHabitacionYPeriodo(Long habitacionId, LocalDate fechaInicio, LocalDate fechaFin) {
        Habitacion habitacion = habitacionRepository.findById(habitacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Habitacion", habitacionId));

        BigDecimal total = platoCompradoRepository.sumTotalPlatosByHabitacionAndPeriodo(habitacionId, fechaInicio, fechaFin);
        String desc = String.format("Total compras de platos por clientes hospedados en hab. %s entre %s y %s",
                habitacion.getNumero(), fechaInicio, fechaFin);

        return new ReporteDTO.SumaReporteDTO("Suma Intermedia", desc, total);
    }

    /**
     * 2. Suma (nivel fácil):
     * Calcular el total pagado por las compras de platos registradas para un cliente seleccionado.
     */
    public ReporteDTO.SumaReporteDTO sumaTotalPagadoPorCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", clienteId));

        BigDecimal total = platoCompradoRepository.sumTotalByClienteId(clienteId);
        String desc = String.format("Total pagado en platos por cliente %s %s (Doc: %s)",
                cliente.getNombres(), cliente.getApellidos(), cliente.getNumeroDocumento());

        return new ReporteDTO.SumaReporteDTO("Suma Fácil", desc, total);
    }

    /**
     * 3. Conteo (nivel intermedio):
     * Contar cuántos platos ha comprado cada cliente que realizó una reserva en una habitación determinada.
     */
    public List<ReporteDTO.ConteoClienteDTO> conteoPlatosPorClienteEnHabitacion(Long habitacionId) {
        Habitacion habitacion = habitacionRepository.findById(habitacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Habitacion", habitacionId));

        List<Cliente> clientes = reservaRepository.findClientesByHabitacionId(habitacion.getId());
        List<ReporteDTO.ConteoClienteDTO> resultado = new ArrayList<>();

        for (Cliente cliente : clientes) {
            Long cantidadPlatos = platoCompradoRepository.countPlatosByClienteId(cliente.getId());
            resultado.add(new ReporteDTO.ConteoClienteDTO(
                    cliente.getId(),
                    cliente.getNumeroDocumento(),
                    cliente.getNombres() + " " + cliente.getApellidos(),
                    cantidadPlatos
            ));
        }

        return resultado;
    }

    /**
     * 4. Conteo (nivel fácil):
     * Contar cuántos platos compró un cliente seleccionado.
     */
    public ReporteDTO.ConteoReporteDTO conteoPlatosPorCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", clienteId));

        Long cantidad = platoCompradoRepository.countPlatosByClienteId(clienteId);
        String desc = String.format("Cantidad de platos comprados por cliente %s %s",
                cliente.getNombres(), cliente.getApellidos());

        return new ReporteDTO.ConteoReporteDTO("Conteo Fácil", desc, cantidad);
    }

    /**
     * 5. Promedio (nivel intermedio):
     * Calcular el promedio del valor de las compras de platos realizadas por los clientes que reservaron habitaciones del hotel.
     */
    public ReporteDTO.PromedioReporteDTO promedioComprasClientesConReserva() {
        Double promedio = platoCompradoRepository.avgValorComprasClientesConReserva();
        String desc = "Promedio del valor total de compras de platos por comensales que tienen reservas en el hotel";

        return new ReporteDTO.PromedioReporteDTO("Promedio Intermedio", desc, promedio);
    }

    /**
     * 6. Promedio (nivel fácil):
     * Calcular el valor promedio de los platos comprados por un cliente seleccionado.
     */
    public ReporteDTO.PromedioReporteDTO promedioComprasPorCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", clienteId));

        Double promedio = platoCompradoRepository.avgValorComprasByClienteId(clienteId);
        String desc = String.format("Promedio del valor de platos comprados por cliente %s %s",
                cliente.getNombres(), cliente.getApellidos());

        return new ReporteDTO.PromedioReporteDTO("Promedio Fácil", desc, promedio);
    }

    /**
     * 7. Máximo o mínimo (nivel intermedio):
     * Identificar el plato de mayor valor comprado por los clientes que se hospedaron en una habitación seleccionada.
     */
    public ReporteDTO.PlatoExtremoDTO platoMayorValorPorHabitacion(Long habitacionId) {
        habitacionRepository.findById(habitacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Habitacion", habitacionId));

        List<PlatoComprado> lista = platoCompradoRepository.findPlatosMayorValorByHabitacion(habitacionId);
        if (lista.isEmpty()) {
            throw new ResourceNotFoundException("Compras de platos para clientes de la habitacion", habitacionId);
        }

        PlatoComprado mayor = lista.get(0);
        return new ReporteDTO.PlatoExtremoDTO(
                "MAYOR_VALOR",
                mayor.getId(),
                mayor.getTipoPlato().getId(),
                mayor.getTipoPlato().getNombre(),
                mayor.getValorUnitario(),
                mayor.getValorTotal(),
                mayor.getCliente().getId(),
                mayor.getCliente().getNombres() + " " + mayor.getCliente().getApellidos(),
                mayor.getFechaCompra()
        );
    }

    /**
     * 8. Máximo o mínimo (nivel fácil):
     * Identificar el plato de menor valor entre las compras de un cliente seleccionado.
     */
    public ReporteDTO.PlatoExtremoDTO platoMenorValorPorCliente(Long clienteId) {
        clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", clienteId));

        List<PlatoComprado> lista = platoCompradoRepository.findPlatosMenorValorByCliente(clienteId);
        if (lista.isEmpty()) {
            throw new ResourceNotFoundException("Compras de platos para el cliente", clienteId);
        }

        PlatoComprado menor = lista.get(0);
        return new ReporteDTO.PlatoExtremoDTO(
                "MENOR_VALOR",
                menor.getId(),
                menor.getTipoPlato().getId(),
                menor.getTipoPlato().getNombre(),
                menor.getValorUnitario(),
                menor.getValorTotal(),
                menor.getCliente().getId(),
                menor.getCliente().getNombres() + " " + menor.getCliente().getApellidos(),
                menor.getFechaCompra()
        );
    }

    /**
     * 9. Búsqueda (nivel intermedio):
     * Buscar los clientes que compraron un plato perteneciente a un tipo de plato indicado
     * y que además reservaron al menos una habitación en el hotel.
     */
    public List<ClienteDTO> buscarClientesPorTipoPlatoYConReserva(Long tipoPlatoId) {
        tipoPlatoRepository.findById(tipoPlatoId)
                .orElseThrow(() -> new ResourceNotFoundException("TipoPlato", tipoPlatoId));

        return clienteRepository.findClientesByTipoPlatoCompradoYConReserva(tipoPlatoId).stream()
                .map(clienteService::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 10. Búsqueda (nivel fácil):
     * Buscar los platos comprados por un cliente seleccionado.
     */
    public List<PlatoCompradoDTO> buscarPlatosCompradosPorCliente(Long clienteId) {
        clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", clienteId));

        return platoCompradoRepository.findByClienteId(clienteId).stream()
                .map(platoCompradoService::toDTO)
                .collect(Collectors.toList());
    }
}
