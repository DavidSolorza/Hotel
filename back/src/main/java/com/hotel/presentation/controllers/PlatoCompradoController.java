package com.hotel.presentation.controllers;

import com.hotel.business.PlatoCompradoService;
import com.hotel.presentation.dto.PlatoCompradoDTO;
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
@RequestMapping("/api/platos-comprados")
public class PlatoCompradoController {

    private final PlatoCompradoService platoCompradoService;

    public PlatoCompradoController(PlatoCompradoService platoCompradoService) {
        this.platoCompradoService = platoCompradoService;
    }

    @GetMapping
    public ResponseEntity<List<PlatoCompradoDTO>> getAll(@RequestParam(required = false) Long clienteId,
                                                         @RequestParam(required = false) Long tipoPlatoId) {
        if (clienteId != null) {
            return ResponseEntity.ok(platoCompradoService.getByClienteId(clienteId));
        }
        if (tipoPlatoId != null) {
            return ResponseEntity.ok(platoCompradoService.getByTipoPlatoId(tipoPlatoId));
        }
        return ResponseEntity.ok(platoCompradoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatoCompradoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(platoCompradoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PlatoCompradoDTO> create(@Valid @RequestBody PlatoCompradoDTO dto) {
        PlatoCompradoDTO created = platoCompradoService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlatoCompradoDTO> update(@PathVariable Long id, @Valid @RequestBody PlatoCompradoDTO dto) {
        return ResponseEntity.ok(platoCompradoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        platoCompradoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
