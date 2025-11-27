import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalCambiarEstado = ({ 
    visible, 
    pedidoSeleccionado, 
    getEstadoConfig, 
    onClose, 
    onConfirmar 
}) => {
    if (!pedidoSeleccionado) return null;

    const estadoConfig = getEstadoConfig(pedidoSeleccionado.estado);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header del Modal */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalTitleContainer}>
                            <Ionicons name="swap-horizontal" size={24} color="#3B82F6" />
                            <View style={styles.modalTitleTextContainer}>
                                <Text style={styles.modalTitle}>Cambiar Estado</Text>
                                <Text style={styles.modalSubtitle}>
                                    Pedido #{pedidoSeleccionado.id}
                                </Text>
                            </View>
                        </View>
                        {/* <TouchableOpacity
                            onPress={onClose}
                            style={styles.modalCloseButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity> */}
                    </View>

                    {/* Estado Actual */}
                    <View style={styles.estadoActualContainer}>
                        <Text style={styles.estadoActualLabel}>Estado actual:</Text>
                        <View style={[
                            styles.estadoActualBadge,
                            { backgroundColor: estadoConfig.bg }
                        ]}>
                            <Ionicons
                                name={estadoConfig.icon}
                                size={18}
                                color={estadoConfig.color}
                            />
                            <Text style={[
                                styles.estadoActualTexto,
                                { color: estadoConfig.color }
                            ]}>
                                {pedidoSeleccionado.estado}
                            </Text>
                        </View>
                    </View>

                    {/* Opciones de Estados */}
                    <View style={styles.estadosContainer}>
                        <Text style={styles.estadosTitle}>Selecciona el nuevo estado:</Text>

                        {/* Pendiente */}
                        <TouchableOpacity
                            style={styles.estadoOpcion}
                            onPress={() => onConfirmar('Pendiente')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.estadoOpcionIcono, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="time" size={24} color="#F59E0B" />
                            </View>
                            <View style={styles.estadoOpcionTexto}>
                                <Text style={styles.estadoOpcionNombre}>Pendiente</Text>
                                <Text style={styles.estadoOpcionDescripcion}>
                                    El pedido está en espera
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Completado */}
                        <TouchableOpacity
                            style={styles.estadoOpcion}
                            onPress={() => onConfirmar('Completado')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.estadoOpcionIcono, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                            </View>
                            <View style={styles.estadoOpcionTexto}>
                                <Text style={styles.estadoOpcionNombre}>Completado</Text>
                                <Text style={styles.estadoOpcionDescripcion}>
                                    El pedido fue entregado
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Cancelado */}
                        <TouchableOpacity
                            style={styles.estadoOpcion}
                            onPress={() => onConfirmar('Cancelado')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.estadoOpcionIcono, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="close-circle" size={24} color="#EF4444" />
                            </View>
                            <View style={styles.estadoOpcionTexto}>
                                <Text style={styles.estadoOpcionNombre}>Cancelado</Text>
                                <Text style={styles.estadoOpcionDescripcion}>
                                    El pedido fue cancelado
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Botón Cerrar */}
                    <TouchableOpacity
                        style={styles.modalBotonCerrar}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
                        <Text style={styles.modalBotonCerrarTexto}>Cerrar sin cambiar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    modalTitleTextContainer: {
        flex: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    estadoActualContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#F9FAFB',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 12,
    },
    estadoActualLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    estadoActualBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    estadoActualTexto: {
        fontSize: 14,
        fontWeight: '700',
    },
    estadosContainer: {
        padding: 20,
    },
    estadosTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    estadoOpcion: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
    },
    estadoOpcionIcono: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    estadoOpcionTexto: {
        flex: 1,
    },
    estadoOpcionNombre: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    estadoOpcionDescripcion: {
        fontSize: 13,
        color: '#6B7280',
    },
    modalBotonCerrar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        margin: 20,
        marginTop: 0,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        gap: 8,
    },
    modalBotonCerrarTexto: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6B7280',
    },
});

export default ModalCambiarEstado;