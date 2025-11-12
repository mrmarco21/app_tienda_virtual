import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    BackHandler 
} from 'react-native';
import { useCarrito } from '../contexto/CarritoContext';

const Carrito = ({ navigation }) => {
    const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, obtenerTotal } = useCarrito();

    // Manejar el botón de retroceso del dispositivo
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('Inicio');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleEliminar = (producto) => {
        Alert.alert(
            '🗑️ Eliminar producto',
            `¿Deseas eliminar "${producto.nombre}" del carrito?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    onPress: () => eliminarDelCarrito(producto.id), 
                    style: 'destructive' 
                }
            ]
        );
    };

    const handleVaciar = () => {
        Alert.alert(
            '🗑️ Vaciar carrito',
            '¿Estás seguro de eliminar todos los productos del carrito?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Vaciar todo', 
                    onPress: vaciarCarrito, 
                    style: 'destructive' 
                }
            ]
        );
    };

    if (carrito.length === 0) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>🛒 Mi Carrito</Text>
                </View>

                <View style={styles.vacio}>
                    <View style={styles.vacioIconContainer}>
                        <Text style={styles.vacioIcon}>🛒</Text>
                    </View>
                    <Text style={styles.textoVacio}>Tu carrito está vacío</Text>
                    <Text style={styles.subtextoVacio}>
                        ¡Agrega productos y empieza a comprar!
                    </Text>
                    <TouchableOpacity
                        style={styles.botonVacio}
                        onPress={() => navigation.navigate('Inicio')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoBotonVacio}>🏠 Explorar productos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image
                source={{ 
                    uri: item.imagen || 'https://via.placeholder.com/80/f0f0f0/999999?text=Sin+Imagen' 
                }}
                style={styles.imagen}
            />
            <View style={styles.info}>
                <Text style={styles.nombre} numberOfLines={2}>{item.nombre}</Text>
                <Text style={styles.precioUnitario}>S/ {parseFloat(item.precio).toFixed(2)} c/u</Text>

                {/* Stock disponible */}
                {item.cantidad >= item.stock && (
                    <Text style={styles.stockMaximo}>⚠️ Cantidad máxima</Text>
                )}

                <View style={styles.cantidadContainer}>
                    <TouchableOpacity
                        style={[styles.botonCantidad, item.cantidad <= 1 && styles.botonCantidadDisabled]}
                        onPress={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.textoCantidad}>−</Text>
                    </TouchableOpacity>

                    <View style={styles.cantidadBadge}>
                        <Text style={styles.cantidad}>{item.cantidad}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.botonCantidad, item.cantidad >= item.stock && styles.botonCantidadDisabled]}
                        onPress={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.textoCantidad}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.derecha}>
                <Text style={styles.subtotal}>
                    S/ {(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                </Text>
                <TouchableOpacity 
                    style={styles.botonEliminar}
                    onPress={() => handleEliminar(item)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.eliminar}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🛒 Mi Carrito</Text>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{carrito.length}</Text>
                </View>
            </View>

            {/* Lista de productos */}
            <FlatList
                data={carrito}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.lista}
                showsVerticalScrollIndicator={false}
            />

            {/* Footer con total y botones */}
            <View style={styles.footer}>
                {/* Resumen */}
                <View style={styles.resumenContainer}>
                    <View style={styles.resumenRow}>
                        <Text style={styles.resumenLabel}>Productos ({carrito.length})</Text>
                        <Text style={styles.resumenValor}>S/ {obtenerTotal().toFixed(2)}</Text>
                    </View>
                    <View style={styles.resumenRow}>
                        <Text style={styles.resumenLabel}>Envío</Text>
                        <Text style={styles.resumenEnvio}>GRATIS 🎉</Text>
                    </View>
                    <View style={styles.dividerFooter} />
                    <View style={styles.resumenRow}>
                        <Text style={styles.totalLabel}>Total a pagar</Text>
                        <Text style={styles.totalValor}>S/ {obtenerTotal().toFixed(2)}</Text>
                    </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.botonesContainer}>
                    <TouchableOpacity 
                        style={styles.botonVaciar} 
                        onPress={handleVaciar}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoVaciar}>🗑️ Vaciar carrito</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botonComprar}
                        onPress={() => navigation.navigate('ConfirmacionCompra')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoComprar}>✅ Proceder con la compra</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    headerBadge: {
        backgroundColor: '#2196F3',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    vacio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    vacioIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    vacioIcon: {
        fontSize: 60,
    },
    textoVacio: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    subtextoVacio: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    botonVacio: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    textoBotonVacio: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    lista: {
        padding: 16,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    imagen: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    info: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
    },
    nombre: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    precioUnitario: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    stockMaximo: {
        fontSize: 11,
        color: '#FF9800',
        fontWeight: '500',
        marginBottom: 6,
    },
    cantidadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    botonCantidad: {
        width: 32,
        height: 32,
        backgroundColor: '#2196F3',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonCantidadDisabled: {
        backgroundColor: '#e0e0e0',
    },
    textoCantidad: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    cantidadBadge: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    cantidad: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    derecha: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginLeft: 8,
    },
    subtotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    botonEliminar: {
        padding: 8,
    },
    eliminar: {
        fontSize: 22,
    },
    footer: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 5,
    },
    resumenContainer: {
        marginBottom: 16,
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resumenLabel: {
        fontSize: 15,
        color: '#666',
    },
    resumenValor: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    resumenEnvio: {
        fontSize: 15,
        color: '#4CAF50',
        fontWeight: '600',
    },
    dividerFooter: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    totalValor: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    botonesContainer: {
        gap: 10,
    },
    botonVaciar: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#f44336',
    },
    textoVaciar: {
        color: '#f44336',
        fontSize: 15,
        fontWeight: '600',
    },
    botonComprar: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    textoComprar: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Carrito;