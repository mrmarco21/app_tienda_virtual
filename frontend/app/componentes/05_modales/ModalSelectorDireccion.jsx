import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalSelectorDireccion = ({ visible, direcciones, onSeleccionar, onAgregarNueva, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View style={styles.handleBar} />
                        <View style={styles.headerInfo}>
                            <Text style={styles.titulo}>Seleccionar Dirección</Text>
                            <TouchableOpacity
                                style={styles.botonCerrar}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {direcciones.length === 0 ? (
                            <View style={styles.sinDirecciones}>
                                <Ionicons name="location-outline" size={48} color="#D1D5DB" />
                                <Text style={styles.sinDireccionesTexto}>No tienes direcciones guardadas</Text>
                                <Text style={styles.sinDireccionesSubtexto}>
                                    Agrega una dirección para continuar
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.listaDirecciones}>
                                {direcciones.map((direccion) => (
                                    <TouchableOpacity
                                        key={direccion.id}
                                        style={styles.tarjetaDireccion}
                                        onPress={() => onSeleccionar(direccion)}
                                        activeOpacity={0.7}
                                    >
                                        {direccion.es_principal && (
                                            <View style={styles.badgePrincipal}>
                                                <Ionicons name="star" size={12} color="#F59E0B" />
                                                <Text style={styles.textoPrincipal}>Principal</Text>
                                            </View>
                                        )}

                                        <View style={styles.direccionHeader}>
                                            <View style={styles.iconoContainer}>
                                                <Ionicons name="home" size={18} color="#3B82F6" />
                                            </View>
                                            <Text style={styles.alias}>{String(direccion.alias || 'Sin nombre')}</Text>
                                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                                        </View>

                                        <Text style={styles.direccionTexto}>{String(direccion.direccion || 'Sin dirección')}</Text>

                                        {direccion.referencia && String(direccion.referencia).trim() !== '' && (
                                            <View style={styles.referenciaContainer}>
                                                <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
                                                <Text style={styles.referenciaTexto}>{String(direccion.referencia)}</Text>
                                            </View>
                                        )}

                                        {direccion.telefono && String(direccion.telefono).trim() !== '' && (
                                            <View style={styles.telefonoContainer}>
                                                <Ionicons name="call-outline" size={14} color="#6B7280" />
                                                <Text style={styles.telefonoTexto}>{String(direccion.telefono)}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.botonAgregarNueva}
                            onPress={onAgregarNueva}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle" size={20} color="#3B82F6" />
                            <Text style={styles.textoAgregarNueva}>Agregar nueva dirección</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
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
        alignItems: 'center',
    },
    titulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
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
        paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    },
    sinDirecciones: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 8,
    },
    sinDireccionesTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    sinDireccionesSubtexto: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    listaDirecciones: {
        gap: 12,
        marginBottom: 16,
    },
    tarjetaDireccion: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    badgePrincipal: {
        position: 'absolute',
        top: 10,
        right: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    textoPrincipal: {
        fontSize: 10,
        fontWeight: '700',
        color: '#D97706',
        
    },
    direccionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    iconoContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alias: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    direccionTexto: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
        marginBottom: 8,
    },
    referenciaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    referenciaTexto: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    telefonoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    telefonoTexto: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    botonAgregarNueva: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#EFF6FF',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3B82F6',
        borderStyle: 'dashed',
    },
    textoAgregarNueva: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3B82F6',
    },
});

export default ModalSelectorDireccion;
