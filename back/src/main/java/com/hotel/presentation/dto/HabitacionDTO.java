package com.hotel.presentation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class HabitacionDTO {

    private Long id;

    @NotNull(message = "El identificador del hotel es obligatorio")
    private Long hotelId;

    private String hotelNombre;

    @NotBlank(message = "El número de habitación es obligatorio")
    @Size(max = 20, message = "El número de habitación no puede exceder 20 caracteres")
    private String numero;

    @NotBlank(message = "El tipo de habitación es obligatorio")
    @Size(max = 60, message = "El tipo no puede exceder 60 caracteres")
    private String tipo;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad mínima es de 1 huésped")
    private Integer capacidad;

    @NotNull(message = "La tarifa por noche es obligatoria")
    @DecimalMin(value = "0.0", inclusive = true, message = "La tarifa no puede ser negativa")
    private BigDecimal tarifaNoche;

    private String estado = "DISPONIBLE";

    public HabitacionDTO() {
    }

    public HabitacionDTO(Long id, Long hotelId, String hotelNombre, String numero, String tipo,
                         Integer capacidad, BigDecimal tarifaNoche, String estado) {
        this.id = id;
        this.hotelId = hotelId;
        this.hotelNombre = hotelNombre;
        this.numero = numero;
        this.tipo = tipo;
        this.capacidad = capacidad;
        this.tarifaNoche = tarifaNoche;
        this.estado = estado != null ? estado : "DISPONIBLE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getHotelNombre() {
        return hotelNombre;
    }

    public void setHotelNombre(String hotelNombre) {
        this.hotelNombre = hotelNombre;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public BigDecimal getTarifaNoche() {
        return tarifaNoche;
    }

    public void setTarifaNoche(BigDecimal tarifaNoche) {
        this.tarifaNoche = tarifaNoche;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
