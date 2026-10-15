package com.hotel.business;

import com.hotel.core.errors.BadRequestException;
import com.hotel.core.errors.ResourceNotFoundException;
import com.hotel.dataaccess.ClienteRepository;
import com.hotel.models.Cliente;
import com.hotel.presentation.dto.ClienteDTO;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> getAll() {
        return clienteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteDTO getById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        return toDTO(cliente);
    }

    public ClienteDTO create(ClienteDTO dto) {
        if (clienteRepository.findByNumeroDocumento(dto.getNumeroDocumento()).isPresent()) {
            throw new BadRequestException("Ya existe un cliente registrado con el documento " + dto.getNumeroDocumento());
        }

        Cliente cliente = new Cliente();
        cliente.setTipoDocumento(dto.getTipoDocumento());
        cliente.setNumeroDocumento(dto.getNumeroDocumento());
        cliente.setNombres(dto.getNombres());
        cliente.setApellidos(dto.getApellidos());
        cliente.setCorreo(dto.getCorreo());
        cliente.setTelefono(dto.getTelefono());

        Cliente saved = clienteRepository.save(cliente);
        return toDTO(saved);
    }

    public ClienteDTO update(Long id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));

        if (!cliente.getNumeroDocumento().equals(dto.getNumeroDocumento()) &&
                clienteRepository.findByNumeroDocumento(dto.getNumeroDocumento()).isPresent()) {
            throw new BadRequestException("Ya existe otro cliente con el documento " + dto.getNumeroDocumento());
        }

        cliente.setTipoDocumento(dto.getTipoDocumento());
        cliente.setNumeroDocumento(dto.getNumeroDocumento());
        cliente.setNombres(dto.getNombres());
        cliente.setApellidos(dto.getApellidos());
        cliente.setCorreo(dto.getCorreo());
        cliente.setTelefono(dto.getTelefono());

        Cliente updated = clienteRepository.save(cliente);
        return toDTO(updated);
    }

    public void delete(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        clienteRepository.delete(cliente);
    }

    public ClienteDTO toDTO(Cliente entity) {
        return new ClienteDTO(
                entity.getId(),
                entity.getTipoDocumento(),
                entity.getNumeroDocumento(),
                entity.getNombres(),
                entity.getApellidos(),
                entity.getCorreo(),
                entity.getTelefono()
        );
    }
}
