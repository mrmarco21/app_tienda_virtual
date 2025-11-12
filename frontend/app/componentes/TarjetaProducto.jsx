import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2; // 2 columnas con padding

const TarjetaProducto = ({ producto, onPress }) => {
    const stockBajo = producto.stock < 10;
    const sinStock = producto.stock === 0;

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.7}
            disabled={sinStock}
        >
            {/* Contenedor de imagen */}
            <View style={styles.imagenContainer}>
                <Image
                    source={{ 
                        uri: producto.imagen || 'https://via.placeholder.com/300x300/f0f0f0/999999?text=Sin+Imagen' 
                    }}
                    style={styles.imagen}
                    resizeMode="cover"
                />
                
                {/* Badge de stock */}
                {sinStock && (
                    <View style={[styles.badge, styles.badgeSinStock]}>
                        <Text style={styles.badgeTexto}>Agotado</Text>
                    </View>
                )}
                {!sinStock && stockBajo && (
                    <View style={[styles.badge, styles.badgeStockBajo]}>
                        <Text style={styles.badgeTexto}>¡Últimas unidades!</Text>
                    </View>
                )}
            </View>

            {/* Información del producto */}
            <View style={styles.info}>
                {/* Categoría */}
                <View style={styles.categoriaContainer}>
                    <Text style={styles.categoria} numberOfLines={1}>
                        {producto.categoria}
                    </Text>
                </View>

                {/* Nombre */}
                <Text style={styles.nombre} numberOfLines={2}>
                    {producto.nombre}
                </Text>

                {/* Footer con precio y stock */}
                <View style={styles.footer}>
                    <View style={styles.precioContainer}>
                        <Text style={styles.simboloMoneda}>S/</Text>
                        <Text style={styles.precio}>
                            {parseFloat(producto.precio).toFixed(2)}
                        </Text>
                    </View>
                    
                    <View style={styles.stockContainer}>
                        <Icon 
                            name={sinStock ? "close-circle" : "checkmark-circle"} 
                            size={14} 
                            color={sinStock ? "#E74C3C" : "#27AE60"} 
                        />
                        <Text style={[
                            styles.stock,
                            sinStock && styles.stockAgotado
                        ]}>
                            {sinStock ? '0' : producto.stock}
                        </Text>
                    </View>
                </View>

                {/* Botón de acción */}
                <TouchableOpacity 
                    style={[
                        styles.botonComprar,
                        sinStock && styles.botonDeshabilitado
                    ]}
                    onPress={onPress}
                    disabled={sinStock}
                >
                    <Icon 
                        name={sinStock ? "sad-outline" : "cart-outline"} 
                        size={16} 
                        color="#FFF" 
                        style={styles.iconoBoton}
                    />
                    <Text style={styles.textoBoton}>
                        {sinStock ? 'No disponible' : 'Ver detalles'}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        margin: 8,
        width: CARD_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    imagenContainer: {
        width: '100%',
        height: CARD_WIDTH * 0.9,
        backgroundColor: '#F8F9FA',
        position: 'relative',
    },
    imagen: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    badgeSinStock: {
        backgroundColor: '#E74C3C',
    },
    badgeStockBajo: {
        backgroundColor: '#F39C12',
    },
    badgeTexto: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    info: {
        padding: 12,
    },
    categoriaContainer: {
        marginBottom: 4,
    },
    categoria: {
        fontSize: 11,
        color: '#FF6B6B',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    nombre: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
        lineHeight: 18,
        minHeight: 36,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    precioContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    simboloMoneda: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginRight: 2,
    },
    precio: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    stock: {
        fontSize: 12,
        color: '#27AE60',
        fontWeight: '600',
        marginLeft: 4,
    },
    stockAgotado: {
        color: '#E74C3C',
    },
    botonComprar: {
        flexDirection: 'row',
        backgroundColor: '#FF6B6B',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    botonDeshabilitado: {
        backgroundColor: '#BDC3C7',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    iconoBoton: {
        marginRight: 6,
    },
    textoBoton: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default TarjetaProducto;