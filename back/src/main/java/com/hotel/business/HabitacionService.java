package com.hotel.business;

import com.hotel.core.errors.BadRequestException;
import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.HabitacionRepository;
import com.hotel.dataaccess.HotelRepository;
import com.hotel.models.Habitacion;
import com.hotel.models.Hotel;
import com.hotel.presentation.dto.HabitacionDTO;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HabitacionService {

    private final HabitacionRepository habitacionRepository;
    private final HotelRepository hotelRepository;

    public HabitacionService(HabitacionRepository habitacionRepository, HotelRepository hotelRepository) {
        this.habitacionRepository = habitacionRepository;
        this.hotelRepository = hotelRepository;
    }

    @Transactional(readOnly = true)
    public List<HabitacionDTO> getAll() {
        return habitacionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HabitacionDTO getById(Long id) {
        Habitacion habitacion = habitacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitacion", id));
        return toDTO(habitacion);
    }

    @Transactional(readOnly = true)
    public List<HabitacionDTO> getByHotelId(Long hotelId) {
        return habitacionRepository.findByHotelId(hotelId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public HabitacionDTO create(HabitacionDTO dto) {
        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", dto.getHotelId()));

        if (habitacionRepository.findByHotelIdAndNumero(dto.getHotelId(), dto.getNumero()).isPresent()) {
            throw new BadRequestException("Ya existe una habitación con el número " + dto.getNumero() + " en este hotel");
        }

        Habitacion habitacion = new Habitacion();
        habitacion.setHotel(hotel);
        habitacion.setNumero(dto.getNumero());
        habitacion.setTipo(dto.getTipo());
        habitacion.setCapacidad(dto.getCapacidad());
        habitacion.setTarifaNoche(dto.getTarifaNoche());
        habitacion.setEstado(dto.getEstado() != null ? dto.getEstado() : "DISPONIBLE");

        Habitacion saved = habitacionRepository.save(habitacion);
        return toDTO(saved);
    }

    public HabitacionDTO update(Long id, HabitacionDTO dto) {
        Habitacion habitacion = habitacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitacion", id));

        if (dto.getHotelId() != null && !dto.getHotelId().equals(habitacion.getHotel().getId())) {
            Hotel hotel = hotelRepository.findById(dto.getHotelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel", dto.getHotelId()));
            habitacion.setHotel(hotel);
        }

        habitacion.setNumero(dto.getNumero());
        habitacion.setTipo(dto.getTipo());
        habitacion.setCapacidad(dto.getCapacidad());
        habitacion.setTarifaNoche(dto.getTarifaNoche());
        if (dto.getEstado() != null) {
            habitacion.setEstado(dto.getEstado());
        }

        Habitacion updated = habitacionRepository.save(habitacion);
        return toDTO(updated);
    }

    public void delete(Long id) {
        Habitacion habitacion = habitacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitacion", id));
        habitacionRepository.delete(habitacion);
    }

    public HabitacionDTO toDTO(Habitacion entity) {
        return new HabitacionDTO(
                entity.getId(),
                entity.getHotel().getId(),
                entity.getHotel().getNombre(),
                entity.getNumero(),
                entity.getTipo(),
                entity.getCapacidad(),
                entity.getTarifaNoche(),
                entity.getEstado()
        );
    }
}
