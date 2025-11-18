import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    BackHandler,
    Platform,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../contexto/CarritoContext';

const Carrito = ({ navigation }) => {
    const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, obtenerTotal } = useCarrito();

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
            'Eliminar producto',
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
            'Vaciar carrito',
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
                <View style={[
                    styles.header,
                    { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
                ]}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.navigate('Inicio')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mi Carrito</Text>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>0</Text>
                    </View>
                </View>

                {/* Estado vacío mejorado */}
                <View style={styles.vacio}>
                    <View style={styles.vacioIconContainer}>
                        <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
                    </View>
                    <Text style={styles.textoVacio}>Tu carrito está vacío</Text>
                    <Text style={styles.subtextoVacio}>
                        ¡Descubre productos increíbles y empieza a comprar!
                    </Text>
                    <TouchableOpacity
                        style={styles.botonVacio}
                        onPress={() => navigation.navigate('Inicio')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="storefront-outline" size={20} color="#FFF" />
                        <Text style={styles.textoBotonVacio}>Explorar productos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image
                source={{ 
                    uri: item.imagen || 'https://via.placeholder.com/100/f0f0f0/999999?text=Sin+Imagen' 
                }}
                style={styles.imagen}
            />
            
            <View style={styles.info}>
                <Text style={styles.nombre} numberOfLines={2}>{item.nombre}</Text>
                <Text style={styles.precioUnitario}>S/ {parseFloat(item.precio).toFixed(2)} c/u</Text>

                {/* Indicador de stock máximo */}
                {item.cantidad >= item.stock && (
                    <View style={styles.stockAlert}>
                        <Ionicons name="alert-circle" size={14} color="#F59E0B" />
                        <Text style={styles.stockMaximo}>Cantidad máxima</Text>
                    </View>
                )}

                {/* Controles de cantidad */}
                <View style={styles.cantidadContainer}>
                    <TouchableOpacity
                        style={[styles.botonCantidad, item.cantidad <= 1 && styles.botonCantidadDisabled]}
                        onPress={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name="remove" 
                            size={18} 
                            color={item.cantidad <= 1 ? "#9CA3AF" : "#FFF"} 
                        />
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
                        <Ionicons 
                            name="add" 
                            size={18} 
                            color={item.cantidad >= item.stock ? "#9CA3AF" : "#FFF"} 
                        />
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
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header mejorado */}
            <View style={[
                styles.header,
                { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 48 }
            ]}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Inicio')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Carrito</Text>
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
                ListHeaderComponent={
                    <View style={styles.listaHeader}>
                        <Text style={styles.listaHeaderTexto}>
                            {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}
                        </Text>
                        <TouchableOpacity 
                            onPress={handleVaciar}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.vaciarLink}>Vaciar todo</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Footer con resumen y acciones */}
            <View style={styles.footer}>
                {/* Resumen de costos */}
                <View style={styles.resumenContainer}>
                    <View style={styles.resumenRow}>
                        <Text style={styles.resumenLabel}>Subtotal</Text>
                        <Text style={styles.resumenValor}>S/ {obtenerTotal().toFixed(2)}</Text>
                    </View>
                    <View style={styles.resumenRow}>
                        <View style={styles.envioContainer}>
                            <Ionicons name="rocket-outline" size={16} color="#10B981" />
                            <Text style={styles.resumenLabel}>Envío</Text>
                        </View>
                        <Text style={styles.resumenEnvio}>GRATIS</Text>
                    </View>
                    
                    <View style={styles.dividerFooter} />
                    
                    <View style={styles.resumenRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalMoneda}>S/</Text>
                            <Text style={styles.totalValor}>{obtenerTotal().toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Botón de compra */}
                <TouchableOpacity
                    style={styles.botonComprar}
                    onPress={() => navigation.navigate('ConfirmacionCompra')}
                    activeOpacity={0.8}
                >
                    <View style={styles.botonComprarContent}>
                        <Ionicons name="lock-closed" size={20} color="#FFF" />
                        <Text style={styles.textoComprar}>Proceder al pago</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerBadge: {
        backgroundColor: '#3B82F6',
        minWidth: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    headerBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    vacio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    vacioIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    textoVacio: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtextoVacio: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    botonVacio: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    textoBotonVacio: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    listaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    listaHeaderTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    vaciarLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
    },
    lista: {
        padding: 16,
        paddingBottom: 8,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    imagen: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    nombre: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
        lineHeight: 20,
    },
    precioUnitario: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    stockAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
        gap: 4,
    },
    stockMaximo: {
        fontSize: 11,
        color: '#92400E',
        fontWeight: '600',
    },
    cantidadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    botonCantidad: {
        width: 32,
        height: 32,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonCantidadDisabled: {
        backgroundColor: '#E5E7EB',
    },
    cantidadBadge: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cantidad: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    derecha: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginLeft: 12,
    },
    subtotal: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    botonEliminar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    resumenContainer: {
        marginBottom: 16,
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    resumenLabel: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    resumenValor: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    envioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    resumenEnvio: {
        fontSize: 15,
        color: '#10B981',
        fontWeight: '700',
    },
    dividerFooter: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    totalMoneda: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginRight: 4,
    },
    totalValor: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    botonComprar: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    botonComprarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textoComprar: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default Carrito;
