import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalProductosPedido = ({ visible, pedido, onClose }) => {
    if (!pedido) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.handleBar} />
                        <View style={styles.headerInfo}>
                            <View style={styles.headerTitleRow}>
                                <View style={styles.pedidoIconContainer}>
                                    <Ionicons name="cube" size={20} color="#3B82F6" />
                                </View>
                                <View style={styles.headerTexts}>
                                    <Text style={styles.titulo}>Productos del Pedido #{pedido.id}</Text>
                                    <Text style={styles.subtitulo}>
                                        {pedido.productos?.length || 0} {pedido.productos?.length === 1 ? 'producto' : 'productos'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.botonCerrar}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Lista de productos */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {pedido.productos && Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
                            <View style={styles.productosLista}>
                                {pedido.productos.map((producto, index) => (
                                    <View key={index} style={styles.productoItem}>
                                        {/* Imagen del producto */}
                                        <View style={styles.productoImageContainer}>
                                            <Image
                                                source={{
                                                    uri: producto.imagen || 'https://via.placeholder.com/80/f0f0f0/999999?text=Producto'
                                                }}
                                                style={styles.productoImagen}
                                                resizeMode="cover"
                                            />
                                            {/* Badge de cantidad */}
                                            <View style={styles.cantidadBadge}>
                                                <Text style={styles.cantidadBadgeTexto}>x{producto.cantidad}</Text>
                                            </View>
                                        </View>

                                        {/* Info del producto */}
                                        <View style={styles.productoInfo}>
                                            <Text style={styles.productoNombre} numberOfLines={2}>
                                                {producto.nombre}
                                            </Text>

                                            {producto.categoria && (
                                                <View style={styles.productoCategoriaTag}>
                                                    <Ionicons name="pricetag-outline" size={10} color="#6B7280" />
                                                    <Text style={styles.productoCategoriaTexto}>
                                                        {producto.categoria}
                                                    </Text>
                                                </View>
                                            )}

                                            {/* Precio unitario y subtotal */}
                                            <View style={styles.productoPreciosContainer}>
                                                <View style={styles.precioUnitario}>
                                                    <Text style={styles.precioUnitarioLabel}>Precio unit.</Text>
                                                    <Text style={styles.precioUnitarioValor}>
                                                        S/ {parseFloat(producto.precio).toFixed(2)}
                                                    </Text>
                                                </View>
                                                <View style={styles.subtotalProducto}>
                                                    <Text style={styles.subtotalProductoLabel}>Subtotal</Text>
                                                    <Text style={styles.subtotalProductoValor}>
                                                        S/ {(parseFloat(producto.precio) * producto.cantidad).toFixed(2)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ))}

                                {/* Total */}
                                <View style={styles.totalContainer}>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>Total del pedido</Text>
                                        <Text style={styles.totalValor}>
                                            S/ {parseFloat(pedido.total).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.sinProductosContainer}>
                                <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
                                <Text style={styles.sinProductosTexto}>
                                    No hay productos en este pedido
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.botonCerrarModal}
                            onPress={onClose}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.textoCerrarModal}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
    },
    header: {
        paddingTop: 8,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FAFBFC',
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    pedidoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTexts: {
        flex: 1,
    },
    titulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    subtitulo: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    botonCerrar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 16,
    },
    productosLista: {
        gap: 12,
    },
    productoItem: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    productoImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        position: 'relative',
    },
    productoImagen: {
        width: '100%',
        height: '100%',
    },
    cantidadBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    cantidadBadgeTexto: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    productoInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productoNombre: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        lineHeight: 18,
        marginBottom: 4,
    },
    productoCategoriaTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
        marginBottom: 6,
    },
    productoCategoriaTexto: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    productoPreciosContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    precioUnitario: {
        flex: 1,
    },
    precioUnitarioLabel: {
        fontSize: 9,
        color: '#9CA3AF',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    precioUnitarioValor: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    subtotalProducto: {
        flex: 1,
        alignItems: 'flex-end',
    },
    subtotalProductoLabel: {
        fontSize: 9,
        color: '#9CA3AF',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    subtotalProductoValor: {
        fontSize: 15,
        color: '#3B82F6',
        fontWeight: '700',
    },
    totalContainer: {
        marginTop: 8,
        backgroundColor: '#ECFDF5',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#166534',
    },
    totalValor: {
        fontSize: 24,
        fontWeight: '700',
        color: '#10B981',
    },
    sinProductosContainer: {
        alignItems: 'center',
        paddingVertical: 48,
        gap: 12,
    },
    sinProductosTexto: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    footer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    botonCerrarModal: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    textoCerrarModal: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default ModalProductosPedido;
