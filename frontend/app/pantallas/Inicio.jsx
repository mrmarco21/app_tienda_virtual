import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions
} from 'react-native';
import { obtenerProductos, obtenerCategorias, buscarProductos } from '../servicios/api';
import TarjetaProducto from '../componentes/TarjetaProducto';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../contexto/CarritoContext'; // IMPORTAR useCarrito

const { width } = Dimensions.get('window');

// Mapeo de categorías a iconos actualizado
const ICONOS_CATEGORIAS = {
    'Smartphones': 'phone-portrait-outline',
    'Laptops': 'laptop-outline',
    'Computadoras': 'desktop-outline',
    'Tablets': 'tablet-portrait-outline',
    'Televisores y monitores': 'tv-outline',
    'Gaming': 'game-controller-outline',
    'Audio': 'headset-outline',
    'Cámaras y fotografía': 'camera-outline',
    'Wearables': 'watch-outline',
    'Accesorios': 'construct-outline',
    'Almacenamiento': 'save-outline',
    'Redes': 'wifi-outline',
    'Impresoras y escáneres': 'print-outline',
    'Componentes de PC': 'hardware-chip-outline',
    'Electrónica': 'cube-outline',
    'Software': 'code-slash-outline',
    'default': 'pricetag-outline'
};

const Inicio = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);

    // OBTENER CANTIDAD DE PRODUCTOS EN EL CARRITO
    const { carrito } = useCarrito();
    const cantidadCarrito = carrito.length;

    useEffect(() => {
        cargarDatos();
    }, []);

    // Función helper para normalizar la respuesta de la API
    const normalizarRespuesta = (response) => {
        // Intentar diferentes estructuras de respuesta
        if (response?.data?.data) {
            return Array.isArray(response.data.data) ? response.data.data : [];
        }
        if (response?.data) {
            return Array.isArray(response.data) ? response.data : [];
        }
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    };

    const cargarDatos = async () => {
        try {
            setCargando(true);

            // Cargar productos
            const resProductos = await obtenerProductos();
            const productosNormalizados = normalizarRespuesta(resProductos);
            console.log('📦 Productos cargados:', productosNormalizados.length);
            setProductos(productosNormalizados);

            // Cargar categorías desde la API (solo las que existen en productos)
            const resCategorias = await obtenerCategorias();
            const categoriasNormalizadas = normalizarRespuesta(resCategorias);

            // Asegurar que las categorías estén en el formato correcto
            const categoriasFormateadas = categoriasNormalizadas.map(cat => {
                if (typeof cat === 'string') {
                    return { categoria: cat };
                }
                return cat;
            });

            console.log('🏷️ Categorías disponibles:', categoriasFormateadas);
            setCategorias(categoriasFormateadas);

        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
            Alert.alert(
                'Error de conexión',
                `No se pudo conectar al servidor.\n${error.message}`,
                [
                    { text: 'Reintentar', onPress: cargarDatos },
                    { text: 'Cancelar', style: 'cancel' }
                ]
            );
            setProductos([]);
            setCategorias([]);
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    };

    const buscar = async () => {
        if (!busqueda.trim() && !categoriaSeleccionada) {
            cargarDatos();
            return;
        }

        try {
            setCargando(true);
            const res = await buscarProductos(busqueda.trim(), categoriaSeleccionada);
            const productosNormalizados = normalizarRespuesta(res);
            console.log('🔍 Resultados búsqueda:', productosNormalizados.length);
            setProductos(productosNormalizados);
        } catch (error) {
            console.error('❌ Error al buscar:', error);
            Alert.alert('Error', 'Error al buscar productos');
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorCategoria = async (categoria) => {
        setCategoriaSeleccionada(categoria);

        if (!categoria) {
            cargarDatos();
            return;
        }

        try {
            setCargando(true);
            const res = await buscarProductos('', categoria);
            const productosNormalizados = normalizarRespuesta(res);
            console.log(`📂 Productos de categoría "${categoria}":`, productosNormalizados.length);
            setProductos(productosNormalizados);
        } catch (error) {
            console.error('❌ Error al filtrar por categoría:', error);
            Alert.alert('Error', 'Error al filtrar productos');
        } finally {
            setCargando(false);
        }
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setCategoriaSeleccionada('');
        cargarDatos();
    };

    const refrescar = () => {
        setRefrescando(true);
        limpiarFiltros();
    };

    // Obtener icono para la categoría
    const obtenerIconoCategoria = (categoria) => {
        return ICONOS_CATEGORIAS[categoria] || ICONOS_CATEGORIAS['default'];
    };

    if (cargando && productos.length === 0) {
        return (
            <View style={styles.centrado}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.textoCargando}>Cargando productos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con búsqueda */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.titulo}>ElectroStore App</Text>
                        <Text style={styles.subtitulo}>Encuentra los mejores productos</Text>
                    </View>

                    {/* BOTÓN DE CARRITO CON CONTADOR */}
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => navigation.navigate('Carrito')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="cart-outline" size={28} color="#1A1A1A" />

                        {/* BADGE CONTADOR - Solo se muestra si hay productos */}
                        {cantidadCarrito > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>
                                    {cantidadCarrito > 99 ? '99+' : cantidadCarrito}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.busquedaContainer}>
                    <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.iconoBusqueda} />
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar productos..."
                        placeholderTextColor="#9CA3AF"
                        value={busqueda}
                        onChangeText={setBusqueda}
                        onSubmitEditing={buscar}
                        returnKeyType="search"
                    />
                    {busqueda.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setBusqueda('');
                                if (!categoriaSeleccionada) cargarDatos();
                            }}
                            style={styles.clearButton}
                        >
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filtros de categorías */}
            {categorias.length > 0 && (
                <View style={styles.categoriasWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriasContainer}
                    >
                        <TouchableOpacity
                            style={[
                                styles.categoriaChip,
                                !categoriaSeleccionada && styles.categoriaActiva
                            ]}
                            onPress={limpiarFiltros}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="apps"
                                size={18}
                                color={!categoriaSeleccionada ? '#FFFFFF' : '#6B7280'}
                            />
                            <Text style={[
                                styles.categoriaTexto,
                                !categoriaSeleccionada && styles.categoriaTextoActiva
                            ]}>
                                Todas
                            </Text>
                        </TouchableOpacity>

                        {categorias.map((cat, index) => (
                            <TouchableOpacity
                                key={cat.categoria || index}
                                style={[
                                    styles.categoriaChip,
                                    categoriaSeleccionada === cat.categoria && styles.categoriaActiva
                                ]}
                                onPress={() => filtrarPorCategoria(cat.categoria)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={obtenerIconoCategoria(cat.categoria)}
                                    size={18}
                                    color={categoriaSeleccionada === cat.categoria ? '#FFFFFF' : '#6B7280'}
                                />
                                <Text style={[
                                    styles.categoriaTexto,
                                    categoriaSeleccionada === cat.categoria && styles.categoriaTextoActiva
                                ]}>
                                    {cat.categoria}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Contador de productos */}
            <View style={styles.contadorContainer}>
                <Text style={styles.contadorTexto}>
                    {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                    {categoriaSeleccionada && ` en ${categoriaSeleccionada}`}
                </Text>
                {(busqueda || categoriaSeleccionada) && (
                    <TouchableOpacity onPress={limpiarFiltros} activeOpacity={0.7}>
                        <View style={styles.limpiarButton}>
                            <Ionicons name="refresh" size={14} color="#3B82F6" />
                            <Text style={styles.limpiarTexto}>Limpiar</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* Lista de productos */}
            <FlatList
                data={productos}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <TarjetaProducto
                        producto={item}
                        onPress={() => navigation.navigate('DetalleProducto', { producto: item })}
                    />
                )}
                numColumns={2}
                contentContainerStyle={styles.lista}
                refreshing={refrescando}
                onRefresh={refrescar}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                        </View>
                        <Text style={styles.textoVacio}>No se encontraron productos</Text>
                        <Text style={styles.textoVacioSubtitulo}>
                            {(busqueda || categoriaSeleccionada)
                                ? 'Intenta con otros términos de búsqueda'
                                : 'No hay productos disponibles en este momento'}
                        </Text>
                        {(busqueda || categoriaSeleccionada) && (
                            <TouchableOpacity
                                style={styles.botonVerTodos}
                                onPress={limpiarFiltros}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                                <Text style={styles.textoBotonVerTodos}>Ver todos los productos</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                ListFooterComponent={
                    cargando && productos.length > 0 ? (
                        <ActivityIndicator size="small" color="#3B82F6" style={styles.footerLoader} />
                    ) : <View style={{ height: 20 }} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    titulo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    subtitulo: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    cartButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Para posicionar el badge
    },
    // ESTILOS DEL BADGE
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#3B82F6',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    busquedaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    iconoBusqueda: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 10,
    },
    clearButton: {
        padding: 4,
    },
    categoriasWrapper: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    categoriasContainer: {
        paddingHorizontal: 16,
        gap: 4,
    },
    categoriaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        gap: 6,
    },
    categoriaActiva: {
        backgroundColor: '#3B82F6',
    },
    categoriaTexto: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    categoriaTextoActiva: {
        color: '#FFFFFF',
    },
    contadorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 7,
        backgroundColor: '#FFFFFF',
    },
    contadorTexto: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '600',
    },
    limpiarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    limpiarTexto: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: '600',
    },
    lista: {
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    centrado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    textoCargando: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 30,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    textoVacio: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    textoVacioSubtitulo: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 24,
    },
    botonVerTodos: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    textoBotonVerTodos: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    footerLoader: {
        marginVertical: 20,
    },
});

export default Inicio;
