package com.hotel.business;

import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.HotelRepository;
import com.hotel.models.Hotel;
import com.hotel.presentation.dto.HotelDTO;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<HotelDTO> getAll() {
        return hotelRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HotelDTO getById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", id));
        return toDTO(hotel);
    }

    public HotelDTO create(HotelDTO dto) {
        Hotel hotel = new Hotel();
        hotel.setNombre(dto.getNombre());
        hotel.setDireccion(dto.getDireccion());
        hotel.setTelefono(dto.getTelefono());
        hotel.setCorreo(dto.getCorreo());
        hotel.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        Hotel saved = hotelRepository.save(hotel);
        return toDTO(saved);
    }

    public HotelDTO update(Long id, HotelDTO dto) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", id));

        hotel.setNombre(dto.getNombre());
        hotel.setDireccion(dto.getDireccion());
        hotel.setTelefono(dto.getTelefono());
        hotel.setCorreo(dto.getCorreo());
        if (dto.getActivo() != null) {
            hotel.setActivo(dto.getActivo());
        }

        Hotel updated = hotelRepository.save(hotel);
        return toDTO(updated);
    }

    public void delete(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", id));
        hotelRepository.delete(hotel);
    }

    public HotelDTO toDTO(Hotel entity) {
        return new HotelDTO(
                entity.getId(),
                entity.getNombre(),
                entity.getDireccion(),
                entity.getTelefono(),
                entity.getCorreo(),
                entity.getActivo()
        );
    }
}
