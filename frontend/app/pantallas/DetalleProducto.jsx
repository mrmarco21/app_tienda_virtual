import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    Dimensions,
    BackHandler 
} from 'react-native';
import { useCarrito } from '../contexto/CarritoContext';

const { width } = Dimensions.get('window');

const DetalleProducto = ({ route, navigation }) => {
    const { producto } = route.params;
    const { agregarAlCarrito } = useCarrito();

    const stockBajo = producto.stock > 0 && producto.stock < 10;
    const sinStock = producto.stock <= 0;

    // Manejar el botón de retroceso del dispositivo
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.goBack();
                return true; // Prevenir el comportamiento por defecto
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleAgregarCarrito = () => {
        if (sinStock) {
            Alert.alert(
                '❌ Sin stock', 
                'Este producto no está disponible actualmente',
                [{ text: 'Entendido', style: 'cancel' }]
            );
            return;
        }

        agregarAlCarrito(producto);
        Alert.alert(
            '✅ ¡Agregado al carrito!',
            `${producto.nombre} se agregó exitosamente`,
            [
                { text: 'Seguir comprando', style: 'cancel', onPress: () => navigation.goBack() },
                { 
                    text: 'Ver carrito 🛒', 
                    onPress: () => navigation.navigate('Carrito'),
                    style: 'default'
                }
            ]
        );
    };

    const handleVolverAtras = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Imagen del producto */}
                <View style={styles.imagenContainer}>
                    <Image
                        source={{ 
                            uri: producto.imagen || 'https://via.placeholder.com/400x400/f0f0f0/999999?text=Sin+Imagen' 
                        }}
                        style={styles.imagen}
                        resizeMode="cover"
                    />
                    
                    {/* Botón flotante para volver */}
                    <TouchableOpacity 
                        style={styles.botonVolver} 
                        onPress={handleVolverAtras}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.iconoVolver}>←</Text>
                    </TouchableOpacity>

                    {/* Badge de stock en la imagen */}
                    {sinStock && (
                        <View style={[styles.badgeImagen, styles.badgeSinStock]}>
                            <Text style={styles.badgeTexto}>❌ AGOTADO</Text>
                        </View>
                    )}
                    {stockBajo && !sinStock && (
                        <View style={[styles.badgeImagen, styles.badgeStockBajo]}>
                            <Text style={styles.badgeTexto}>⚠️ ¡POCAS UNIDADES!</Text>
                        </View>
                    )}
                </View>

                {/* Contenido */}
                <View style={styles.contenido}>
                    {/* Categoría */}
                    <View style={styles.categoriaTag}>
                        <Text style={styles.categoria}>{producto.categoria}</Text>
                    </View>

                    {/* Nombre del producto */}
                    <Text style={styles.nombre}>{producto.nombre}</Text>

                    {/* Precio y Stock */}
                    <View style={styles.precioStockContainer}>
                        <View style={styles.precioContainer}>
                            <Text style={styles.simboloPrecio}>S/</Text>
                            <Text style={styles.precio}>
                                {parseFloat(producto.precio).toFixed(2)}
                            </Text>
                        </View>

                        <View style={[
                            styles.stockBadge,
                            sinStock && styles.stockBadgeSinStock,
                            stockBajo && styles.stockBadgeBajo
                        ]}>
                            <Text style={styles.stockIcon}>
                                {sinStock ? '🔴' : stockBajo ? '🟡' : '🟢'}
                            </Text>
                            <Text style={[
                                styles.stockTexto,
                                sinStock && styles.stockTextoSinStock
                            ]}>
                                {sinStock ? 'Agotado' : `Stock: ${producto.stock}`}
                            </Text>
                        </View>
                    </View>

                    {/* Divider decorativo */}
                    <View style={styles.divider} />

                    {/* Sección de descripción */}
                    <View style={styles.seccionDescripcion}>
                        <View style={styles.subtituloContainer}>
                            <Text style={styles.iconoDescripcion}>📝</Text>
                            <Text style={styles.subtitulo}>Descripción del Producto</Text>
                        </View>
                        <Text style={styles.descripcion}>
                            {producto.descripcion || 'Este producto no tiene descripción disponible en este momento. Contáctanos para más información sobre sus características y especificaciones.'}
                        </Text>
                    </View>

                    {/* Info adicional */}
                    <View style={styles.infoAdicional}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcono}>🏷️</Text>
                            <View>
                                <Text style={styles.infoLabel}>Categoría</Text>
                                <Text style={styles.infoValor}>{producto.categoria}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcono}>📦</Text>
                            <View>
                                <Text style={styles.infoLabel}>Disponibilidad</Text>
                                <Text style={styles.infoValor}>
                                    {sinStock ? 'Sin stock' : 'Disponible'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcono}>🚚</Text>
                            <View>
                                <Text style={styles.infoLabel}>Entrega</Text>
                                <Text style={styles.infoValor}>3-5 días hábiles</Text>
                            </View>
                        </View>
                    </View>

                    {/* Mensaje de advertencia si hay poco stock */}
                    {stockBajo && !sinStock && (
                        <View style={styles.advertenciaContainer}>
                            <Text style={styles.advertenciaIcono}>⏰</Text>
                            <Text style={styles.advertenciaTexto}>
                                ¡Apúrate! Solo quedan {producto.stock} unidades disponibles
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Botón fijo inferior */}
            <View style={styles.botonContainer}>
                <TouchableOpacity
                    style={[styles.botonAgregar, sinStock && styles.botonDeshabilitado]}
                    onPress={handleAgregarCarrito}
                    disabled={sinStock}
                    activeOpacity={0.8}
                >
                    <Text style={styles.textoBoton}>
                        {sinStock ? '😢 Producto no disponible' : '🛒 Agregar al carrito'}
                    </Text>
                    {!sinStock && (
                        <View style={styles.precioBoton}>
                            <Text style={styles.textoPrecioBoton}>
                                S/ {parseFloat(producto.precio).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    imagenContainer: {
        width: '100%',
        height: width * 1.1,
        backgroundColor: '#FFF',
        position: 'relative',
    },
    imagen: {
        width: '100%',
        height: '100%',
    },
    botonVolver: {
        position: 'absolute',
        top: 40,
        left: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    iconoVolver: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    badgeImagen: {
        position: 'absolute',
        top: 40,
        right: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    badgeSinStock: {
        backgroundColor: '#E74C3C',
    },
    badgeStockBajo: {
        backgroundColor: '#F39C12',
    },
    badgeTexto: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    contenido: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        padding: 20,
        paddingBottom: 100,
    },
    categoriaTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        marginBottom: 12,
    },
    categoria: {
        fontSize: 12,
        color: '#FF6B6B',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    nombre: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 20,
        lineHeight: 32,
    },
    precioStockContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    precioContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    simboloPrecio: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        marginRight: 4,
    },
    precio: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#27AE60',
    },
    stockBadgeSinStock: {
        backgroundColor: '#FFEBEE',
        borderColor: '#E74C3C',
    },
    stockBadgeBajo: {
        backgroundColor: '#FFF3E0',
        borderColor: '#F39C12',
    },
    stockIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    stockTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#27AE60',
    },
    stockTextoSinStock: {
        color: '#E74C3C',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 24,
    },
    seccionDescripcion: {
        marginBottom: 24,
    },
    subtituloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconoDescripcion: {
        fontSize: 20,
        marginRight: 8,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    descripcion: {
        fontSize: 15,
        color: '#5A6C7D',
        lineHeight: 24,
    },
    infoAdicional: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoIcono: {
        fontSize: 24,
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        marginBottom: 2,
    },
    infoValor: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
    },
    advertenciaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3CD',
        borderLeftWidth: 4,
        borderLeftColor: '#F39C12',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    advertenciaIcono: {
        fontSize: 20,
        marginRight: 10,
    },
    advertenciaTexto: {
        flex: 1,
        fontSize: 14,
        color: '#856404',
        fontWeight: '600',
    },
    botonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    botonAgregar: {
        backgroundColor: '#FF6B6B',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    botonDeshabilitado: {
        backgroundColor: '#BDC3C7',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    textoBoton: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    precioBoton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    textoPrecioBoton: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DetalleProducto;