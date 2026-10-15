package com.hotel.business;

import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.HotelRepository;
import com.hotel.dataaccess.RestauranteRepository;
import com.hotel.models.Hotel;
import com.hotel.models.Restaurante;
import com.hotel.presentation.dto.RestauranteDTO;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RestauranteService {

    private final RestauranteRepository restauranteRepository;
    private final HotelRepository hotelRepository;

    public RestauranteService(RestauranteRepository restauranteRepository, HotelRepository hotelRepository) {
        this.restauranteRepository = restauranteRepository;
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<RestauranteDTO> getAll() {
        return restauranteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestauranteDTO getById(Long id) {
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante", id));
        return toDTO(restaurante);
    }

    @Transactional(readOnly = true)
    public List<RestauranteDTO> getByHotelId(Long hotelId) {
        return restauranteRepository.findByHotelId(hotelId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RestauranteDTO create(RestauranteDTO dto) {
        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", dto.getHotelId()));

        Restaurante restaurante = new Restaurante();
        restaurante.setHotel(hotel);
        restaurante.setNombre(dto.getNombre());
        restaurante.setDescripcion(dto.getDescripcion());
        restaurante.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        Restaurante saved = restauranteRepository.save(restaurante);
        return toDTO(saved);
    }

    public RestauranteDTO update(Long id, RestauranteDTO dto) {
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante", id));

        if (dto.getHotelId() != null && !dto.getHotelId().equals(restaurante.getHotel().getId())) {
            Hotel hotel = hotelRepository.findById(dto.getHotelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel", dto.getHotelId()));
            restaurante.setHotel(hotel);
        }

        restaurante.setNombre(dto.getNombre());
        restaurante.setDescripcion(dto.getDescripcion());
        if (dto.getActivo() != null) {
            restaurante.setActivo(dto.getActivo());
        }

        Restaurante updated = restauranteRepository.save(restaurante);
        return toDTO(updated);
    }

    public void delete(Long id) {
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante", id));
        restauranteRepository.delete(restaurante);
    }

    public RestauranteDTO toDTO(Restaurante entity) {
        return new RestauranteDTO(
                entity.getId(),
                entity.getHotel().getId(),
                entity.getHotel().getNombre(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getActivo()
        );
    }
}
