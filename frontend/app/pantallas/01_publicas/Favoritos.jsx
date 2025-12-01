import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritos } from '../../contexto/FavoritosContext';
import { useCarrito } from '../../contexto/CarritoContext';

const Favoritos = ({ navigation }) => {
    const { favoritos, eliminarDeFavoritos } = useFavoritos();
    const { agregarAlCarrito, carrito } = useCarrito();

    const estaEnCarrito = (productoId) => {
        return carrito.some(item => item.id === productoId);
    };

    const handleEliminar = (producto) => {
        Alert.alert(
            'Eliminar de favoritos',
            `¿Deseas eliminar "${producto.nombre}" de tus favoritos?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => eliminarDeFavoritos(producto.id)
                }
            ]
        );
    };

    const handleAgregarAlCarrito = (producto) => {
        if (producto.stock <= 0) {
            Alert.alert('Sin stock', 'Este producto no está disponible');
            return;
        }

        agregarAlCarrito(producto);
        Alert.alert(
            'Agregado al carrito',
            `${producto.nombre} se agregó al carrito`,
            [
                { text: 'Seguir viendo', style: 'cancel' },
                {
                    text: 'Ver carrito',
                    onPress: () => navigation.navigate('Carrito')
                }
            ]
        );
    };

    const renderProducto = ({ item }) => {
        const sinStock = item.stock <= 0;
        const yaEnCarrito = estaEnCarrito(item.id);

        return (
            <View style={styles.productoCard}>
                {/* Imagen superior con overlay */}
                <TouchableOpacity
                    style={styles.imagenSection}
                    onPress={() => navigation.navigate('DetalleProducto', { producto: item })}
                    activeOpacity={0.9}
                >
                    <Image
                        source={{
                            uri: item.imagen || 'https://via.placeholder.com/150/f0f0f0/999999?text=Sin+Imagen'
                        }}
                        style={styles.imagen}
                        resizeMode="cover"
                    />
                    
                    {/* Overlay con gradiente */}
                    <View style={styles.imageOverlay} />
                    
                    {/* Badges flotantes */}
                    <View style={styles.badgesContainer}>
                        <View style={styles.categoriaFloatingTag}>
                            <Ionicons name="pricetag" size={10} color="#3B82F6" />
                            <Text style={styles.categoriaFloatingTexto}>{item.categoria}</Text>
                        </View>
                        
                        <TouchableOpacity
                            style={styles.heartButton}
                            onPress={() => handleEliminar(item)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="heart" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    {sinStock && (
                        <View style={styles.sinStockOverlay}>
                            <View style={styles.sinStockBadge}>
                                <Ionicons name="close-circle" size={16} color="#FFFFFF" />
                                <Text style={styles.sinStockTexto}>Agotado</Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Información inferior */}
                <View style={styles.infoSection}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DetalleProducto', { producto: item })}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.nombre} numberOfLines={2}>
                            {item.nombre}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.precioStockContainer}>
                        <View style={styles.precioBox}>
                            <Text style={styles.precioLabel}>Precio</Text>
                            <Text style={styles.precio}>S/ {parseFloat(item.precio).toFixed(2)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.stockBox}>
                            <Text style={styles.stockLabel}>Stock</Text>
                            <View style={styles.stockValueContainer}>
                                <Ionicons
                                    name={sinStock ? "close-circle" : "cube-outline"}
                                    size={14}
                                    color={sinStock ? "#EF4444" : "#10B981"}
                                />
                                <Text style={[
                                    styles.stockValue,
                                    sinStock && styles.stockValueSinStock
                                ]}>
                                    {sinStock ? 'No disp.' : item.stock}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Botón de acción */}
                    <TouchableOpacity
                        style={[
                            styles.botonAccion,
                            sinStock && styles.botonAccionDeshabilitado,
                            yaEnCarrito && styles.botonAccionEnCarrito
                        ]}
                        onPress={() => yaEnCarrito ? navigation.navigate('Carrito') : handleAgregarAlCarrito(item)}
                        disabled={sinStock}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={yaEnCarrito ? "checkmark-circle" : "cart"}
                            size={20}
                            color={sinStock ? "#9CA3AF" : "#FFFFFF"}
                        />
                        <Text style={[
                            styles.textoBotonAccion,
                            sinStock && styles.textoBotonAccionDeshabilitado
                        ]}>
                            {sinStock ? 'No disponible' : yaEnCarrito ? 'Ver en carrito' : 'Agregar al carrito'}
                        </Text>
                        {!sinStock && (
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#FFFFFF"
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header minimalista */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <Ionicons name="heart" size={24} color="#EF4444" />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.titulo}>Favoritos</Text>
                            <Text style={styles.subtitulo}>
                                {favoritos.length} {favoritos.length === 1 ? 'producto' : 'productos'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Lista de favoritos */}
            {favoritos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
                    </View>
                    <Text style={styles.textoVacio}>No tienes favoritos</Text>
                    <Text style={styles.textoVacioSubtitulo}>
                        Agrega productos a favoritos para verlos aquí
                    </Text>
                    <TouchableOpacity
                        style={styles.botonExplorar}
                        onPress={() => navigation.navigate('Inicio')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="search-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.textoBotonExplorar}>Explorar productos</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favoritos}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderProducto}
                    contentContainerStyle={styles.lista}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTextContainer: {
        gap: 2,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    subtitulo: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '400',
    },
    lista: {
        padding: 16,
        paddingBottom: 32,
    },
    productoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    imagenSection: {
        width: '100%',
        height: 160,
        position: 'relative',
        backgroundColor: '#FAFAFA',
    },
    imagen: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    badgesContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoriaFloatingTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoriaFloatingTexto: {
        fontSize: 11,
        color: '#3B82F6',
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    heartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sinStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sinStockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 6,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sinStockTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    infoSection: {
        padding: 16,
    },
    nombre: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        lineHeight: 22,
        marginBottom: 12,
    },
    precioStockContainer: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    precioBox: {
        flex: 1,
    },
    precioLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    precio: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    stockBox: {
        flex: 1,
        alignItems: 'flex-end',
    },
    stockLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    stockValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stockValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#10B981',
    },
    stockValueSinStock: {
        color: '#EF4444',
        fontSize: 14,
    },
    botonAccion: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    botonAccionDeshabilitado: {
        backgroundColor: '#E5E7EB',
        shadowColor: 'transparent',
    },
    botonAccionEnCarrito: {
        backgroundColor: '#10B981',
        shadowColor: '#10B981',
    },
    textoBotonAccion: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    textoBotonAccionDeshabilitado: {
        color: '#9CA3AF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    textoVacio: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    textoVacioSubtitulo: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 18,
    },
    botonExplorar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        gap: 6,
    },
    textoBotonExplorar: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});

export default Favoritos;