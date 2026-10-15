package com.hotel.presentation.controllers;

import com.hotel.business.HabitacionService;
import com.hotel.presentation.dto.HabitacionDTO;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionController {

    private final HabitacionService habitacionService;

    public HabitacionController(HabitacionService habitacionService) {
        this.habitacionService = habitacionService;
    }

    @GetMapping
    public ResponseEntity<List<HabitacionDTO>> getAll(@RequestParam(required = false) Long hotelId) {
        if (hotelId != null) {
            return ResponseEntity.ok(habitacionService.getByHotelId(hotelId));
        }
        return ResponseEntity.ok(habitacionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitacionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(habitacionService.getById(id));
    }

    @PostMapping
    public ResponseEntity<HabitacionDTO> create(@Valid @RequestBody HabitacionDTO dto) {
        HabitacionDTO created = habitacionService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitacionDTO> update(@PathVariable Long id, @Valid @RequestBody HabitacionDTO dto) {
        return ResponseEntity.ok(habitacionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        habitacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
