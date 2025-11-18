import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
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
                        <View style={styles.modalHeaderInfo}>
                            <Text style={styles.modalDetalleTitulo}>Detalle del Pedido</Text>
                            <Text style={styles.modalDetalleSubtitulo}>
                                Pedido #{pedido.id}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.modalScrollContent}
                    >
                        {/* Estado del pedido */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Estado del pedido</Text>
                            <View style={[
                                styles.estadoBadgeGrande,
                                { backgroundColor: getEstadoColor(pedido.estado) }
                            ]}>
                                <Ionicons
                                    name={getEstadoIcono(pedido.estado)}
                                    size={20}
                                    color="#FFF"
                                />
                                <Text style={styles.estadoBadgeGrandeTexto}>
                                    {pedido.estado}
                                </Text>
                            </View>
                        </View>

                        {/* Información del cliente */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Información del cliente</Text>
                            
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="person-outline" size={18} color="#3B82F6" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Nombre completo</Text>
                                    <Text style={styles.infoValue}>
                                        {pedido.nombre_cliente}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="mail-outline" size={18} color="#3B82F6" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Correo electrónico</Text>
                                    <Text style={styles.infoValue}>
                                        {pedido.email}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="call-outline" size={18} color="#3B82F6" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Teléfono</Text>
                                    <Text style={styles.infoValue}>
                                        {pedido.telefono}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Información de entrega */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Información de entrega</Text>
                            
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="location-outline" size={18} color="#3B82F6" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Dirección de entrega</Text>
                                    <Text style={styles.infoValue}>
                                        {pedido.direccion}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Fecha de pedido</Text>
                                    <Text style={styles.infoValue}>
                                        {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Información de pago */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Información de pago</Text>
                            
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconContainer}>
                                    <Ionicons name="card-outline" size={18} color="#3B82F6" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Método de pago</Text>
                                    <Text style={styles.infoValue}>
                                        {pedido.metodo_pago}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Resumen de pago */}
                        <View style={styles.modalSeccion}>
                            <Text style={styles.modalSeccionTitulo}>Resumen de pago</Text>
                            
                            <View style={styles.resumenRow}>
                                <Text style={styles.resumenLabel}>Subtotal</Text>
                                <Text style={styles.resumenValor}>
                                    S/ {parseFloat(pedido.total).toFixed(2)}
                                </Text>
                            </View>

                            <View style={styles.resumenRow}>
                                <View style={styles.resumenLabelConIcono}>
                                    <Ionicons name="rocket-outline" size={16} color="#10B981" />
                                    <Text style={styles.resumenLabel}>Envío</Text>
                                </View>
                                <Text style={styles.resumenEnvioGratis}>GRATIS</Text>
                            </View>

                            <View style={styles.dividerModal} />

                            <View style={styles.resumenRowTotal}>
                                <Text style={styles.resumenTotalLabel}>Total pagado</Text>
                                <View style={styles.resumenTotalContainer}>
                                    <Text style={styles.resumenTotalMoneda}>S/</Text>
                                    <Text style={styles.resumenTotalValor}>
                                        {parseFloat(pedido.total).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Botón cerrar */}
                    <View style={styles.modalDetalleFooter}>
                        <TouchableOpacity
                            style={styles.botonCerrarModal}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.textoCerrarModal}>Entendido</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalDetalleContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalDetalleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalHeaderInfo: {
        flex: 1,
    },
    modalDetalleTitulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    modalDetalleSubtitulo: {
        fontSize: 14,
        color: '#6B7280',
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalScrollContent: {
        paddingBottom: 20,
    },
    modalSeccion: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalSeccionTitulo: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    estadoBadgeGrande: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    estadoBadgeGrandeTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    infoIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    resumenLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    resumenValor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    resumenLabelConIcono: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    resumenEnvioGratis: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    dividerModal: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    resumenRowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resumenTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
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
        fontSize: 24,
        fontWeight: '700',
        color: '#3B82F6',
    },
    modalDetalleFooter: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    botonCerrarModal: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoCerrarModal: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ModalDetallePedido;
