import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
    StatusBar,
    RefreshControl,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerPedidos, obtenerProductos } from '../../servicios/api';

const { width } = Dimensions.get('window');

const Reportes = ({ navigation }) => {
    const [cargando, setCargando] = useState(false);
    const [periodo, setPeriodo] = useState('mes'); // 'hoy', 'semana', 'mes', 'año'
    const [reporteData, setReporteData] = useState({
        ventas: {
            total: 0,
            cantidad: 0,
            promedio: 0,
            crecimiento: 0
        },
        pedidos: {
            total: 0,
            pendientes: 0,
            completados: 0,
            cancelados: 0
        },
        productos: {
            total: 0,
            masVendidos: [],
            bajoStock: [],
            sinStock: 0
        },
        metodosPago: {
            efectivo: 0,
            tarjeta: 0,
            yape: 0,
            plin: 0
        },
        tendencias: []
    });

    useEffect(() => {
        cargarReportes();
    }, [periodo]);

    const cargarReportes = async () => {
        setCargando(true);
        try {
            const pedidosData = await obtenerPedidos();
            const pedidos = pedidosData.pedidos || pedidosData.data || [];

            const productosData = await obtenerProductos();
            const productos = productosData.data || productosData || [];

            // Filtrar pedidos según el período
            const pedidosFiltrados = filtrarPorPeriodo(pedidos, periodo);

            // Calcular estadísticas de ventas
            const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
            const cantidadPedidos = pedidosFiltrados.length;
            const promedioVenta = cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0;

            // Calcular estados de pedidos
            const pendientes = pedidosFiltrados.filter(p => p.estado?.toLowerCase() === 'pendiente').length;
            const completados = pedidosFiltrados.filter(p => p.estado?.toLowerCase() === 'completado').length;
            const cancelados = pedidosFiltrados.filter(p => p.estado?.toLowerCase() === 'cancelado').length;

            // Métodos de pago
            const metodosPago = {
                efectivo: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('efectivo')).length,
                tarjeta: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('tarjeta')).length,
                yape: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('yape')).length,
                plin: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('plin')).length
            };

            // Productos con bajo stock
            const bajoStock = productos.filter(p => p.stock > 0 && p.stock < 10);
            const sinStock = productos.filter(p => p.stock === 0).length;

            // Tendencias por día (últimos 7 días)
            const tendencias = calcularTendencias(pedidos);

            setReporteData({
                ventas: {
                    total: totalVentas,
                    cantidad: cantidadPedidos,
                    promedio: promedioVenta,
                    crecimiento: 12.5 // Simulado
                },
                pedidos: {
                    total: cantidadPedidos,
                    pendientes,
                    completados,
                    cancelados
                },
                productos: {
                    total: productos.length,
                    masVendidos: productos.slice(0, 5),
                    bajoStock: bajoStock.slice(0, 5),
                    sinStock
                },
                metodosPago,
                tendencias
            });
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            Alert.alert('Error', 'No se pudieron cargar los reportes');
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorPeriodo = (pedidos, periodo) => {
        const ahora = new Date();
        return pedidos.filter(pedido => {
            const fechaPedido = new Date(pedido.fecha);
            switch (periodo) {
                case 'hoy':
                    return fechaPedido.toDateString() === ahora.toDateString();
                case 'semana':
                    const semanaAtras = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return fechaPedido >= semanaAtras;
                case 'mes':
                    return fechaPedido.getMonth() === ahora.getMonth() &&
                        fechaPedido.getFullYear() === ahora.getFullYear();
                case 'año':
                    return fechaPedido.getFullYear() === ahora.getFullYear();
                default:
                    return true;
            }
        });
    };

    const calcularTendencias = (pedidos) => {
        const ultimos7Dias = [];
        const ahora = new Date();

        for (let i = 6; i >= 0; i--) {
            const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000);
            const pedidosDia = pedidos.filter(p =>
                new Date(p.fecha).toDateString() === fecha.toDateString()
            );
            const totalDia = pedidosDia.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);

            ultimos7Dias.push({
                dia: fecha.toLocaleDateString('es-PE', { weekday: 'short' }),
                ventas: totalDia,
                cantidad: pedidosDia.length
            });
        }

        return ultimos7Dias;
    };

    const PeriodoChip = ({ label, valor, activo }) => (
        <TouchableOpacity
            style={[styles.periodoChip, activo && styles.periodoActivo]}
            onPress={() => setPeriodo(valor)}
            activeOpacity={0.7}
        >
            <Text style={[styles.periodoTexto, activo && styles.periodoTextoActivo]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const maxVentas = Math.max(...reporteData.tendencias.map(t => t.ventas), 1);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[
                styles.header,
                { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50 }
            ]}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Admin')}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Reportes</Text>
                    <Text style={styles.headerSubtitle}>Análisis de ventas</Text>
                </View>
                <TouchableOpacity
                    onPress={cargarReportes}
                    style={styles.refreshButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="refresh" size={20} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={cargando} onRefresh={cargarReportes} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Selector de Período */}
                <View style={styles.periodosContainer}>
                    <PeriodoChip label="Hoy" valor="hoy" activo={periodo === 'hoy'} />
                    <PeriodoChip label="Semana" valor="semana" activo={periodo === 'semana'} />
                    <PeriodoChip label="Mes" valor="mes" activo={periodo === 'mes'} />
                    <PeriodoChip label="Año" valor="año" activo={periodo === 'año'} />
                </View>

                {/* Resumen de Ventas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💰 Resumen de Ventas</Text>
                    <View style={styles.ventasCard}>
                        <View style={styles.ventasHeader}>
                            <View>
                                <Text style={styles.ventasLabel}>Ingresos Totales</Text>
                                <Text style={styles.ventasTotal}>
                                    S/ {reporteData.ventas.total.toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.crecimientoBadge}>
                                <Ionicons name="trending-up" size={16} color="#10B981" />
                                <Text style={styles.crecimientoTexto}>
                                    +{reporteData.ventas.crecimiento}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.ventasStats}>
                            <View style={styles.ventasStat}>
                                <Ionicons name="receipt-outline" size={20} color="#6B7280" />
                                <Text style={styles.ventasStatLabel}>Pedidos</Text>
                                <Text style={styles.ventasStatValor}>{reporteData.ventas.cantidad}</Text>
                            </View>
                            <View style={styles.ventasStatDivider} />
                            <View style={styles.ventasStat}>
                                <Ionicons name="calculator-outline" size={20} color="#6B7280" />
                                <Text style={styles.ventasStatLabel}>Promedio</Text>
                                <Text style={styles.ventasStatValor}>
                                    S/ {reporteData.ventas.promedio.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Gráfico de Tendencias */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📈 Tendencia de Ventas (7 días)</Text>
                    <View style={styles.graficoCard}>
                        <View style={styles.grafico}>
                            {reporteData.tendencias.map((dia, index) => {
                                const altura = maxVentas > 0 ? (dia.ventas / maxVentas) * 120 : 0;
                                return (
                                    <View key={index} style={styles.barraContainer}>
                                        <View style={styles.barraWrapper}>
                                            <View
                                                style={[
                                                    styles.barra,
                                                    {
                                                        height: Math.max(altura, 4),
                                                        backgroundColor: dia.cantidad > 0 ? '#3B82F6' : '#E5E7EB'
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.barraDia}>{dia.dia}</Text>
                                        <Text style={styles.barraCantidad}>{dia.cantidad}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Estado de Pedidos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📦 Estado de Pedidos</Text>
                    <View style={styles.estadosGrid}>
                        <View style={[styles.estadoCard, { borderLeftColor: '#F59E0B' }]}>
                            <Ionicons name="time-outline" size={24} color="#F59E0B" />
                            <Text style={styles.estadoValor}>{reporteData.pedidos.pendientes}</Text>
                            <Text style={styles.estadoLabel}>Pendientes</Text>
                        </View>
                        <View style={[styles.estadoCard, { borderLeftColor: '#10B981' }]}>
                            <Ionicons name="checkmark-done-outline" size={24} color="#10B981" />
                            <Text style={styles.estadoValor}>{reporteData.pedidos.completados}</Text>
                            <Text style={styles.estadoLabel}>Completados</Text>
                        </View>
                        <View style={[styles.estadoCard, { borderLeftColor: '#EF4444' }]}>
                            <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
                            <Text style={styles.estadoValor}>{reporteData.pedidos.cancelados}</Text>
                            <Text style={styles.estadoLabel}>Cancelados</Text>
                        </View>
                    </View>
                </View>

                {/* Métodos de Pago */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💳 Métodos de Pago</Text>
                    <View style={styles.metodosCard}>
                        <MetodoPagoItem
                            icono="cash-outline"
                            label="Efectivo"
                            cantidad={reporteData.metodosPago.efectivo}
                            color="#10B981"
                            total={reporteData.pedidos.total}
                        />
                        <MetodoPagoItem
                            icono="card-outline"
                            label="Tarjeta"
                            cantidad={reporteData.metodosPago.tarjeta}
                            color="#3B82F6"
                            total={reporteData.pedidos.total}
                        />
                        <MetodoPagoItem
                            icono="phone-portrait-outline"
                            label="Yape"
                            cantidad={reporteData.metodosPago.yape}
                            color="#8B5CF6"
                            total={reporteData.pedidos.total}
                        />
                        <MetodoPagoItem
                            icono="wallet-outline"
                            label="Plin"
                            cantidad={reporteData.metodosPago.plin}
                            color="#F59E0B"
                            total={reporteData.pedidos.total}
                        />
                    </View>
                </View>

                {/* Inventario */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Estado del Inventario</Text>
                    <View style={styles.inventarioCard}>
                        <View style={styles.inventarioItem}>
                            <View style={styles.inventarioIcono}>
                                <Ionicons name="cube-outline" size={24} color="#3B82F6" />
                            </View>
                            <View style={styles.inventarioInfo}>
                                <Text style={styles.inventarioValor}>{reporteData.productos.total}</Text>
                                <Text style={styles.inventarioLabel}>Total Productos</Text>
                            </View>
                        </View>

                        <View style={styles.inventarioDivider} />

                        <View style={styles.inventarioItem}>
                            <View style={[styles.inventarioIcono, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="alert-circle-outline" size={24} color="#F59E0B" />
                            </View>
                            <View style={styles.inventarioInfo}>
                                <Text style={styles.inventarioValor}>{reporteData.productos.bajoStock.length}</Text>
                                <Text style={styles.inventarioLabel}>Bajo Stock</Text>
                            </View>
                        </View>

                        <View style={styles.inventarioDivider} />

                        <View style={styles.inventarioItem}>
                            <View style={[styles.inventarioIcono, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
                            </View>
                            <View style={styles.inventarioInfo}>
                                <Text style={styles.inventarioValor}>{reporteData.productos.sinStock}</Text>
                                <Text style={styles.inventarioLabel}>Sin Stock</Text>
                            </View>
                        </View>
                    </View>

                    {/* Productos con bajo stock */}
                    {reporteData.productos.bajoStock.length > 0 && (
                        <View style={styles.alertaStock}>
                            <View style={styles.alertaHeader}>
                                <Ionicons name="warning" size={20} color="#F59E0B" />
                                <Text style={styles.alertaTitle}>Productos con bajo stock</Text>
                            </View>
                            {reporteData.productos.bajoStock.map((producto, index) => (
                                <View key={producto.id} style={styles.alertaItem}>
                                    <Text style={styles.alertaProducto} numberOfLines={1}>
                                        {producto.nombre}
                                    </Text>
                                    <View style={styles.alertaStockBadge}>
                                        <Text style={styles.alertaStockTexto}>{producto.stock} unidades</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

const MetodoPagoItem = ({ icono, label, cantidad, color, total }) => {
    const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0;

    return (
        <View style={styles.metodoItem}>
            <View style={styles.metodoLeft}>
                <View style={[styles.metodoIcono, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icono} size={20} color={color} />
                </View>
                <View>
                    <Text style={styles.metodoLabel}>{label}</Text>
                    <Text style={styles.metodoCantidad}>{cantidad} pedidos</Text>
                </View>
            </View>
            <View style={styles.metodoPorcentaje}>
                <Text style={[styles.metodoPorcentajeTexto, { color }]}>{porcentaje}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    periodosContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    periodoChip: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    periodoActivo: {
        backgroundColor: '#3B82F6',
    },
    periodoTexto: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    periodoTextoActivo: {
        color: '#FFFFFF',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    ventasCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    ventasHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    ventasLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
        marginBottom: 8,
    },
    ventasTotal: {
        fontSize: 32,
        fontWeight: '700',
        color: '#10B981',
    },
    crecimientoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    crecimientoTexto: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    ventasStats: {
        flexDirection: 'row',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    ventasStat: {
        flex: 1,
        alignItems: 'center',
    },
    ventasStatDivider: {
        width: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
    },
    ventasStatLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 4,
    },
    ventasStatValor: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    graficoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    grafico: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 160,
    },
    barraContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    barraWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
    },
    barra: {
        width: 24,
        borderRadius: 6,
        minHeight: 4,
    },
    barraDia: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        marginTop: 4,
    },
    barraCantidad: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '500',
        marginTop: 2,
    },
    estadosGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    estadoCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    estadoValor: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 8,
        marginBottom: 4,
    },
    estadoLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    metodosCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    metodoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    metodoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metodoIcono: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metodoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    metodoCantidad: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    metodoPorcentaje: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    metodoPorcentajeTexto: {
        fontSize: 14,
        fontWeight: '700',
    },
    inventarioCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    inventarioItem: {
        flex: 1,
        alignItems: 'center',
    },
    inventarioDivider: {
        width: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 8,
    },
    inventarioIcono: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    inventarioInfo: {
        alignItems: 'center',
    },
    inventarioValor: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    inventarioLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        textAlign: 'center',
    },
    alertaStock: {
        backgroundColor: '#FFFBEB',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    alertaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    alertaTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#92400E',
    },
    alertaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#FEF3C7',
    },
    alertaProducto: {
        fontSize: 13,
        color: '#78350F',
        fontWeight: '600',
        flex: 1,
    },
    alertaStockBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    alertaStockTexto: {
        fontSize: 11,
        color: '#92400E',
        fontWeight: '700',
    },
});

export default Reportes;