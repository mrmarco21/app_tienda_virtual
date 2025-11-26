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
    Platform,
    StatusBar,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerProductos, eliminarProducto, reactivarProducto } from '../../servicios/api';
import ModalFiltrosAdmin from '../../componentes/05_modales/ModalFiltrosAdmin';


const GestionProductos = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [productosInactivos, setProductosInactivos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [ordenPrecio, setOrdenPrecio] = useState('');
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [menuEstadoVisible, setMenuEstadoVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalProductoVisible, setModalProductoVisible] = useState(false);
    const [modalFiltrosVisible, setModalFiltrosVisible] = useState(false);


    useEffect(() => {
        cargarProductos();
    }, []);


    useEffect(() => {
        filtrarProductos();
    }, [busqueda, productos, productosInactivos, categoriaSeleccionada, ordenPrecio, mostrarInactivos]);


    const cargarProductos = async () => {
        try {
            const response = await obtenerProductos();
            const datos = response.data || response || {};


            const activos = datos.activos || datos || [];
            const inactivos = datos.inactivos || [];


            console.log('Productos activos:', activos.length, 'Inactivos:', inactivos.length);
            setProductos(activos);
            setProductosInactivos(inactivos);
            setProductosFiltrados(activos);
            setProductosOriginales(activos);


            const categoriasUnicas = ['Todas', ...new Set(activos.map(p => p.categoria).filter(Boolean))];
            setCategorias(categoriasUnicas);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            Alert.alert('Error', 'No se pudieron cargar los productos');
            setProductos([]);
            setProductosInactivos([]);
            setProductosFiltrados([]);
            setProductosOriginales([]);
        } finally {
            setCargando(false);
        }
    };


    const filtrarProductos = () => {
        const listaBase = mostrarInactivos ? productosInactivos : productos;


        if (!Array.isArray(listaBase)) {
            setProductosFiltrados([]);
            return;
        }


        let filtrados = [...listaBase];


        if (categoriaSeleccionada !== 'Todas') {
            filtrados = filtrados.filter(p => p.categoria === categoriaSeleccionada);
        }


        if (busqueda.trim() !== '') {
            filtrados = filtrados.filter(producto =>
                producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.categoria?.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        // Aplicar ordenamiento por precio
        if (ordenPrecio === 'menor') {
            filtrados.sort((a, b) => a.precio - b.precio);
        } else if (ordenPrecio === 'mayor') {
            filtrados.sort((a, b) => b.precio - a.precio);
        }


        setProductosFiltrados(filtrados);
    };

    const aplicarFiltros = () => {
        filtrarProductos();
        setModalFiltrosVisible(false);
    };

    const limpiarFiltrosModal = () => {
        setCategoriaSeleccionada('Todas');
        setOrdenPrecio('');
    };


    const handleEliminar = (id, nombre) => {
        setModalProductoVisible(false);
        setTimeout(() => {
            Alert.alert(
                'Desactivar Producto',
                `¿Estás seguro de desactivar "${nombre}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Desactivar',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await eliminarProducto(id);
                                Alert.alert('Éxito', 'Producto desactivado correctamente');
                                cargarProductos();
                            } catch (error) {
                                Alert.alert('Error', error.message);
                            }
                        },
                    },
                ]
            );
        }, 300);
    };


    const handleReactivar = (id, nombre) => {
        setModalProductoVisible(false);
        setTimeout(() => {
            Alert.alert(
                'Reactivar Producto',
                `¿Deseas reactivar "${nombre}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Reactivar',
                        onPress: async () => {
                            try {
                                await reactivarProducto(id);
                                Alert.alert('Éxito', 'Producto reactivado correctamente');
                                cargarProductos();
                            } catch (error) {
                                Alert.alert('Error', error.message);
                            }
                        },
                    },
                ]
            );
        }, 300);
    };


    const handleCambiarEstado = (inactivos) => {
        setMostrarInactivos(inactivos);
        setMenuEstadoVisible(false);
    };


    const handleEditar = () => {
        setModalProductoVisible(false);
        setTimeout(() => {
            navigation.navigate('EditarProducto', { producto: productoSeleccionado });
        }, 300);
    };


    const abrirMenuProducto = (item) => {
        setProductoSeleccionado(item);
        setModalProductoVisible(true);
    };


    const getCategoriaIcono = (categoria) => {
        const c = categoria?.toLowerCase() || '';

        // Smartphones
        if (c.includes('smartphone') || c.includes('celular') || c.includes('phone'))
            return 'phone-portrait-outline';

        // Laptops
        if (c.includes('laptop') || c.includes('notebook'))
            return 'laptop-outline';

        // Computadoras (PC de escritorio)
        if (c.includes('computadora') || c.includes('pc') || c.includes('escritorio'))
            return 'desktop-outline';

        // Tablets
        if (c.includes('tablet') || c.includes('ipad'))
            return 'tablet-portrait-outline';

        // Televisores y monitores
        if (c.includes('televisor') || c.includes('tv') || c.includes('monitor'))
            return 'tv-outline';

        // Gaming
        if (c.includes('gaming') || c.includes('juego') || c.includes('gamer') || c.includes('playstation') || c.includes('xbox') || c.includes('nintendo'))
            return 'game-controller-outline';

        // Audio
        if (c.includes('audio') || c.includes('audífono') || c.includes('parlante') || c.includes('bocina'))
            return 'headset-outline';

        // Cámaras y fotografía
        if (c.includes('cámara') || c.includes('camara') || c.includes('fotografía') || c.includes('foto'))
            return 'camera-outline';

        // Wearables
        if (c.includes('reloj') || c.includes('watch') || c.includes('wearable') || c.includes('pulsera'))
            return 'watch-outline';

        // Accesorios
        if (c.includes('accesorio') || c.includes('cable') || c.includes('cargador') || c.includes('adaptador'))
            return 'construct-outline';

        // Almacenamiento
        if (c.includes('almacenamiento') || c.includes('ssd') || c.includes('hdd') || c.includes('memoria') || c.includes('usb'))
            return 'save-outline';

        // Redes
        if (c.includes('red') || c.includes('router') || c.includes('wifi') || c.includes('modem'))
            return 'wifi-outline';

        // Impresoras y escáneres
        if (c.includes('impresora') || c.includes('printer') || c.includes('escaner') || c.includes('scanner'))
            return 'print-outline';

        // Componentes de PC
        if (c.includes('componente') || c.includes('tarjeta') || c.includes('procesador') || c.includes('ram') || c.includes('gpu') || c.includes('motherboard'))
            return 'hardware-chip-outline';

        // Electrónica en general
        if (c.includes('electrónica') || c.includes('electronica') || c.includes('gadget') || c.includes('dispositivo'))
            return 'cube-outline';

        // Software
        if (c.includes('software') || c.includes('licencia') || c.includes('programa') || c.includes('app'))
            return 'code-slash-outline';

        // Default
        return 'pricetag-outline';
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
                    style={styles.menuButton}
                    onPress={() => abrirMenuProducto(item)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </View>
    );


    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.resultsContainer}>
                <Ionicons name="layers-outline" size={18} color="#6B7280" />
                <Text style={styles.resultsText}>
                    {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
                    {categoriaSeleccionada !== 'Todas' && ` en ${categoriaSeleccionada}`}
                    {ordenPrecio && ` • ${ordenPrecio === 'menor' ? 'Menor precio' : 'Mayor precio'}`}
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
                    <Text style={styles.headerSubtitle}>
                        {mostrarInactivos ? 'Inactivos' : 'Activos'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => setMenuEstadoVisible(true)}
                    style={styles.menuDotsButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="ellipsis-vertical" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>


            {/* Modal de Menú Estado (Activos/Inactivos) */}
            <Modal
                visible={menuEstadoVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuEstadoVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuEstadoVisible(false)}
                >
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity
                            style={[
                                styles.dropdownItem,
                                !mostrarInactivos && styles.dropdownItemActive
                            ]}
                            onPress={() => handleCambiarEstado(false)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={!mostrarInactivos ? '#10B981' : '#6B7280'}
                            />
                            <Text style={[
                                styles.dropdownItemText,
                                !mostrarInactivos && styles.dropdownItemTextActive
                            ]}>
                                Productos Activos
                            </Text>
                            {!mostrarInactivos && (
                                <Ionicons name="checkmark" size={20} color="#10B981" />
                            )}
                        </TouchableOpacity>


                        <View style={styles.dropdownDivider} />


                        <TouchableOpacity
                            style={[
                                styles.dropdownItem,
                                mostrarInactivos && styles.dropdownItemActive
                            ]}
                            onPress={() => handleCambiarEstado(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={mostrarInactivos ? '#EF4444' : '#6B7280'}
                            />
                            <Text style={[
                                styles.dropdownItemText,
                                mostrarInactivos && styles.dropdownItemTextActive
                            ]}>
                                Productos Inactivos
                            </Text>
                            {mostrarInactivos && (
                                <Ionicons name="checkmark" size={20} color="#EF4444" />
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>


            {/* Modal Bottom Sheet de Acciones del Producto */}
            <Modal
                visible={modalProductoVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalProductoVisible(false)}
            >
                <TouchableOpacity
                    style={styles.bottomSheetOverlay}
                    activeOpacity={1}
                    onPress={() => setModalProductoVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.bottomSheetContainer}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Handle Bar */}
                        <View style={styles.handleBar} />


                        {/* Información del Producto */}
                        {productoSeleccionado && (
                            <View style={styles.productPreview}>
                                <Image
                                    source={{ uri: productoSeleccionado.imagen }}
                                    style={styles.productPreviewImage}
                                />
                                <View style={styles.productPreviewInfo}>
                                    <Text style={styles.productPreviewName} numberOfLines={2}>
                                        {productoSeleccionado.nombre}
                                    </Text>
                                    <View style={styles.productPreviewDetails}>
                                        <View style={styles.productPreviewBadge}>
                                            <Ionicons name="pricetag" size={12} color="#10B981" />
                                            <Text style={styles.productPreviewPrice}>
                                                S/ {parseFloat(productoSeleccionado.precio).toFixed(2)}
                                            </Text>
                                        </View>
                                        <View style={styles.productPreviewBadge}>
                                            <Ionicons name="cube" size={12} color="#6366F1" />
                                            <Text style={styles.productPreviewStock}>
                                                {productoSeleccionado.stock} unid.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}


                        {/* Opciones */}
                        <View style={styles.actionsSection}>
                            {mostrarInactivos ? (
                                // Opciones para productos inactivos
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleReactivar(productoSeleccionado?.id, productoSeleccionado?.nombre)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.actionIconContainer, { backgroundColor: '#D1FAE5' }]}>
                                        <Ionicons name="refresh" size={22} color="#10B981" />
                                    </View>
                                    <View style={styles.actionTextContainer}>
                                        <Text style={styles.actionTitle}>Reactivar Producto</Text>
                                        <Text style={styles.actionDescription}>
                                            Volver a mostrar en productos activos
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            ) : (
                                // Opciones para productos activos
                                <>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={handleEditar}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.actionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                                            <Ionicons name="create" size={22} color="#3B82F6" />
                                        </View>
                                        <View style={styles.actionTextContainer}>
                                            <Text style={styles.actionTitle}>Editar Producto</Text>
                                            <Text style={styles.actionDescription}>
                                                Modificar información y detalles
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                    </TouchableOpacity>


                                    <View style={styles.actionDivider} />


                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleEliminar(productoSeleccionado?.id, productoSeleccionado?.nombre)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.actionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                                            <Ionicons name="close-circle" size={22} color="#F59E0B" />
                                        </View>
                                        <View style={styles.actionTextContainer}>
                                            <Text style={styles.actionTitle}>Desactivar Producto</Text>
                                            <Text style={styles.actionDescription}>
                                                Ocultar de la lista de productos
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>


                        {/* Botón Cancelar */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalProductoVisible(false)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>


            {/* Search Bar con Botón de Filtros */}
            <View style={styles.searchRow}>
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

                {/* Botón de Filtros */}
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        (categoriaSeleccionada !== 'Todas' || ordenPrecio) && styles.filterButtonActive
                    ]}
                    onPress={() => setModalFiltrosVisible(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="options-outline"
                        size={24}
                        color={(categoriaSeleccionada !== 'Todas' || ordenPrecio) ? '#FFFFFF' : '#1A1A1A'}
                    />
                    {(categoriaSeleccionada !== 'Todas' || ordenPrecio) && (
                        <View style={styles.filterBadge} />
                    )}
                </TouchableOpacity>
            </View>


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

            {/* Modal de Filtros */}
            <ModalFiltrosAdmin
                visible={modalFiltrosVisible}
                onCerrar={() => setModalFiltrosVisible(false)}
                categorias={categorias}
                categoriaSeleccionada={categoriaSeleccionada}
                ordenPrecio={ordenPrecio}
                onSeleccionarCategoria={setCategoriaSeleccionada}
                onSeleccionarOrden={setOrdenPrecio}
                onAplicarFiltros={aplicarFiltros}
                onLimpiarFiltros={limpiarFiltrosModal}
                getCategoriaIcono={getCategoriaIcono}
            />
        </View>
    );
};


const styles = StyleSheet.create({
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
        fontWeight: '500',
        color: '#6B7280',
        marginTop: 2,
    },
    menuDotsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },


    // ==================== MODAL DROPDOWN ESTADO ====================
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 70 : 120,
        paddingRight: 16,
    },
    dropdownMenu: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        minWidth: 220,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    dropdownItemActive: {
        backgroundColor: '#F9FAFB',
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    dropdownItemTextActive: {
        fontWeight: '600',
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 12,
    },


    // ==================== MODAL BOTTOM SHEET PRODUCTO ====================
    bottomSheetOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheetContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    productPreview: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    productPreviewImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    productPreviewInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productPreviewName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    productPreviewDetails: {
        flexDirection: 'row',
        gap: 12,
    },
    productPreviewBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    productPreviewPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: '#10B981',
    },
    productPreviewStock: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
    },
    actionsSection: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 14,
    },
    actionIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    actionDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    actionDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    cancelButton: {
        marginHorizontal: 20,
        marginTop: 12,
        paddingVertical: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6B7280',
    },


    // ==================== BÚSQUEDA ====================
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 10,
        gap: 8,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
        marginLeft: 8,
    },
    menuButton: {
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
