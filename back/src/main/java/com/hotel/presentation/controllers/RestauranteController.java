package com.hotel.presentation.controllers;

import com.hotel.business.RestauranteService;
import com.hotel.presentation.dto.RestauranteDTO;
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
@RequestMapping("/api/restaurantes")
public class RestauranteController {

    private final RestauranteService restauranteService;

    public RestauranteController(RestauranteService restauranteService) {
        this.restauranteService = restauranteService;
    }

    @GetMapping
    public ResponseEntity<List<RestauranteDTO>> getAll(@RequestParam(required = false) Long hotelId) {
        if (hotelId != null) {
            return ResponseEntity.ok(restauranteService.getByHotelId(hotelId));
        }
        return ResponseEntity.ok(restauranteService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestauranteDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(restauranteService.getById(id));
    }

    @PostMapping
    public ResponseEntity<RestauranteDTO> create(@Valid @RequestBody RestauranteDTO dto) {
        RestauranteDTO created = restauranteService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestauranteDTO> update(@PathVariable Long id, @Valid @RequestBody RestauranteDTO dto) {
        return ResponseEntity.ok(restauranteService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        restauranteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
