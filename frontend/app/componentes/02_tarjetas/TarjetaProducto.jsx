import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // Reducido para mejor ajuste

const TarjetaProducto = ({ producto, onPress }) => {
    const stockBajo = producto.stock < 10;
    const sinStock = producto.stock === 0;

    return (
        <TouchableOpacity
            style={[styles.card, sinStock && styles.cardDeshabilitada]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={sinStock}
        >
            {/* Contenedor de imagen mejorado */}
            <View style={styles.imagenContainer}>
                <Image
                    source={{
                        uri: producto.imagen || 'https://via.placeholder.com/300x300/f0f0f0/999999?text=Sin+Imagen'
                    }}
                    style={[styles.imagen, sinStock && styles.imagenDeshabilitada]}
                    resizeMode="cover"
                />

                {/* Badge optimizado */}
                {sinStock && (
                    <View style={[styles.badge, styles.badgeSinStock]}>
                        <Icon name="close-circle" size={12} color="#FFF" style={styles.badgeIcon} />
                        <Text style={styles.badgeTexto}>Agotado</Text>
                    </View>
                )}
                {!sinStock && stockBajo && (
                    <View style={[styles.badge, styles.badgeStockBajo]}>
                        <Icon name="alert-circle" size={12} color="#FFF" style={styles.badgeIcon} />
                        <Text style={styles.badgeTexto}>¡Últimas!</Text>
                    </View>
                )}

                {/* Overlay de gradiente sutil */}
                <View style={styles.gradienteImagen} />
            </View>

            {/* Información del producto con mejor estructura */}
            <View style={styles.info}>
                {/* Categoría con nuevo diseño */}
                <View style={styles.categoriaContainer}>
                    <View style={styles.categoriaDot} />
                    <Text style={styles.categoria} numberOfLines={1}>
                        {producto.categoria}
                    </Text>
                </View>

                {/* Nombre con mejor espaciado */}
                <Text style={styles.nombre} numberOfLines={2}>
                    {producto.nombre}
                </Text>

                {/* Precio destacado */}
                <View style={styles.precioContainer}>
                    <Text style={styles.simboloMoneda}>S/</Text>
                    <Text style={styles.precio}>
                        {parseFloat(producto.precio).toFixed(2)}
                    </Text>
                </View>

                {/* Stock inline mejorado */}
                <View style={styles.stockRow}>
                    <Icon
                        name={sinStock ? "close-circle" : "checkmark-circle"}
                        size={16}
                        color={sinStock ? "#EF4444" : "#10B981"}
                    />
                    <Text style={[
                        styles.stockTexto,
                        sinStock && styles.stockAgotado
                    ]}>
                        {sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}
                    </Text>
                </View>
            </View>

            {/* Indicador visual de acción */}
            <View style={[
                styles.accionIndicador,
                sinStock && styles.accionIndicadorDeshabilitado
            ]}>
                <Icon
                    name={sinStock ? "lock-closed" : "arrow-forward"}
                    size={16}
                    color={sinStock ? "#9CA3AF" : "#3B82F6"}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        margin: 6,
        width: CARD_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
        position: 'relative',
    },
    cardDeshabilitada: {
        opacity: 0.6,
    },
    imagenContainer: {
        width: '100%',
        height: CARD_WIDTH * 0.85, // Reducido de 1.1 a 0.85
        backgroundColor: '#F9FAFB',
        position: 'relative',
        overflow: 'hidden',
    },
    imagen: {
        width: '100%',
        height: '100%',
    },
    imagenDeshabilitada: {
        opacity: 0.5,
    },
    gradienteImagen: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        backgroundColor: 'transparent',
    },
    badge: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    badgeSinStock: {
        backgroundColor: '#EF4444',
    },
    badgeStockBajo: {
        backgroundColor: '#F59E0B',
    },
    badgeIcon: {
        marginRight: 4,
    },
    badgeTexto: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    info: {
        padding: 10, // Reducido de 12 a 10
        gap: 4, // Reducido de 6 a 4
    },
    categoriaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    categoriaDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3B82F6',
        marginRight: 6,
    },
    categoria: {
        fontSize: 8,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        flex: 1,
    },
    nombre: {
        fontSize: 13, // Reducido de 14 a 13
        fontWeight: '600',
        color: '#1A1A1A',
        lineHeight: 17, // Reducido de 19 a 17
        minHeight: 34, // Reducido de 38 a 34
        marginBottom: 3, // Reducido de 4 a 3
    },
    precioContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4, // Reducido de 6 a 4
    },
    simboloMoneda: {
        fontSize: 12, // Reducido de 14 a 12
        fontWeight: '600',
        color: '#6B7280',
        marginRight: 2,
    },
    precio: {
        fontSize: 18, // Reducido de 20 a 18
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 4, // Reducido de 6 a 4
        paddingHorizontal: 8, // Reducido de 10 a 8
        borderRadius: 6, // Reducido de 8 a 6
        alignSelf: 'flex-start',
    },
    stockTexto: {
        fontSize: 10, // Reducido de 11 a 10
        color: '#10B981',
        fontWeight: '600',
        marginLeft: 4, // Reducido de 5 a 4
    },
    stockAgotado: {
        color: '#EF4444',
    },
    accionIndicador: {
        position: 'absolute',
        bottom: 10, // Reducido de 12 a 10
        right: 10, // Reducido de 12 a 10
        width: 28, // Reducido de 32 a 28
        height: 28, // Reducido de 32 a 28
        borderRadius: 14, // Reducido de 16 a 14
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    accionIndicadorDeshabilitado: {
        backgroundColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
});

export default TarjetaProducto;