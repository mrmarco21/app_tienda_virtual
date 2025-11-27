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
    const [periodo, setPeriodo] = useState('mes');
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
            const datos = productosData.data || productosData || {};
            const productos = datos.activos || datos || [];

            const pedidosFiltrados = filtrarPorPeriodo(pedidos, periodo);

            const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
            const cantidadPedidos = pedidosFiltrados.length;
            const promedioVenta = cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0;

            const pendientes = pedidosFiltrados.filter(p => p.estado?.toLowerCase() === 'pendiente').length;
            const completados = pedidosFiltrados.filter(p => p.estado?.toLowerCase() === 'completado').length;
            const cancelados = pedidosFiltrados.filter(p => p.estado?.toLowerCase() === 'cancelado').length;

            const metodosPago = {
                efectivo: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('efectivo')).length,
                tarjeta: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('tarjeta')).length,
                yape: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('yape')).length,
                plin: pedidosFiltrados.filter(p => p.metodo_pago?.toLowerCase().includes('plin')).length
            };

            const bajoStock = productos.filter(p => p.stock > 0 && p.stock < 10);
            const sinStock = productos.filter(p => p.stock === 0).length;

            const tendencias = calcularTendencias(pedidos);

            setReporteData({
                ventas: {
                    total: totalVentas,
                    cantidad: cantidadPedidos,
                    promedio: promedioVenta,
                    crecimiento: 12.5
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
                    <Text style={styles.headerTitle}>Reportes y Análisis</Text>
                    <Text style={styles.headerSubtitle}>Panel de control de ventas</Text>
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
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name="cash" size={20} color="#10B981" />
                        </View>
                        <Text style={styles.sectionTitle}>Resumen de Ventas</Text>
                    </View>
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
                                <View style={styles.ventasStatIcono}>
                                    <Ionicons name="receipt" size={20} color="#3B82F6" />
                                </View>
                                <Text style={styles.ventasStatLabel}>Total Pedidos</Text>
                                <Text style={styles.ventasStatValor}>{reporteData.ventas.cantidad}</Text>
                            </View>
                            <View style={styles.ventasStatDivider} />
                            <View style={styles.ventasStat}>
                                <View style={styles.ventasStatIcono}>
                                    <Ionicons name="calculator" size={20} color="#8B5CF6" />
                                </View>
                                <Text style={styles.ventasStatLabel}>Ticket Promedio</Text>
                                <Text style={styles.ventasStatValor}>
                                    S/ {reporteData.ventas.promedio.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Gráfico de Tendencias */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name="trending-up" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.sectionTitle}>Tendencia de Ventas</Text>
                        <Text style={styles.sectionSubtitle}>(Últimos 7 días)</Text>
                    </View>
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
                                        <View style={styles.barraCantidadBadge}>
                                            <Text style={styles.barraCantidad}>{dia.cantidad}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Estado de Pedidos */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name="cube" size={20} color="#6366F1" />
                        </View>
                        <Text style={styles.sectionTitle}>Estado de Pedidos</Text>
                    </View>
                    <View style={styles.estadosGrid}>
                        <View style={styles.estadoCard}>
                            <View style={[styles.estadoIcono, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="time" size={24} color="#F59E0B" />
                            </View>
                            <Text style={styles.estadoValor}>{reporteData.pedidos.pendientes}</Text>
                            <Text style={styles.estadoLabel}>Pendientes</Text>
                        </View>
                        <View style={styles.estadoCard}>
                            <View style={[styles.estadoIcono, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="checkmark-done" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.estadoValor}>{reporteData.pedidos.completados}</Text>
                            <Text style={styles.estadoLabel}>Completados</Text>
                        </View>
                        <View style={styles.estadoCard}>
                            <View style={[styles.estadoIcono, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="close-circle" size={24} color="#EF4444" />
                            </View>
                            <Text style={styles.estadoValor}>{reporteData.pedidos.cancelados}</Text>
                            <Text style={styles.estadoLabel}>Cancelados</Text>
                        </View>
                    </View>
                </View>

                {/* Métodos de Pago */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name="card" size={20} color="#F59E0B" />
                        </View>
                        <Text style={styles.sectionTitle}>Métodos de Pago</Text>
                    </View>
                    <View style={styles.metodosCard}>
                        <MetodoPagoItem
                            icono="cash"
                            label="Efectivo"
                            cantidad={reporteData.metodosPago.efectivo}
                            color="#10B981"
                            total={reporteData.pedidos.total}
                        />
                        <MetodoPagoItem
                            icono="card"
                            label="Tarjeta"
                            cantidad={reporteData.metodosPago.tarjeta}
                            color="#3B82F6"
                            total={reporteData.pedidos.total}
                        />
                        <MetodoPagoItem
                            icono="phone-portrait"
                            label="Yape"
                            cantidad={reporteData.metodosPago.yape}
                            color="#8B5CF6"
                            total={reporteData.pedidos.total}
                        />
                        <MetodoPagoItem
                            icono="wallet"
                            label="Plin"
                            cantidad={reporteData.metodosPago.plin}
                            color="#F59E0B"
                            total={reporteData.pedidos.total}
                        />
                    </View>
                </View>

                {/* Inventario */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconContainer}>
                            <Ionicons name="analytics" size={20} color="#8B5CF6" />
                        </View>
                        <Text style={styles.sectionTitle}>Estado del Inventario</Text>
                    </View>
                    <View style={styles.inventarioCard}>
                        <View style={styles.inventarioItem}>
                            <View style={styles.inventarioIcono}>
                                <Ionicons name="cube" size={24} color="#3B82F6" />
                            </View>
                            <View style={styles.inventarioInfo}>
                                <Text style={styles.inventarioValor}>{reporteData.productos.total}</Text>
                                <Text style={styles.inventarioLabel}>Total Productos</Text>
                            </View>
                        </View>

                        <View style={styles.inventarioDivider} />

                        <View style={styles.inventarioItem}>
                            <View style={[styles.inventarioIcono, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="alert-circle" size={24} color="#F59E0B" />
                            </View>
                            <View style={styles.inventarioInfo}>
                                <Text style={styles.inventarioValor}>{reporteData.productos.bajoStock.length}</Text>
                                <Text style={styles.inventarioLabel}>Bajo Stock</Text>
                            </View>
                        </View>

                        <View style={styles.inventarioDivider} />

                        <View style={styles.inventarioItem}>
                            <View style={[styles.inventarioIcono, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="ban" size={24} color="#EF4444" />
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
                                <View style={styles.alertaIcono}>
                                    <Ionicons name="warning" size={18} color="#F59E0B" />
                                </View>
                                <Text style={styles.alertaTitle}>Productos con stock bajo</Text>
                            </View>
                            {reporteData.productos.bajoStock.map((producto) => (
                                <View key={producto.id} style={styles.alertaItem}>
                                    <View style={styles.alertaProductoInfo}>
                                        <Ionicons name="cube-outline" size={16} color="#92400E" />
                                        <Text style={styles.alertaProducto} numberOfLines={1}>
                                            {producto.nombre}
                                        </Text>
                                    </View>
                                    <View style={styles.alertaStockBadge}>
                                        <Text style={styles.alertaStockTexto}>{producto.stock}</Text>
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
                <View style={styles.metodoTextos}>
                    <Text style={styles.metodoLabel}>{label}</Text>
                    <Text style={styles.metodoCantidad}>{cantidad} pedidos</Text>
                </View>
            </View>
            <View style={[styles.metodoPorcentaje, { backgroundColor: color + '10' }]}>
                <Text style={[styles.metodoPorcentajeTexto, { color }]}>{porcentaje}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
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
        fontWeight: '500',
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
        marginBottom: 24,
    },
    periodoChip: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    periodoActivo: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
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
        marginBottom: 24,
    },
    ventasLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
        marginBottom: 8,
    },
    ventasTotal: {
        fontSize: 36,
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
    ventasStatIcono: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    ventasStatDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    ventasStatLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        marginTop: 4,
        marginBottom: 4,
        textAlign: 'center',
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
        width: 28,
        borderRadius: 8,
        minHeight: 4,
    },
    barraDia: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '700',
        marginTop: 6,
        textTransform: 'capitalize',
    },
    barraCantidadBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 4,
    },
    barraCantidad: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '700',
    },
    estadosGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    estadoCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    estadoIcono: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    estadoValor: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    estadoLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textAlign: 'center',
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
        flex: 1,
    },
    metodoIcono: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metodoTextos: {
        flex: 1,
    },
    metodoLabel: {
        fontSize: 15,
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
        borderRadius: 8,
    },
    metodoPorcentajeTexto: {
        fontSize: 14,
        fontWeight: '700',
    },
    inventarioCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
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
        backgroundColor: '#E5E7EB',
        marginHorizontal: 12,
    },
    inventarioIcono: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    inventarioInfo: {
        alignItems: 'center',
    },
    inventarioValor: {
        fontSize: 22,
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
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    alertaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    alertaIcono: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#FEF3C7',
    },
    alertaProductoInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    alertaProducto: {
        fontSize: 13,
        color: '#78350F',
        fontWeight: '600',
        flex: 1,
    },
    alertaStockBadge: {
        backgroundColor: '#FDE68A',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        minWidth: 40,
        alignItems: 'center',
    },
    alertaStockTexto: {
        fontSize: 12,
        color: '#92400E',
        fontWeight: '700',
    },
});

export default Reportes;
