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

const { width } = Dimensions.get('window');

const Inicio = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);

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
            console.log('Productos cargados:', productosNormalizados.length);
            setProductos(productosNormalizados);

            // Cargar categorías
            const resCategorias = await obtenerCategorias();
            const categoriasNormalizadas = normalizarRespuesta(resCategorias);
            
            // Asegurar que las categorías estén en el formato correcto
            const categoriasFormateadas = categoriasNormalizadas.map(cat => {
                if (typeof cat === 'string') {
                    return { categoria: cat };
                }
                return cat;
            });
            
            console.log('Categorías cargadas:', categoriasFormateadas);
            setCategorias(categoriasFormateadas);

        } catch (error) {
            console.error('Error al cargar datos:', error);
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
            console.log('Resultados búsqueda:', productosNormalizados.length);
            setProductos(productosNormalizados);
        } catch (error) {
            console.error('Error al buscar:', error);
            Alert.alert('Error', 'Error al buscar productos');
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorCategoria = async (categoria) => {
        setCategoriaSeleccionada(categoria);
        
        if (!categoria) {
            // Si no hay categoría, cargar todos los productos
            cargarDatos();
            return;
        }

        try {
            setCargando(true);
            const res = await buscarProductos('', categoria);
            const productosNormalizados = normalizarRespuesta(res);
            console.log(`Productos de categoría "${categoria}":`, productosNormalizados.length);
            setProductos(productosNormalizados);
        } catch (error) {
            console.error('Error al filtrar por categoría:', error);
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

    if (cargando && productos.length === 0) {
        return (
            <View style={styles.centrado}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.textoCargando}>Cargando productos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con búsqueda */}
            <View style={styles.header}>
                <Text style={styles.titulo}>🛒 Tienda Virtual</Text>
                <View style={styles.busquedaContainer}>
                    <Text style={styles.iconoBusqueda}>🔍</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar productos..."
                        placeholderTextColor="#999"
                        value={busqueda}
                        onChangeText={setBusqueda}
                        onSubmitEditing={buscar}
                        returnKeyType="search"
                    />
                    {busqueda.length > 0 && (
                        <TouchableOpacity onPress={() => {
                            setBusqueda('');
                            if (!categoriaSeleccionada) cargarDatos();
                        }}>
                            <Text style={styles.iconoCerrar}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filtros de categorías */}
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
                    >
                        <Text style={[
                            styles.categoriaTexto,
                            !categoriaSeleccionada && styles.categoriaTextoActiva
                        ]}>
                            📦 Todas
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
                        >
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

            {/* Contador de productos */}
            <View style={styles.contadorContainer}>
                <Text style={styles.contadorTexto}>
                    {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                    {categoriaSeleccionada && ` en ${categoriaSeleccionada}`}
                </Text>
                {(busqueda || categoriaSeleccionada) && (
                    <TouchableOpacity onPress={limpiarFiltros}>
                        <Text style={styles.limpiarTexto}>Limpiar filtros</Text>
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
                        <Text style={styles.emptyIcon}>🛍️</Text>
                        <Text style={styles.textoVacio}>No se encontraron productos</Text>
                        {(busqueda || categoriaSeleccionada) && (
                            <TouchableOpacity style={styles.botonVerTodos} onPress={limpiarFiltros}>
                                <Text style={styles.textoBotonVerTodos}>Ver todos los productos</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                ListFooterComponent={
                    cargando && productos.length > 0 ? (
                        <ActivityIndicator size="small" color="#FF6B6B" style={styles.footerLoader} />
                    ) : null
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centrado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    textoCargando: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: '#FFF',
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 12,
    },
    busquedaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6F7',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    iconoBusqueda: {
        fontSize: 20,
        marginRight: 8,
    },
    iconoCerrar: {
        fontSize: 20,
        color: '#999',
        paddingHorizontal: 5,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#2C3E50',
        paddingVertical: 0,
    },
    categoriasWrapper: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    categoriasContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    categoriaChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F5F6F7',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoriaActiva: {
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
    },
    categoriaTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    categoriaTextoActiva: {
        color: '#FFF',
    },
    contadorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    contadorTexto: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    limpiarTexto: {
        fontSize: 14,
        color: '#FF6B6B',
        fontWeight: '600',
    },
    lista: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
    },
    textoVacio: {
        fontSize: 18,
        color: '#999',
        marginTop: 8,
        fontWeight: '500',
    },
    botonVerTodos: {
        marginTop: 20,
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    textoBotonVerTodos: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    footerLoader: {
        paddingVertical: 20,
    },
});

export default Inicio;