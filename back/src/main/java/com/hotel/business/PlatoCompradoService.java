package com.hotel.business;

import com.hotel.core.errors.BadRequestException;
import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.ClienteRepository;
import com.hotel.dataaccess.PlatoCompradoRepository;
import com.hotel.dataaccess.TipoPlatoRepository;
import com.hotel.models.Cliente;
import com.hotel.models.PlatoComprado;
import com.hotel.models.TipoPlato;
import com.hotel.presentation.dto.PlatoCompradoDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlatoCompradoService {

    private final PlatoCompradoRepository platoCompradoRepository;
    private final ClienteRepository clienteRepository;
    private final TipoPlatoRepository tipoPlatoRepository;

    public PlatoCompradoService(PlatoCompradoRepository platoCompradoRepository,
                                ClienteRepository clienteRepository,
                                TipoPlatoRepository tipoPlatoRepository) {
        this.platoCompradoRepository = platoCompradoRepository;
        this.clienteRepository = clienteRepository;
        this.tipoPlatoRepository = tipoPlatoRepository;
    }

    @Transactional(readOnly = true)
    public List<PlatoCompradoDTO> getAll() {
        return platoCompradoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlatoCompradoDTO getById(Long id) {
        PlatoComprado pc = platoCompradoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PlatoComprado", id));
        return toDTO(pc);
    }

    @Transactional(readOnly = true)
    public List<PlatoCompradoDTO> getByClienteId(Long clienteId) {
        return platoCompradoRepository.findByClienteId(clienteId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlatoCompradoDTO> getByTipoPlatoId(Long tipoPlatoId) {
        return platoCompradoRepository.findByTipoPlatoId(tipoPlatoId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PlatoCompradoDTO create(PlatoCompradoDTO dto) {
        if (dto.getCantidad() == null || dto.getCantidad() <= 0) {
            throw new BadRequestException("La cantidad debe ser mayor a cero");
        }

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", dto.getClienteId()));

        TipoPlato tipoPlato = tipoPlatoRepository.findById(dto.getTipoPlatoId())
                .orElseThrow(() -> new ResourceNotFoundException("TipoPlato", dto.getTipoPlatoId()));

        BigDecimal unitario = dto.getValorUnitario();
        if (unitario == null || unitario.compareTo(BigDecimal.ZERO) <= 0) {
            unitario = tipoPlato.getPrecioBase();
        }

        BigDecimal total = unitario.multiply(BigDecimal.valueOf(dto.getCantidad()));

        PlatoComprado pc = new PlatoComprado();
        pc.setCliente(cliente);
        pc.setTipoPlato(tipoPlato);
        pc.setFechaCompra(dto.getFechaCompra() != null ? dto.getFechaCompra() : LocalDateTime.now());
        pc.setCantidad(dto.getCantidad());
        pc.setValorUnitario(unitario);
        pc.setValorTotal(total);

        PlatoComprado saved = platoCompradoRepository.save(pc);
        return toDTO(saved);
    }

    public PlatoCompradoDTO update(Long id, PlatoCompradoDTO dto) {
        PlatoComprado pc = platoCompradoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PlatoComprado", id));

        if (dto.getClienteId() != null && !dto.getClienteId().equals(pc.getCliente().getId())) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente", dto.getClienteId()));
            pc.setCliente(cliente);
        }

        if (dto.getTipoPlatoId() != null && !dto.getTipoPlatoId().equals(pc.getTipoPlato().getId())) {
            TipoPlato tipoPlato = tipoPlatoRepository.findById(dto.getTipoPlatoId())
                    .orElseThrow(() -> new ResourceNotFoundException("TipoPlato", dto.getTipoPlatoId()));
            pc.setTipoPlato(tipoPlato);
        }

        if (dto.getCantidad() != null) {
            if (dto.getCantidad() <= 0) {
                throw new BadRequestException("La cantidad debe ser mayor a cero");
            }
            pc.setCantidad(dto.getCantidad());
        }

        if (dto.getValorUnitario() != null) {
            pc.setValorUnitario(dto.getValorUnitario());
        }

        if (dto.getFechaCompra() != null) {
            pc.setFechaCompra(dto.getFechaCompra());
        }

        pc.setValorTotal(pc.getValorUnitario().multiply(BigDecimal.valueOf(pc.getCantidad())));

        PlatoComprado updated = platoCompradoRepository.save(pc);
        return toDTO(updated);
    }

    public void delete(Long id) {
        PlatoComprado pc = platoCompradoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PlatoComprado", id));
        platoCompradoRepository.delete(pc);
    }

    public PlatoCompradoDTO toDTO(PlatoComprado entity) {
        String nombreCliente = entity.getCliente().getNombres() + " " + entity.getCliente().getApellidos();
        return new PlatoCompradoDTO(
                entity.getId(),
                entity.getCliente().getId(),
                nombreCliente,
                entity.getTipoPlato().getId(),
                entity.getTipoPlato().getNombre(),
                entity.getFechaCompra(),
                entity.getCantidad(),
                entity.getValorUnitario(),
                entity.getValorTotal()
        );
    }
}
