import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
    BackHandler,
    Platform,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../../contexto/CarritoContext';
import { useFavoritos } from '../../contexto/FavoritosContext';

const { width } = Dimensions.get('window');

const DetalleProducto = ({ route, navigation }) => {
    const { producto } = route.params;
    const { agregarAlCarrito, carrito } = useCarrito();
    const { agregarAFavoritos, eliminarDeFavoritos, esFavorito } = useFavoritos();

    const stockBajo = producto.stock > 0 && producto.stock < 10;
    const sinStock = producto.stock <= 0;
    const estaEnFavoritos = esFavorito(producto.id);

    const productoEnCarrito = carrito.find(item => item.id === producto.id);
    const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
    const stockDisponible = producto.stock - cantidadEnCarrito;

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.goBack();
                return true;
            }
        );
        return () => backHandler.remove();
    }, [navigation]);

    const handleToggleFavorito = () => {
        if (estaEnFavoritos) {
            eliminarDeFavoritos(producto.id);
            Alert.alert(
                'Eliminado de favoritos',
                `${producto.nombre} se eliminó de tus favoritos`,
                [{ text: 'Entendido', style: 'cancel' }]
            );
        } else {
            const agregado = agregarAFavoritos(producto);
            if (agregado) {
                Alert.alert(
                    '¡Agregado a favoritos!',
                    `${producto.nombre} se agregó a tus favoritos`,
                    [
                        { text: 'Entendido', style: 'cancel' },
                        {
                            text: 'Ver favoritos',
                            onPress: () => navigation.navigate('Favoritos'),
                            style: 'default'
                        }
                    ]
                );
            }
        }
    };

    const handleAgregarCarrito = () => {
        if (sinStock) {
            Alert.alert(
                'Sin stock',
                'Este producto no está disponible actualmente',
                [{ text: 'Entendido', style: 'cancel' }]
            );
            return;
        }

        if (cantidadEnCarrito >= producto.stock) {
            Alert.alert(
                'Límite alcanzado',
                `Ya tienes ${cantidadEnCarrito} ${cantidadEnCarrito === 1 ? 'unidad' : 'unidades'} de este producto en tu carrito. No hay más stock disponible.`,
                [
                    { text: 'Entendido', style: 'cancel' },
                    {
                        text: 'Ver carrito',
                        onPress: () => navigation.navigate('Carrito'),
                        style: 'default'
                    }
                ]
            );
            return;
        }

        if (cantidadEnCarrito > 0 && stockDisponible <= 2) {
            Alert.alert(
                'Agregar al carrito',
                `Ya tienes ${cantidadEnCarrito} ${cantidadEnCarrito === 1 ? 'unidad' : 'unidades'} en tu carrito. Solo ${stockDisponible === 1 ? 'queda' : 'quedan'} ${stockDisponible} más ${stockDisponible === 1 ? 'disponible' : 'disponibles'}. ¿Deseas agregar otra unidad?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Sí, agregar',
                        onPress: () => {
                            agregarAlCarrito(producto);
                            Alert.alert(
                                '¡Agregado!',
                                `Ahora tienes ${cantidadEnCarrito + 1} ${cantidadEnCarrito + 1 === 1 ? 'unidad' : 'unidades'} de ${producto.nombre}`,
                                [
                                    { text: 'Seguir comprando', style: 'cancel', onPress: () => navigation.goBack() },
                                    {
                                        text: 'Ver carrito',
                                        onPress: () => navigation.navigate('Carrito'),
                                        style: 'default'
                                    }
                                ]
                            );
                        }
                    }
                ]
            );
            return;
        }

        agregarAlCarrito(producto);
        const nuevaCantidad = cantidadEnCarrito + 1;
        const mensajeAdicional = cantidadEnCarrito > 0
            ? `\n\nAhora tienes ${nuevaCantidad} ${nuevaCantidad === 1 ? 'unidad' : 'unidades'} en tu carrito.`
            : '';

        Alert.alert(
            '¡Agregado al carrito!',
            `${producto.nombre} se agregó exitosamente${mensajeAdicional}`,
            [
                { text: 'Seguir comprando', style: 'cancel', onPress: () => navigation.goBack() },
                {
                    text: 'Ver carrito',
                    onPress: () => navigation.navigate('Carrito'),
                    style: 'default'
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Hero Image Section - Optimizado */}
                <View style={styles.imagenContainer}>
                    <View style={styles.imagenWrapper}>
                        <Image
                            source={{
                                uri: producto.imagen || 'https://via.placeholder.com/400x400/f0f0f0/999999?text=Sin+Imagen'
                            }}
                            style={styles.imagen}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Header flotante con gradiente */}
                    <View style={styles.headerGradiente} />

                    {/* Botones de navegación */}
                    <View style={[
                        styles.headerButtons,
                        { top: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
                    ]}>
                        <TouchableOpacity
                            style={styles.botonVolver}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.botonVolver,
                                estaEnFavoritos && styles.botonFavoritoActivo
                            ]}
                            onPress={handleToggleFavorito}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={estaEnFavoritos ? "heart" : "heart-outline"}
                                size={24}
                                color={estaEnFavoritos ? "#EF4444" : "#1A1A1A"}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Badge de disponibilidad */}
                    {sinStock && (
                        <View style={[styles.badgeDisponibilidad, styles.badgeSinStock]}>
                            <Ionicons name="close-circle" size={16} color="#FFF" />
                            <Text style={styles.badgeTexto}>Agotado</Text>
                        </View>
                    )}
                    {stockBajo && !sinStock && (
                        <View style={[styles.badgeDisponibilidad, styles.badgeStockBajo]}>
                            <Ionicons name="alert-circle" size={16} color="#FFF" />
                            <Text style={styles.badgeTexto}>¡Solo {producto.stock} disponibles!</Text>
                        </View>
                    )}
                </View>

                {/* Contenido principal */}
                <View style={styles.contenido}>
                    {/* Header del producto */}
                    <View style={styles.productoHeader}>
                        {/* Categoría */}
                        <View style={styles.categoriaTag}>
                            <View style={styles.categoriaDot} />
                            <Text style={styles.categoriaTexto}>{producto.categoria}</Text>
                        </View>

                        {/* Nombre */}
                        <Text style={styles.nombre}>{producto.nombre}</Text>

                        {/* Precio y disponibilidad */}
                        <View style={styles.precioRow}>
                            <View style={styles.precioContainer}>
                                <Text style={styles.simboloPrecio}>S/</Text>
                                <Text style={styles.precio}>
                                    {parseFloat(producto.precio).toFixed(2)}
                                </Text>
                            </View>

                            <View style={[
                                styles.stockChip,
                                sinStock && styles.stockChipSinStock,
                                stockBajo && styles.stockChipBajo
                            ]}>
                                <Ionicons
                                    name={sinStock ? "close-circle" : "checkmark-circle"}
                                    size={16}
                                    color={sinStock ? "#EF4444" : stockBajo ? "#F59E0B" : "#10B981"}
                                />
                                <Text style={[
                                    styles.stockTexto,
                                    sinStock && styles.stockTextoSinStock,
                                    stockBajo && styles.stockTextoBajo
                                ]}>
                                    {sinStock ? 'Sin stock' : `${producto.stock} disponibles`}
                                </Text>
                            </View>
                        </View>

                        {/* ALERTA SI YA TIENE PRODUCTOS EN CARRITO */}
                        {cantidadEnCarrito > 0 && (
                            <View style={styles.alertaCarrito}>
                                <Ionicons name="cart" size={16} color="#3B82F6" />
                                <Text style={styles.alertaCarritoTexto}>
                                    Ya tienes {cantidadEnCarrito} {cantidadEnCarrito === 1 ? 'unidad' : 'unidades'} en tu carrito
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Carrito')}
                                    style={styles.verCarritoLink}
                                >
                                    <Text style={styles.verCarritoTexto}>Ver carrito</Text>
                                    <Ionicons name="chevron-forward" size={14} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Divider sutil */}
                    <View style={styles.divider} />

                    {/* Sección de descripción */}
                    <View style={styles.seccion}>
                        <View style={styles.seccionHeader}>
                            <Ionicons name="document-text-outline" size={20} color="#1A1A1A" />
                            <Text style={styles.seccionTitulo}>Descripción</Text>
                        </View>
                        <Text style={styles.descripcion}>
                            {producto.descripcion || 'Este producto no tiene descripción disponible. Contáctanos para más información sobre sus características y especificaciones.'}
                        </Text>
                    </View>

                    {/* Información adicional con cards */}
                    <View style={styles.seccion}>
                        <View style={styles.seccionHeader}>
                            <Ionicons name="information-circle-outline" size={20} color="#1A1A1A" />
                            <Text style={styles.seccionTitulo}>Información adicional</Text>
                        </View>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoCard}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="pricetag-outline" size={20} color="#3B82F6" />
                                </View>
                                <Text style={styles.infoLabel}>Categoría</Text>
                                <Text style={styles.infoValor}>{producto.categoria}</Text>
                            </View>

                            <View style={styles.infoCard}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="cube-outline" size={20} color="#3B82F6" />
                                </View>
                                <Text style={styles.infoLabel}>Disponibilidad</Text>
                                <Text style={styles.infoValor}>
                                    {sinStock ? 'Sin stock' : 'En stock'}
                                </Text>
                            </View>

                            <View style={styles.infoCard}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="rocket-outline" size={20} color="#3B82F6" />
                                </View>
                                <Text style={styles.infoLabel}>Envío</Text>
                                <Text style={styles.infoValor}>3-5 días</Text>
                            </View>

                            <View style={styles.infoCard}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#3B82F6" />
                                </View>
                                <Text style={styles.infoLabel}>Garantía</Text>
                                <Text style={styles.infoValor}>12 meses</Text>
                            </View>
                        </View>
                    </View>

                    {/* Alerta de stock bajo */}
                    {stockBajo && !sinStock && (
                        <View style={styles.alertaStockBajo}>
                            <View style={styles.alertaIconContainer}>
                                <Ionicons name="time-outline" size={20} color="#F59E0B" />
                            </View>
                            <View style={styles.alertaContent}>
                                <Text style={styles.alertaTitulo}>¡Últimas unidades!</Text>
                                <Text style={styles.alertaTexto}>
                                    Solo quedan {producto.stock} unidades disponibles. ¡No te lo pierdas!
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Espacio para el botón fijo */}
                    <View style={{ height: 20 }} />
                </View>
            </ScrollView>

            {/* Botón de acción fijo */}
            <View style={styles.bottomContainer}>
                <View style={styles.bottomContent}>
                    <TouchableOpacity
                        style={[
                            styles.botonAgregar,
                            (sinStock || cantidadEnCarrito >= producto.stock) && styles.botonDeshabilitado
                        ]}
                        onPress={handleAgregarCarrito}
                        disabled={sinStock || cantidadEnCarrito >= producto.stock}
                        activeOpacity={0.8}
                    >
                        <View style={styles.botonContent}>
                            <Ionicons
                                name={sinStock || cantidadEnCarrito >= producto.stock ? "lock-closed" : "cart-outline"}
                                size={20}
                                color="#FFF"
                            />
                            <Text style={styles.textoBoton}>
                                {sinStock
                                    ? 'No disponible'
                                    : cantidadEnCarrito >= producto.stock
                                        ? 'Stock máximo alcanzado'
                                        : 'Agregar al carrito'}
                            </Text>
                        </View>
                        {!(sinStock || cantidadEnCarrito >= producto.stock) && (
                            <Text style={styles.precioBoton}>
                                S/ {parseFloat(producto.precio).toFixed(2)}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 40
    },
    imagenContainer: {
        width: '100%',
        height: width * 0.8,
        backgroundColor: '#FFFFFF',
        position: 'relative',
    },
    imagenWrapper: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    imagen: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    headerGradiente: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(22, 22, 22, 0)',
    },
    headerButtons: {
        position: 'absolute',
        left: 0,
        right: 0,
        marginTop: -30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    botonVolver: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    botonFavoritoActivo: {
        backgroundColor: '#FEF2F2',
    },
    badgeDisponibilidad: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    badgeSinStock: {
        backgroundColor: '#EF4444',
    },
    badgeStockBajo: {
        backgroundColor: '#F59E0B',
    },
    badgeTexto: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    contenido: {
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingBottom: 100,
    },
    productoHeader: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    categoriaTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
        gap: 6,
    },
    categoriaDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3B82F6',
    },
    categoriaTexto: {
        fontSize: 11,
        color: '#3B82F6',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    nombre: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
        lineHeight: 32,
    },
    precioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    precioContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    simboloPrecio: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        marginRight: 4,
    },
    precio: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -1,
    },
    stockChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    stockChipSinStock: {
        backgroundColor: '#FEF2F2',
    },
    stockChipBajo: {
        backgroundColor: '#FEF3C7',
    },
    stockTexto: {
        fontSize: 13,
        fontWeight: '600',
        color: '#10B981',
    },
    stockTextoSinStock: {
        color: '#EF4444',
    },
    stockTextoBajo: {
        color: '#F59E0B',
    },
    alertaCarrito: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        gap: 8,
    },
    alertaCarritoTexto: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        fontWeight: '600',
    },
    verCarritoLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    verCarritoTexto: {
        fontSize: 13,
        color: '#3B82F6',
        fontWeight: '700',
    },
    divider: {
        height: 8,
        backgroundColor: '#F9FAFB',
    },
    seccion: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 8,
    },
    seccionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    seccionTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    descripcion: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 24,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 4,
    },
    infoCard: {
        width: (width - 64) / 2,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    alertaStockBajo: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    alertaIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    alertaContent: {
        flex: 1,
    },
    alertaTitulo: {
        fontSize: 14,
        fontWeight: '700',
        color: '#92400E',
        marginBottom: 4,
    },
    alertaTexto: {
        fontSize: 13,
        color: '#B45309',
        lineHeight: 18,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    bottomContent: {
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 16 : 12,
    },
    botonAgregar: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    botonDeshabilitado: {
        backgroundColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    botonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textoBoton: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    precioBoton: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default DetalleProducto;
