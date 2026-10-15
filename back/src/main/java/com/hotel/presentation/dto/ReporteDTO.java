package com.hotel.presentation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReporteDTO {

    public static class SumaReporteDTO {
        private String reporte;
        private String descripcion;
        private BigDecimal total;

        public SumaReporteDTO(String reporte, String descripcion, BigDecimal total) {
            this.reporte = reporte;
            this.descripcion = descripcion;
            this.total = total != null ? total : BigDecimal.ZERO;
        }

        public String getReporte() {
            return reporte;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public BigDecimal getTotal() {
            return total;
        }
    }

    public static class ConteoReporteDTO {
        private String reporte;
        private String descripcion;
        private Long cantidad;

        public ConteoReporteDTO(String reporte, String descripcion, Long cantidad) {
            this.reporte = reporte;
            this.descripcion = descripcion;
            this.cantidad = cantidad != null ? cantidad : 0L;
        }

        public String getReporte() {
            return reporte;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public Long getCantidad() {
            return cantidad;
        }
    }

    public static class PromedioReporteDTO {
        private String reporte;
        private String descripcion;
        private Double promedio;

        public PromedioReporteDTO(String reporte, String descripcion, Double promedio) {
            this.reporte = reporte;
            this.descripcion = descripcion;
            this.promedio = promedio != null ? promedio : 0.0;
        }

        public String getReporte() {
            return reporte;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public Double getPromedio() {
            return promedio;
        }
    }

    public static class ConteoClienteDTO {
        private Long clienteId;
        private String numeroDocumento;
        private String nombreCompleto;
        private Long totalPlatosComprados;

        public ConteoClienteDTO(Long clienteId, String numeroDocumento, String nombreCompleto, Long totalPlatosComprados) {
            this.clienteId = clienteId;
            this.numeroDocumento = numeroDocumento;
            this.nombreCompleto = nombreCompleto;
            this.totalPlatosComprados = totalPlatosComprados != null ? totalPlatosComprados : 0L;
        }

        public Long getClienteId() {
            return clienteId;
        }

        public String getNumeroDocumento() {
            return numeroDocumento;
        }

        public String getNombreCompleto() {
            return nombreCompleto;
        }

        public Long getTotalPlatosComprados() {
            return totalPlatosComprados;
        }
    }

    public static class PlatoExtremoDTO {
        private String clasificacion; // MAYOR_VALOR o MENOR_VALOR
        private Long platoCompradoId;
        private Long tipoPlatoId;
        private String nombrePlato;
        private BigDecimal valorUnitario;
        private BigDecimal valorTotal;
        private Long clienteId;
        private String clienteNombre;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime fechaCompra;

        public PlatoExtremoDTO() {
        }

        public PlatoExtremoDTO(String clasificacion, Long platoCompradoId, Long tipoPlatoId,
                               String nombrePlato, BigDecimal valorUnitario, BigDecimal valorTotal,
                               Long clienteId, String clienteNombre, LocalDateTime fechaCompra) {
            this.clasificacion = clasificacion;
            this.platoCompradoId = platoCompradoId;
            this.tipoPlatoId = tipoPlatoId;
            this.nombrePlato = nombrePlato;
            this.valorUnitario = valorUnitario;
            this.valorTotal = valorTotal;
            this.clienteId = clienteId;
            this.clienteNombre = clienteNombre;
            this.fechaCompra = fechaCompra;
        }

        public String getClasificacion() {
            return clasificacion;
        }

        public Long getPlatoCompradoId() {
            return platoCompradoId;
        }

        public Long getTipoPlatoId() {
            return tipoPlatoId;
        }

        public String getNombrePlato() {
            return nombrePlato;
        }

        public BigDecimal getValorUnitario() {
            return valorUnitario;
        }

        public BigDecimal getValorTotal() {
            return valorTotal;
        }

        public Long getClienteId() {
            return clienteId;
        }

        public String getClienteNombre() {
            return clienteNombre;
        }

        public LocalDateTime getFechaCompra() {
            return fechaCompra;
        }
    }
}
