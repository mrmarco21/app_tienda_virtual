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
    Dimensions,
    Image
} from 'react-native';
import { obtenerProductos, obtenerCategorias, buscarProductos } from '../../servicios/api';
import TarjetaProducto from '../../componentes/02_tarjetas/TarjetaProducto';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../../contexto/CarritoContext';
import { useFavoritos } from '../../contexto/FavoritosContext';
import ModalFiltros from '../../componentes/05_modales/ModalFiltros';

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
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]); // 🔄 CAMBIO: Array en lugar de string
    const [ordenPrecio, setOrdenPrecio] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [mostrarModalFiltros, setMostrarModalFiltros] = useState(false);

    // OBTENER CANTIDAD DE PRODUCTOS EN EL CARRITO Y FAVORITOS
    const { carrito } = useCarrito();
    const { favoritos } = useFavoritos();
    const cantidadCarrito = carrito.length;
    const cantidadFavoritos = favoritos.length;

    useEffect(() => {
        cargarDatos();
    }, []);

    // Función helper para normalizar la respuesta de la API
    const normalizarRespuesta = (response) => {
        // Intentar diferentes estructuras de respuesta
        if (response?.data?.data) {
            // Nueva estructura con activos/inactivos
            if (response.data.data.activos) {
                return Array.isArray(response.data.data.activos) ? response.data.data.activos : [];
            }
            return Array.isArray(response.data.data) ? response.data.data : [];
        }
        if (response?.data) {
            // Nueva estructura con activos/inactivos
            if (response.data.activos) {
                return Array.isArray(response.data.activos) ? response.data.activos : [];
            }
            return Array.isArray(response.data) ? response.data : [];
        }
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    };

    // Función para mezclar array aleatoriamente (Fisher-Yates shuffle)
    const mezclarArray = (array) => {
        const nuevoArray = [...array];
        for (let i = nuevoArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
        }
        return nuevoArray;
    };

    const cargarDatos = async () => {
        try {
            setCargando(true);

            // Cargar productos
            const resProductos = await obtenerProductos();
            const productosNormalizados = normalizarRespuesta(resProductos);
            console.log('📦 Productos cargados:', productosNormalizados.length);

            // Mezclar productos aleatoriamente
            const productosMezclados = mezclarArray(productosNormalizados);
            setProductos(productosMezclados);
            setProductosOriginales(productosMezclados);

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
            setProductosOriginales([]);
            setCategorias([]);
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    };

    const buscar = async () => {
        if (!busqueda.trim() && categoriasSeleccionadas.length === 0) { // 🔄 CAMBIO
            cargarDatos();
            return;
        }

        try {
            setCargando(true);
            // Nota: Si tu API no soporta múltiples categorías, filtramos localmente
            const res = await buscarProductos(busqueda.trim(), '');
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

    // 🔄 NUEVA FUNCIÓN: Toggle de categorías múltiples
    const toggleCategoria = (categoria) => {
        setCategoriasSeleccionadas(prev => {
            if (prev.includes(categoria)) {
                // Si ya está seleccionada, la removemos
                return prev.filter(cat => cat !== categoria);
            } else {
                // Si no está seleccionada, la agregamos
                return [...prev, categoria];
            }
        });
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setCategoriasSeleccionadas([]); // 🔄 CAMBIO
        setOrdenPrecio('');
        cargarDatos();
    };

    // 🔄 ACTUALIZADO: Aplicar filtros con múltiples categorías
    const aplicarFiltros = () => {
        let productosFiltrados = [...productosOriginales];

        // Filtrar por categorías múltiples
        if (categoriasSeleccionadas.length > 0) {
            productosFiltrados = productosFiltrados.filter(producto =>
                categoriasSeleccionadas.includes(producto.categoria)
            );
        }

        // Ordenar por precio
        if (ordenPrecio === 'menor') {
            productosFiltrados.sort((a, b) => a.precio - b.precio);
        } else if (ordenPrecio === 'mayor') {
            productosFiltrados.sort((a, b) => b.precio - a.precio);
        }

        setProductos(productosFiltrados);
        setMostrarModalFiltros(false);
    };

    const refrescar = () => {
        setRefrescando(true);
        limpiarFiltros();
    };

    // Obtener icono para la categoría
    const obtenerIconoCategoria = (categoria) => {
        return ICONOS_CATEGORIAS[categoria] || ICONOS_CATEGORIAS['default'];
    };

    // 🆕 NUEVA FUNCIÓN: Obtener texto de categorías seleccionadas
    const obtenerTextoCategoriasSeleccionadas = () => {
        if (categoriasSeleccionadas.length === 0) return '';
        if (categoriasSeleccionadas.length === 1) return ` en ${categoriasSeleccionadas[0]}`;
        if (categoriasSeleccionadas.length === 2) {
            return ` en ${categoriasSeleccionadas[0]} y ${categoriasSeleccionadas[1]}`;
        }
        return ` en ${categoriasSeleccionadas.length} categorías`;
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
                    <View style={styles.headerLeft}>
                        {/* <Image
                            source={require('../../../assets/dsi_maketLogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        /> */}
                        <View>
                            <Text style={styles.titulo}>DSI Market</Text>
                            <Text style={styles.subtitulo}>Encuentra los mejores productos</Text>
                        </View>
                    </View>

                    {/* BOTÓN DE FAVORITOS CON CONTADOR */}
                    <TouchableOpacity
                        style={styles.favoritosButton}
                        onPress={() => navigation.navigate('Favoritos')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="heart-outline" size={28} color="#1A1A1A" />

                        {/* BADGE CONTADOR - Solo se muestra si hay favoritos */}
                        {cantidadFavoritos > 0 && (
                            <View style={styles.favoritosBadge}>
                                <Text style={styles.favoritosBadgeText}>
                                    {cantidadFavoritos > 99 ? '99+' : cantidadFavoritos}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.busquedaRow}>
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
                                    if (categoriasSeleccionadas.length === 0 && !ordenPrecio) cargarDatos(); // 🔄 CAMBIO
                                }}
                                style={styles.clearButton}
                            >
                                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Botón de Filtros */}
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            (categoriasSeleccionadas.length > 0 || ordenPrecio) && styles.filterButtonActive // 🔄 CAMBIO
                        ]}
                        onPress={() => setMostrarModalFiltros(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="options-outline"
                            size={24}
                            color={(categoriasSeleccionadas.length > 0 || ordenPrecio) ? '#FFFFFF' : '#1A1A1A'} // 🔄 CAMBIO
                        />
                        {(categoriasSeleccionadas.length > 0 || ordenPrecio) && ( // 🔄 CAMBIO
                            <View style={styles.filterBadge} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Contador de productos */}
            <View style={styles.contadorContainer}>
                <Text style={styles.contadorTexto}>
                    {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                    {obtenerTextoCategoriasSeleccionadas()} {/* 🔄 CAMBIO */}
                    {ordenPrecio && ` • ${ordenPrecio === 'menor' ? 'Menor precio' : 'Mayor precio'}`}
                </Text>
                {(busqueda || categoriasSeleccionadas.length > 0 || ordenPrecio) && ( // 🔄 CAMBIO
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
                            {(busqueda || categoriasSeleccionadas.length > 0 || ordenPrecio) // 🔄 CAMBIO
                                ? 'Intenta con otros términos de búsqueda'
                                : 'No hay productos disponibles en este momento'}
                        </Text>
                        {(busqueda || categoriasSeleccionadas.length > 0 || ordenPrecio) && ( // 🔄 CAMBIO
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

            {/* Modal de Filtros -  ACTUALIZADO */}
            <ModalFiltros
                visible={mostrarModalFiltros}
                onCerrar={() => setMostrarModalFiltros(false)}
                categorias={categorias}
                categoriasSeleccionadas={categoriasSeleccionadas} // 
                ordenPrecio={ordenPrecio}
                onSeleccionarCategoria={toggleCategoria} //
                onSeleccionarOrden={setOrdenPrecio}
                onAplicarFiltros={aplicarFiltros}
                onLimpiarFiltros={() => {
                    setCategoriasSeleccionadas([]); // 
                    setOrdenPrecio('');
                }}
                obtenerIconoCategoria={obtenerIconoCategoria}
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
        paddingBottom: 2,
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 0,
        height: 0,
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
    favoritosButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    favoritosBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#EF4444',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    favoritosBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    busquedaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    busquedaContainer: {
        flex: 1,
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
        paddingVertical: 14,
    },
    clearButton: {
        padding: 4,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    filterButtonActive: {
        backgroundColor: '#3B82F6',
    },
    filterBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    contadorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 5,
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