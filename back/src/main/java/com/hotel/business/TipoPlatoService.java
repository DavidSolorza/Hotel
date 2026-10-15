package com.hotel.business;

import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.RestauranteRepository;
import com.hotel.dataaccess.TipoPlatoRepository;
import com.hotel.models.Restaurante;
import com.hotel.models.TipoPlato;
import com.hotel.presentation.dto.TipoPlatoDTO;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TipoPlatoService {

    private final TipoPlatoRepository tipoPlatoRepository;
    private final RestauranteRepository restauranteRepository;

    public TipoPlatoService(TipoPlatoRepository tipoPlatoRepository, RestauranteRepository restauranteRepository) {
        this.tipoPlatoRepository = tipoPlatoRepository;
        this.restauranteRepository = restauranteRepository;
    }

    @Transactional(readOnly = true)
    public List<TipoPlatoDTO> getAll() {
        return tipoPlatoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoPlatoDTO getById(Long id) {
        TipoPlato tipoPlato = tipoPlatoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipoPlato", id));
        return toDTO(tipoPlato);
    }

    @Transactional(readOnly = true)
    public List<TipoPlatoDTO> getByRestauranteId(Long restauranteId) {
        return tipoPlatoRepository.findByRestauranteId(restauranteId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TipoPlatoDTO create(TipoPlatoDTO dto) {
        Restaurante restaurante = restauranteRepository.findById(dto.getRestauranteId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante", dto.getRestauranteId()));

        TipoPlato tipoPlato = new TipoPlato();
        tipoPlato.setRestaurante(restaurante);
        tipoPlato.setNombre(dto.getNombre());
        tipoPlato.setDescripcion(dto.getDescripcion());
        tipoPlato.setPrecioBase(dto.getPrecioBase());
        tipoPlato.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        TipoPlato saved = tipoPlatoRepository.save(tipoPlato);
        return toDTO(saved);
    }

    public TipoPlatoDTO update(Long id, TipoPlatoDTO dto) {
        TipoPlato tipoPlato = tipoPlatoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipoPlato", id));

        if (dto.getRestauranteId() != null && !dto.getRestauranteId().equals(tipoPlato.getRestaurante().getId())) {
            Restaurante restaurante = restauranteRepository.findById(dto.getRestauranteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurante", dto.getRestauranteId()));
            tipoPlato.setRestaurante(restaurante);
        }

        tipoPlato.setNombre(dto.getNombre());
        tipoPlato.setDescripcion(dto.getDescripcion());
        tipoPlato.setPrecioBase(dto.getPrecioBase());
        if (dto.getActivo() != null) {
            tipoPlato.setActivo(dto.getActivo());
        }

        TipoPlato updated = tipoPlatoRepository.save(tipoPlato);
        return toDTO(updated);
    }

    public void delete(Long id) {
        TipoPlato tipoPlato = tipoPlatoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipoPlato", id));
        tipoPlatoRepository.delete(tipoPlato);
    }

    public TipoPlatoDTO toDTO(TipoPlato entity) {
        return new TipoPlatoDTO(
                entity.getId(),
                entity.getRestaurante().getId(),
                entity.getRestaurante().getNombre(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getPrecioBase(),
                entity.getActivo()
        );
    }
}
