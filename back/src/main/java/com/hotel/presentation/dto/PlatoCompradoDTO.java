package com.hotel.presentation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PlatoCompradoDTO {

    private Long id;

    @NotNull(message = "El identificador del cliente es obligatorio")
    private Long clienteId;

    private String clienteNombreCompleto;

    @NotNull(message = "El identificador del tipo de plato es obligatorio")
    private Long tipoPlatoId;

    private String tipoPlatoNombre;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCompra;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad mínima debe ser 1")
    private Integer cantidad;

    @NotNull(message = "El valor unitario es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El valor unitario no puede ser negativo")
    private BigDecimal valorUnitario;

    private BigDecimal valorTotal;

    public PlatoCompradoDTO() {
    }

    public PlatoCompradoDTO(Long id, Long clienteId, String clienteNombreCompleto, Long tipoPlatoId,
                            String tipoPlatoNombre, LocalDateTime fechaCompra, Integer cantidad,
                            BigDecimal valorUnitario, BigDecimal valorTotal) {
        this.id = id;
        this.clienteId = clienteId;
        this.clienteNombreCompleto = clienteNombreCompleto;
        this.tipoPlatoId = tipoPlatoId;
        this.tipoPlatoNombre = tipoPlatoNombre;
        this.fechaCompra = fechaCompra;
        this.cantidad = cantidad;
        this.valorUnitario = valorUnitario;
        this.valorTotal = valorTotal;
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

    public Long getTipoPlatoId() {
        return tipoPlatoId;
    }

    public void setTipoPlatoId(Long tipoPlatoId) {
        this.tipoPlatoId = tipoPlatoId;
    }

    public String getTipoPlatoNombre() {
        return tipoPlatoNombre;
    }

    public void setTipoPlatoNombre(String tipoPlatoNombre) {
        this.tipoPlatoNombre = tipoPlatoNombre;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(LocalDateTime fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
}
