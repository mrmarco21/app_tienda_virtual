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
    const { agregarAlCarrito } = useCarrito();

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
            '¡Agregado!',
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

        return (
            <TouchableOpacity
                style={styles.productoCard}
                onPress={() => navigation.navigate('DetalleProducto', { producto: item })}
                activeOpacity={0.7}
            >
                <View style={styles.imagenContainer}>
                    <Image
                        source={{
                            uri: item.imagen || 'https://via.placeholder.com/150/f0f0f0/999999?text=Sin+Imagen'
                        }}
                        style={styles.imagen}
                        resizeMode="contain"
                    />
                    {sinStock && (
                        <View style={styles.badgeSinStock}>
                            <Text style={styles.badgeTexto}>Agotado</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoTop}>
                        <View style={styles.categoriaTag}>
                            <Text style={styles.categoriaTexto}>{item.categoria}</Text>
                        </View>
                    </View>

                    <Text style={styles.nombre} numberOfLines={2}>
                        {item.nombre}
                    </Text>

                    <View style={styles.precioRow}>
                        <View style={styles.precioContainer}>
                            <Text style={styles.simboloPrecio}>S/</Text>
                            <Text style={styles.precio}>
                                {parseFloat(item.precio).toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.stockInfo}>
                            <Ionicons
                                name={sinStock ? "close-circle" : "checkmark-circle"}
                                size={14}
                                color={sinStock ? "#EF4444" : "#10B981"}
                            />
                            <Text style={[
                                styles.stockTexto,
                                sinStock && styles.stockTextoSinStock
                            ]}>
                                {sinStock ? 'Sin stock' : `${item.stock} disponibles`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.accionesRow}>
                        <TouchableOpacity
                            style={[
                                styles.botonCarrito,
                                sinStock && styles.botonDeshabilitado
                            ]}
                            onPress={() => handleAgregarAlCarrito(item)}
                            disabled={sinStock}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="cart-outline"
                                size={18}
                                color={sinStock ? "#9CA3AF" : "#FFFFFF"}
                            />
                            <Text style={[
                                styles.textoBotonCarrito,
                                sinStock && styles.textoBotonDeshabilitado
                            ]}>
                                {sinStock ? 'No disponible' : 'Agregar'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botonEliminar}
                            onPress={() => handleEliminar(item)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="heart" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="heart" size={28} color="#EF4444" />
                        </View>
                        <View>
                            <Text style={styles.titulo}>Mis Favoritos</Text>
                            <Text style={styles.subtitulo}>
                                {favoritos.length} {favoritos.length === 1 ? 'producto' : 'productos'}
                            </Text>
                        </View>
                    </View>

                    {/* <TouchableOpacity
                        style={styles.botonCarritoHeader}
                        onPress={() => navigation.navigate('Carrito')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="cart-outline" size={24} color="#1A1A1A" />
                    </TouchableOpacity> */}
                </View>
            </View>

            {/* Lista de favoritos */}
            {favoritos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="heart-outline" size={80} color="#D1D5DB" />
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
                        <Ionicons name="search" size={20} color="#FFFFFF" />
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
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
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
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
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
    botonCarritoHeader: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lista: {
        padding: 16,
    },
    productoCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    imagenContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    imagen: {
        width: '80%',
        height: '80%',
    },
    badgeSinStock: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeTexto: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    infoTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoriaTag: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoriaTexto: {
        fontSize: 10,
        color: '#3B82F6',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    nombre: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginTop: 4,
        lineHeight: 20,
    },
    precioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    precioContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    simboloPrecio: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginRight: 2,
    },
    precio: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    stockInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    stockTexto: {
        fontSize: 11,
        fontWeight: '600',
        color: '#10B981',
    },
    stockTextoSinStock: {
        color: '#EF4444',
    },
    accionesRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    botonCarrito: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    botonDeshabilitado: {
        backgroundColor: '#E5E7EB',
    },
    textoBotonCarrito: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    textoBotonDeshabilitado: {
        color: '#9CA3AF',
    },
    botonEliminar: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    textoVacio: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    textoVacioSubtitulo: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 24,
    },
    botonExplorar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    textoBotonExplorar: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default Favoritos;
