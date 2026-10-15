package com.hotel.presentation.controllers;

import com.hotel.business.TipoPlatoService;
import com.hotel.presentation.dto.TipoPlatoDTO;
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
@RequestMapping("/api/tipos-plato")
public class TipoPlatoController {

    private final TipoPlatoService tipoPlatoService;

    public TipoPlatoController(TipoPlatoService tipoPlatoService) {
        this.tipoPlatoService = tipoPlatoService;
    }

    @GetMapping
    public ResponseEntity<List<TipoPlatoDTO>> getAll(@RequestParam(required = false) Long restauranteId) {
        if (restauranteId != null) {
            return ResponseEntity.ok(tipoPlatoService.getByRestauranteId(restauranteId));
        }
        return ResponseEntity.ok(tipoPlatoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoPlatoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tipoPlatoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TipoPlatoDTO> create(@Valid @RequestBody TipoPlatoDTO dto) {
        TipoPlatoDTO created = tipoPlatoService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoPlatoDTO> update(@PathVariable Long id, @Valid @RequestBody TipoPlatoDTO dto) {
        return ResponseEntity.ok(tipoPlatoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tipoPlatoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
