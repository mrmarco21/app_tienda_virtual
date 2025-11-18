import { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    RefreshControl,
    Image,
    TextInput,
    ScrollView,
    Platform,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerProductos, eliminarProducto } from '../../servicios/api';

const GestionProductos = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarProductos();
    }, []);

    useEffect(() => {
        filtrarProductos();
    }, [busqueda, productos, categoriaSeleccionada]);

    const cargarProductos = async () => {
        try {
            const response = await obtenerProductos();
            const datos = response.data || response || [];
            console.log('Productos cargados:', datos.length);
            setProductos(datos);
            setProductosFiltrados(datos);
            
            // Extraer categorías únicas
            const categoriasUnicas = ['Todas', ...new Set(datos.map(p => p.categoria).filter(Boolean))];
            setCategorias(categoriasUnicas);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            Alert.alert('Error', 'No se pudieron cargar los productos');
            setProductos([]);
            setProductosFiltrados([]);
        } finally {
            setCargando(false);
        }
    };

    const filtrarProductos = () => {
        if (!Array.isArray(productos)) {
            setProductosFiltrados([]);
            return;
        }

        let filtrados = [...productos];

        // Filtrar por categoría
        if (categoriaSeleccionada !== 'Todas') {
            filtrados = filtrados.filter(p => p.categoria === categoriaSeleccionada);
        }

        // Filtrar por búsqueda
        if (busqueda.trim() !== '') {
            filtrados = filtrados.filter(producto =>
                producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.categoria?.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setProductosFiltrados(filtrados);
    };

    const handleEliminar = (id, nombre) => {
        Alert.alert(
            'Eliminar Producto',
            `¿Estás seguro de eliminar "${nombre}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await eliminarProducto(id);
                            Alert.alert('Éxito', 'Producto eliminado correctamente');
                            cargarProductos();
                        } catch (error) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const getCategoriaIcono = (categoria) => {
        const categoriaLower = categoria?.toLowerCase() || '';
        if (categoriaLower.includes('smartphone') || categoriaLower.includes('celular')) return 'phone-portrait';
        if (categoriaLower.includes('tablet')) return 'tablet-portrait';
        if (categoriaLower.includes('laptop') || categoriaLower.includes('computador')) return 'laptop';
        if (categoriaLower.includes('accesorio')) return 'headset';
        if (categoriaLower.includes('audio')) return 'musical-notes';
        return 'apps';
    };

    const renderProducto = ({ item, index }) => (
        <View style={[
            styles.productCard,
            index === productosFiltrados.length - 1 && styles.lastProductCard
        ]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imagen }} style={styles.productImage} />
                {item.stock < 5 && (
                    <View style={styles.lowStockBadge}>
                        <Ionicons name="alert-circle" size={12} color="#FFF" />
                        <Text style={styles.lowStockText}>Bajo</Text>
                    </View>
                )}
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
                <View style={styles.categoryBadge}>
                    <Ionicons name={getCategoriaIcono(item.categoria)} size={12} color="#6366F1" />
                    <Text style={styles.categoryText}>{item.categoria}</Text>
                </View>

                <View style={styles.productDetails}>
                    <View style={styles.priceContainer}>
                        <View style={styles.detailLabelContainer}>
                            <Ionicons name="cash-outline" size={12} color="#9CA3AF" />
                            <Text style={styles.priceLabel}>Precio</Text>
                        </View>
                        <Text style={styles.productPrice}>S/ {parseFloat(item.precio).toFixed(2)}</Text>
                    </View>

                    <View style={styles.stockContainer}>
                        <View style={styles.detailLabelContainer}>
                            <Ionicons name="cube-outline" size={12} color="#9CA3AF" />
                            <Text style={styles.stockLabel}>Stock</Text>
                        </View>
                        <Text style={[
                            styles.productStock,
                            item.stock < 5 && styles.lowStock
                        ]}>
                            {item.stock} unid.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('EditarProducto', { producto: item })}
                    activeOpacity={0.7}
                >
                    <Ionicons name="create-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEliminar(item.id, item.nombre)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategoriaChip = ({ item }) => {
        const isSelected = item === categoriaSeleccionada;
        const productosCount = item === 'Todas' 
            ? productos.length 
            : productos.filter(p => p.categoria === item).length;

        return (
            <TouchableOpacity
                style={[
                    styles.categoriaChip,
                    isSelected && styles.categoriaChipSelected
                ]}
                onPress={() => setCategoriaSeleccionada(item)}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.categoriaIconContainer,
                    isSelected && styles.categoriaIconContainerSelected
                ]}>
                    <Ionicons 
                        name={item === 'Todas' ? 'grid-outline' : getCategoriaIcono(item)} 
                        size={16} 
                        color={isSelected ? '#FFF' : '#6366F1'} 
                    />
                </View>
                <Text style={[
                    styles.categoriaChipText,
                    isSelected && styles.categoriaChipTextSelected
                ]}>
                    {item}
                </Text>
                <View style={[
                    styles.countBadge,
                    isSelected && styles.countBadgeSelected
                ]}>
                    <Text style={[
                        styles.countBadgeText,
                        isSelected && styles.countBadgeTextSelected
                    ]}>
                        {productosCount}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.resultsContainer}>
                <Ionicons name="layers-outline" size={18} color="#6B7280" />
                <Text style={styles.resultsText}>
                    {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
                    {categoriaSeleccionada !== 'Todas' && ` en ${categoriaSeleccionada}`}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[
                styles.header,
                { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50 }
            ]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Productos</Text>
                    <Text style={styles.headerSubtitle}>Gestiona tu inventario</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar productos..."
                    placeholderTextColor="#9CA3AF"
                    value={busqueda}
                    onChangeText={setBusqueda}
                />
                {busqueda.length > 0 && (
                    <TouchableOpacity onPress={() => setBusqueda('')} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filtro de Categorías */}
            {categorias.length > 0 && (
                <View style={styles.categoriasSection}>
                    <View style={styles.categoriasTitleContainer}>
                        <Ionicons name="funnel-outline" size={16} color="#6B7280" />
                        <Text style={styles.categoriasTitle}>Filtrar por categoría</Text>
                    </View>
                    <FlatList
                        horizontal
                        data={categorias}
                        renderItem={renderCategoriaChip}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriasListContent}
                    />
                </View>
            )}

            {/* Products List */}
            <FlatList
                data={productosFiltrados}
                renderItem={renderProducto}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                refreshControl={
                    <RefreshControl refreshing={cargando} onRefresh={cargarProductos} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons 
                                name={busqueda ? "search-outline" : "cube-outline"} 
                                size={64} 
                                color="#D1D5DB" 
                            />
                        </View>
                        <Text style={styles.emptyText}>
                            {busqueda ? 'No se encontraron productos' : 'No hay productos'}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {busqueda ? 'Intenta con otra búsqueda' : 'Agrega tu primer producto'}
                        </Text>
                        {!busqueda && (
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => navigation.navigate('AgregarProducto')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                                <Text style={styles.emptyButtonText}>Agregar Producto</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={() => navigation.navigate('AgregarProducto')}
                activeOpacity={0.9}
            >
                <Ionicons name="add" size={32} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    // ==================== CONTENEDOR ====================
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    // ==================== HEADER ====================
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
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
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

    // ==================== BÚSQUEDA ====================
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 14,
        marginLeft: 12,
    },
    clearButton: {
        padding: 4,
    },

    // ==================== FILTRO DE CATEGORÍAS ====================
    categoriasSection: {
        backgroundColor: '#FFFFFF',
        marginTop: 12,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    categoriasTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    categoriasTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    categoriasListContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    categoriaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    categoriaChipSelected: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    categoriaIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriaIconContainerSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    categoriaChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    categoriaChipTextSelected: {
        color: '#FFFFFF',
    },
    countBadge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        minWidth: 24,
        alignItems: 'center',
    },
    countBadgeSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
    countBadgeTextSelected: {
        color: '#FFFFFF',
    },

    // ==================== LISTA ====================
    headerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    resultsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    resultsText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    // ==================== CARDS DE PRODUCTOS ====================
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    lastProductCard: {
        marginBottom: 0,
    },
    imageContainer: {
        position: 'relative',
    },
    productImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    lowStockBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        flexDirection: 'row',
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
        alignItems: 'center',
        gap: 4,
    },
    lowStockText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
        gap: 4,
    },
    categoryText: {
        fontSize: 12,
        color: '#6366F1',
        fontWeight: '600',
    },
    productDetails: {
        flexDirection: 'row',
        gap: 16,
    },
    priceContainer: {
        flex: 1,
    },
    detailLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    priceLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#10B981',
    },
    stockContainer: {
        flex: 1,
    },
    stockLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    productStock: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    lowStock: {
        color: '#EF4444',
    },
    actionsContainer: {
        justifyContent: 'center',
        gap: 8,
        marginLeft: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ==================== FAB ====================
    fabButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    // ==================== EMPTY STATE ====================
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        backgroundColor: '#10B981',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default GestionProductos;
