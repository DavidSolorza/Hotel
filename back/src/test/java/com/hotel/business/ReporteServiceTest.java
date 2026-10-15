package com.hotel.business;

import com.hotel.presentation.dto.ClienteDTO;
import com.hotel.presentation.dto.PlatoCompradoDTO;
import com.hotel.presentation.dto.ReporteDTO;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ReporteServiceTest {

    @Autowired
    private ReporteService reporteService;

    @Test
    @DisplayName("Reporte 1: Suma intermedia - Total platos comprados por clientes de una habitación en un periodo")
    void testReporte1_SumaIntermedia() {
        ReporteDTO.SumaReporteDTO res = reporteService.sumaPlatosPorHabitacionYPeriodo(
                1L, LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 5));

        assertNotNull(res);
        assertEquals(new BigDecimal("70000.00"), res.getTotal());
    }

    @Test
    @DisplayName("Reporte 2: Suma fácil - Total pagado en compras de platos por un cliente")
    void testReporte2_SumaFacil() {
        ReporteDTO.SumaReporteDTO res = reporteService.sumaTotalPagadoPorCliente(1L);

        assertNotNull(res);
        assertEquals(new BigDecimal("70000.00"), res.getTotal());
    }

    @Test
    @DisplayName("Reporte 3: Conteo intermedio - Cuántos platos compró cada cliente con reserva en una habitación")
    void testReporte3_ConteoIntermedio() {
        List<ReporteDTO.ConteoClienteDTO> lista = reporteService.conteoPlatosPorClienteEnHabitacion(1L);

        assertNotNull(lista);
        assertEquals(2, lista.size()); // Carlos (id 1) y María (id 2)
    }

    @Test
    @DisplayName("Reporte 4: Conteo fácil - Total de platos comprados por un cliente")
    void testReporte4_ConteoFacil() {
        ReporteDTO.ConteoReporteDTO res = reporteService.conteoPlatosPorCliente(1L);

        assertNotNull(res);
        assertEquals(2L, res.getCantidad());
    }

    @Test
    @DisplayName("Reporte 5: Promedio intermedio - Promedio de compras de clientes que reservaron")
    void testReporte5_PromedioIntermedio() {
        ReporteDTO.PromedioReporteDTO res = reporteService.promedioComprasClientesConReserva();

        assertNotNull(res);
        assertTrue(res.getPromedio() > 0);
        assertEquals(44000.0, res.getPromedio(), 0.001);
    }

    @Test
    @DisplayName("Reporte 6: Promedio fácil - Promedio de platos comprados por un cliente")
    void testReporte6_PromedioFacil() {
        ReporteDTO.PromedioReporteDTO res = reporteService.promedioComprasPorCliente(1L);

        assertNotNull(res);
        assertEquals(35000.0, res.getPromedio(), 0.001);
    }

    @Test
    @DisplayName("Reporte 7: Máximo intermedio - Plato de mayor valor comprado por clientes de una habitación")
    void testReporte7_MaximoIntermedio() {
        ReporteDTO.PlatoExtremoDTO res = reporteService.platoMayorValorPorHabitacion(1L);

        assertNotNull(res);
        assertEquals("MAYOR_VALOR", res.getClasificacion());
        assertEquals("Trucha al Ajillo", res.getNombrePlato());
        assertEquals(new BigDecimal("42000.00"), res.getValorUnitario());
    }

    @Test
    @DisplayName("Reporte 8: Mínimo fácil - Plato de menor valor entre compras de un cliente")
    void testReporte8_MinimoFacil() {
        ReporteDTO.PlatoExtremoDTO res = reporteService.platoMenorValorPorCliente(1L);

        assertNotNull(res);
        assertEquals("MENOR_VALOR", res.getClasificacion());
        assertEquals("Ajiaco", res.getNombrePlato());
        assertEquals(new BigDecimal("32000.00"), res.getValorUnitario());
    }

    @Test
    @DisplayName("Reporte 9: Búsqueda intermedia - Clientes que compraron plato X y reservaron en el hotel")
    void testReporte9_BusquedaIntermedia() {
        List<ClienteDTO> clientes = reporteService.buscarClientesPorTipoPlatoYConReserva(1L); // Bandeja Paisa

        assertNotNull(clientes);
        assertEquals(2, clientes.size()); // Carlos (1) y Juan (3)
    }

    @Test
    @DisplayName("Reporte 10: Búsqueda fácil - Platos comprados por un cliente")
    void testReporte10_BusquedaFacil() {
        List<PlatoCompradoDTO> platos = reporteService.buscarPlatosCompradosPorCliente(1L);

        assertNotNull(platos);
        assertEquals(2, platos.size());
    }
}
