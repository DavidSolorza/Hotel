package com.hotel.presentation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ReservaDTO {

    private Long id;

    @NotNull(message = "El identificador del cliente es obligatorio")
    private Long clienteId;

    private String clienteNombreCompleto;

    @NotNull(message = "El identificador de la habitación es obligatorio")
    private Long habitacionId;

    private String habitacionNumero;

    @NotNull(message = "La fecha de reserva es obligatoria")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaReserva;

    @NotNull(message = "La fecha de inicio (check-in) es obligatoria")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin (check-out) es obligatoria")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaFin;

    private String estado = "CONFIRMADA";

    @NotNull(message = "El total de hospedaje es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El total no puede ser negativo")
    private BigDecimal totalHospedaje;

    public ReservaDTO() {
    }

    public ReservaDTO(Long id, Long clienteId, String clienteNombreCompleto, Long habitacionId,
                      String habitacionNumero, LocalDate fechaReserva, LocalDate fechaInicio,
                      LocalDate fechaFin, String estado, BigDecimal totalHospedaje) {
        this.id = id;
        this.clienteId = clienteId;
        this.clienteNombreCompleto = clienteNombreCompleto;
        this.habitacionId = habitacionId;
        this.habitacionNumero = habitacionNumero;
        this.fechaReserva = fechaReserva;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado != null ? estado : "CONFIRMADA";
        this.totalHospedaje = totalHospedaje;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getClienteNombreCompleto() {
        return clienteNombreCompleto;
    }

    public void setClienteNombreCompleto(String clienteNombreCompleto) {
        this.clienteNombreCompleto = clienteNombreCompleto;
    }

    public Long getHabitacionId() {
        return habitacionId;
    }

    public void setHabitacionId(Long habitacionId) {
        this.habitacionId = habitacionId;
    }

    public String getHabitacionNumero() {
        return habitacionNumero;
    }

    public void setHabitacionNumero(String habitacionNumero) {
        this.habitacionNumero = habitacionNumero;
    }

    public LocalDate getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDate fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public BigDecimal getTotalHospedaje() {
        return totalHospedaje;
    }

    public void setTotalHospedaje(BigDecimal totalHospedaje) {
        this.totalHospedaje = totalHospedaje;
    }
}
