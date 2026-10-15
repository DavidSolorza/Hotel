package com.hotel.business;

import com.hotel.core.errors.BadRequestException;
import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.ClienteRepository;
import com.hotel.dataaccess.HabitacionRepository;
import com.hotel.dataaccess.ReservaRepository;
import com.hotel.models.Cliente;
import com.hotel.models.Habitacion;
import com.hotel.models.Reserva;
import com.hotel.presentation.dto.ReservaDTO;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final ClienteRepository clienteRepository;
    private final HabitacionRepository habitacionRepository;

    public ReservaService(ReservaRepository reservaRepository, ClienteRepository clienteRepository,
                          HabitacionRepository habitacionRepository) {
        this.reservaRepository = reservaRepository;
        this.clienteRepository = clienteRepository;
        this.habitacionRepository = habitacionRepository;
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> getAll() {
        return reservaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservaDTO getById(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));
        return toDTO(reserva);
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> getByClienteId(Long clienteId) {
        return reservaRepository.findByClienteId(clienteId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> getByHabitacionId(Long habitacionId) {
        return reservaRepository.findByHabitacionId(habitacionId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ReservaDTO create(ReservaDTO dto) {
        if (dto.getFechaFin().isBefore(dto.getFechaInicio())) {
            throw new BadRequestException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", dto.getClienteId()));

        Habitacion habitacion = habitacionRepository.findById(dto.getHabitacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Habitacion", dto.getHabitacionId()));

        BigDecimal total = dto.getTotalHospedaje();
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            long noches = Math.max(1, ChronoUnit.DAYS.between(dto.getFechaInicio(), dto.getFechaFin()));
            total = habitacion.getTarifaNoche().multiply(BigDecimal.valueOf(noches));
        }

        Reserva reserva = new Reserva();
        reserva.setCliente(cliente);
        reserva.setHabitacion(habitacion);
        reserva.setFechaReserva(dto.getFechaReserva() != null ? dto.getFechaReserva() : java.time.LocalDate.now());
        reserva.setFechaInicio(dto.getFechaInicio());
        reserva.setFechaFin(dto.getFechaFin());
        reserva.setEstado(dto.getEstado() != null ? dto.getEstado() : "CONFIRMADA");
        reserva.setTotalHospedaje(total);

        Reserva saved = reservaRepository.save(reserva);
        return toDTO(saved);
    }

    public ReservaDTO update(Long id, ReservaDTO dto) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));

        if (dto.getFechaFin() != null && dto.getFechaInicio() != null && dto.getFechaFin().isBefore(dto.getFechaInicio())) {
            throw new BadRequestException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        if (dto.getClienteId() != null && !dto.getClienteId().equals(reserva.getCliente().getId())) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente", dto.getClienteId()));
            reserva.setCliente(cliente);
        }

        if (dto.getHabitacionId() != null && !dto.getHabitacionId().equals(reserva.getHabitacion().getId())) {
            Habitacion habitacion = habitacionRepository.findById(dto.getHabitacionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Habitacion", dto.getHabitacionId()));
            reserva.setHabitacion(habitacion);
        }

        if (dto.getFechaReserva() != null) {
            reserva.setFechaReserva(dto.getFechaReserva());
        }
        if (dto.getFechaInicio() != null) {
            reserva.setFechaInicio(dto.getFechaInicio());
        }
        if (dto.getFechaFin() != null) {
            reserva.setFechaFin(dto.getFechaFin());
        }
        if (dto.getEstado() != null) {
            reserva.setEstado(dto.getEstado());
        }
        if (dto.getTotalHospedaje() != null) {
            reserva.setTotalHospedaje(dto.getTotalHospedaje());
        }

        Reserva updated = reservaRepository.save(reserva);
        return toDTO(updated);
    }

    public void delete(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));
        reservaRepository.delete(reserva);
    }

    public ReservaDTO toDTO(Reserva entity) {
        String nombreCliente = entity.getCliente().getNombres() + " " + entity.getCliente().getApellidos();
        return new ReservaDTO(
                entity.getId(),
                entity.getCliente().getId(),
                nombreCliente,
                entity.getHabitacion().getId(),
                entity.getHabitacion().getNumero(),
                entity.getFechaReserva(),
                entity.getFechaInicio(),
                entity.getFechaFin(),
                entity.getEstado(),
                entity.getTotalHospedaje()
        );
    }
}
