import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalDetallePedido = ({
    visible,
    pedido,
    onClose,
    getEstadoColor,
    getEstadoIcono
}) => {
    if (!pedido) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalDetalleOverlay}>
                <View style={styles.modalDetalleContent}>
                    {/* Header del modal */}
                    <View style={styles.modalDetalleHeader}>
                        <View style={styles.modalHeaderTop}>
                            <View style={styles.handleBar} />
                        </View>
                        <View style={styles.modalHeaderInfo}>
                            <View style={styles.headerTitleRow}>
                                <View style={styles.pedidoIconContainer}>
                                    <Ionicons name="receipt" size={20} color="#3B82F6" />
                                </View>
                                <View style={styles.headerTexts}>
                                    <Text style={styles.modalDetalleTitulo}>Pedido #{pedido.id}</Text>
                                    <Text style={styles.modalDetalleSubtitulo}>
                                        {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                </View>
                            </View>
                            {/* <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={22} color="#6B7280" />
                            </TouchableOpacity> */}
                        </View>

                        {/* Estado del pedido */}
                        <View style={[
                            styles.estadoBadgeGrande,
                            { backgroundColor: getEstadoColor(pedido.estado) }
                        ]}>
                            <Ionicons
                                name={getEstadoIcono(pedido.estado)}
                                size={18}
                                color="#FFF"
                            />
                            <Text style={styles.estadoBadgeGrandeTexto}>
                                {pedido.estado}
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.modalScrollContent}
                    >

                        {/* Detalles del cliente */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Detalles del cliente</Text>

                            <View style={styles.infoGrid}>
                                <View style={styles.infoCard}>
                                    <View style={styles.infoCardHeader}>
                                        <View style={styles.infoIconContainer}>
                                            <Ionicons name="person" size={16} color="#3B82F6" />
                                        </View>
                                        <Text style={styles.infoLabel}>Cliente</Text>
                                    </View>
                                    <Text style={styles.infoValue}>
                                        {pedido.nombre_cliente}
                                    </Text>
                                </View>

                                <View style={styles.infoCard}>
                                    <View style={styles.infoCardHeader}>
                                        <View style={styles.infoIconContainer}>
                                            <Ionicons name="call" size={16} color="#3B82F6" />
                                        </View>
                                        <Text style={styles.infoLabel}>Teléfono</Text>
                                    </View>
                                    <Text style={styles.infoValue}>
                                        {pedido.telefono}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoCardFull}>
                                <View style={styles.infoCardHeader}>
                                    <View style={styles.infoIconContainer}>
                                        <Ionicons name="mail" size={16} color="#3B82F6" />
                                    </View>
                                    <Text style={styles.infoLabel}>Correo electrónico</Text>
                                </View>
                                <Text style={[styles.infoValue, styles.emailValue]}>
                                    {pedido.email}
                                </Text>
                            </View>
                        </View>

                        {/* Dirección */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Entrega</Text>

                            <View style={styles.direccionCard}>
                                <View style={styles.direccionIconWrapper}>
                                    <Ionicons name="location" size={24} color="#3B82F6" />
                                </View>
                                <View style={styles.direccionContent}>
                                    <Text style={styles.direccionLabel}>Dirección de entrega</Text>
                                    <Text style={styles.direccionTexto}>
                                        {pedido.direccion}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Información de pago */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Pago</Text>

                            <View style={styles.pagoCard}>
                                <View style={styles.pagoIconWrapper}>
                                    <Ionicons
                                        name={pedido.metodo_pago === 'Yape' ? 'phone-portrait' : 'card'}
                                        size={22}
                                        color="#3B82F6"
                                    />
                                </View>
                                <View style={styles.pagoInfo}>
                                    <Text style={styles.pagoLabel}>Método de pago</Text>
                                    <Text style={styles.pagoMetodo}>{pedido.metodo_pago}</Text>
                                </View>
                                <View style={styles.pagoStatusBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                    <Text style={styles.pagoStatusText}>Pagado</Text>
                                </View>
                            </View>
                        </View>
                        {/* NUEVA SECCIÓN: Productos del pedido */}
                        <View style={styles.modalSeccion}>
                            <View style={styles.seccionHeaderConContador}>
                                <Text style={styles.modalSeccionTitulo}>Productos</Text>
                                <View style={styles.contadorProductos}>
                                    <Ionicons name="cube-outline" size={14} color="#3B82F6" />
                                    <Text style={styles.contadorProductosTexto}>
                                        {pedido.productos?.length || 0} items
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.productosLista}>
                                {Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
                                    pedido.productos.map((producto, index) => (
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
                                    ))
                                ) : (
                                    <View style={styles.sinProductosContainer}>
                                        <Ionicons name="cube-outline" size={32} color="#D1D5DB" />
                                        <Text style={styles.sinProductosTexto}>
                                            No hay productos en este pedido
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Resumen financiero */}
                        <View style={styles.modalSeccionResumen}>
                            {/* <Text style={styles.modalSeccionTitulo}>Resumen de compra</Text> */}

                            <View style={styles.resumenCardModern}>
                                <View style={styles.resumenRow}>
                                    <Text style={styles.resumenLabel}>Subtotal</Text>
                                    <Text style={styles.resumenValor}>
                                        S/ {parseFloat(pedido.total).toFixed(2)}
                                    </Text>
                                </View>

                                <View style={styles.resumenRow}>
                                    <View style={styles.resumenLabelConIcono}>
                                        <Ionicons name="rocket" size={14} color="#10B981" />
                                        <Text style={styles.resumenLabel}>Envío</Text>
                                    </View>
                                    <View style={styles.envioGratisTag}>
                                        <Text style={styles.resumenEnvioGratis}>GRATIS</Text>
                                    </View>
                                </View>

                                <View style={styles.dividerModal} />

                                <View style={styles.resumenRowTotal}>
                                    <View style={styles.totalLabelContainer}>
                                        <Text style={styles.resumenTotalLabel}>Total pagado</Text>
                                        <View style={styles.verificadoBadge}>
                                            <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                                            <Text style={styles.verificadoText}>Verificado</Text>
                                        </View>
                                    </View>
                                    <View style={styles.resumenTotalContainer}>
                                        <Text style={styles.resumenTotalMoneda}>S/</Text>
                                        <Text style={styles.resumenTotalValor}>
                                            {parseFloat(pedido.total).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Ayuda */}
                        <View style={styles.soporteSection}>
                            <View style={styles.soporteCard}>
                                <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
                                <Text style={styles.soporteText}>
                                    ¿Problemas con tu pedido?{' '}
                                    <Text style={styles.soporteLink}>Contáctanos</Text>
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.modalDetalleFooter}>
                        <TouchableOpacity
                            style={styles.botonCerrarModal}
                            onPress={onClose}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.textoCerrarModal}>Cerrar</Text>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalDetalleOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalDetalleContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '92%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
    },
    modalDetalleHeader: {
        paddingTop: 8,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FAFBFC',
    },
    modalHeaderTop: {
        alignItems: 'center',
        marginBottom: 12,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    modalHeaderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
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
    modalDetalleTitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    modalDetalleSubtitulo: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    estadoBadgeGrande: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 7,
    },
    estadoBadgeGrandeTexto: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    modalScrollContent: {
        paddingBottom: 16,
    },

    // NUEVOS ESTILOS PARA PRODUCTOS
    seccionHeaderConContador: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    contadorProductos: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5,
    },
    contadorProductosTexto: {
        fontSize: 12,
        fontWeight: '700',
        color: '#3B82F6',
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
    sinProductosContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 8,
    },
    sinProductosTexto: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    // Resto de estilos existentes
    modalSeccion: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalSeccionResumen: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    modalSeccionTitulo: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.2,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    infoCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoCardFull: {
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    infoIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    infoValue: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    emailValue: {
        fontSize: 12,
    },
    direccionCard: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        padding: 14,
        borderRadius: 10,
        gap: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    direccionIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    direccionContent: {
        flex: 1,
    },
    direccionLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    direccionTexto: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '500',
        lineHeight: 18,
    },
    pagoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 14,
        borderRadius: 10,
        gap: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    pagoIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagoInfo: {
        flex: 1,
    },
    pagoLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    pagoMetodo: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '700',
    },
    pagoStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    pagoStatusText: {
        fontSize: 11,
        color: '#065F46',
        fontWeight: '700',
    },
    resumenCardModern: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    resumenLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    resumenValor: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    resumenLabelConIcono: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    envioGratisTag: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    resumenEnvioGratis: {
        fontSize: 11,
        fontWeight: '700',
        color: '#10B981',
        letterSpacing: 0.5,
    },
    dividerModal: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    resumenRowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    totalLabelContainer: {
        gap: 6,
    },
    resumenTotalLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    verificadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verificadoText: {
        fontSize: 10,
        color: '#10B981',
        fontWeight: '600',
    },
    resumenTotalContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    resumenTotalMoneda: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
        marginRight: 4,
    },
    resumenTotalValor: {
        fontSize: 26,
        fontWeight: '700',
        color: '#3B82F6',
    },
    soporteSection: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    soporteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    soporteText: {
        flex: 1,
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    soporteLink: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    modalDetalleFooter: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    botonCerrarModal: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
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

export default ModalDetallePedido;