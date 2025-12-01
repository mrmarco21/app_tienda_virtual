import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    Switch,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalDireccion = ({ visible, direccion, onClose, onGuardar, cargando }) => {
    const [form, setForm] = useState({
        alias: '',
        direccion: '',
        referencia: '',
        telefono: '',
        es_principal: false
    });

    useEffect(() => {
        if (direccion) {
            setForm({
                alias: direccion.alias || '',
                direccion: direccion.direccion || '',
                referencia: direccion.referencia || '',
                telefono: direccion.telefono || '',
                es_principal: direccion.es_principal || false
            });
        } else {
            setForm({
                alias: '',
                direccion: '',
                referencia: '',
                telefono: '',
                es_principal: false
            });
        }
    }, [direccion, visible]);

    const handleGuardar = () => {
        onGuardar(form);
    };

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
                            <Text style={styles.titulo}>
                                {direccion ? 'Editar Dirección' : 'Nueva Dirección'}
                            </Text>
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
                        <View style={styles.campo}>
                            <Text style={styles.label}>
                                Alias <Text style={styles.requerido}>*</Text>
                            </Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="pricetag-outline" size={18} color="#6B7280" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Casa, Trabajo, Casa de mamá"
                                    value={form.alias}
                                    onChangeText={(text) => setForm({ ...form, alias: text })}
                                />
                            </View>
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label}>
                                Dirección completa <Text style={styles.requerido}>*</Text>
                            </Text>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <Ionicons name="location-outline" size={18} color="#6B7280" style={styles.iconoTextArea} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Calle, número, distrito, ciudad"
                                    value={form.direccion}
                                    onChangeText={(text) => setForm({ ...form, direccion: text })}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label}>Referencia (opcional)</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Frente al parque, casa verde"
                                    value={form.referencia}
                                    onChangeText={(text) => setForm({ ...form, referencia: text })}
                                />
                            </View>
                        </View>

                        <View style={styles.campo}>
                            <Text style={styles.label}>Teléfono (opcional)</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={18} color="#6B7280" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Número de contacto"
                                    value={form.telefono}
                                    onChangeText={(text) => setForm({ ...form, telefono: text })}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.switchContainer}>
                            <View style={styles.switchInfo}>
                                <Ionicons name="star" size={20} color="#F59E0B" />
                                <View style={styles.switchTextos}>
                                    <Text style={styles.switchLabel}>Dirección principal</Text>
                                    <Text style={styles.switchDescripcion}>
                                        Se usará por defecto en tus compras
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={form.es_principal}
                                onValueChange={(value) => setForm({ ...form, es_principal: value })}
                                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                thumbColor={form.es_principal ? '#3B82F6' : '#F3F4F6'}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.botonCancelar}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.textoBotonCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.botonGuardar,
                                (!form.alias || !form.direccion || cargando) && styles.botonDeshabilitado
                            ]}
                            onPress={handleGuardar}
                            disabled={!form.alias || !form.direccion || cargando}
                            activeOpacity={0.8}
                        >
                            {cargando ? (
                                <Text style={styles.textoBotonGuardar}>Guardando...</Text>
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                    <Text style={styles.textoBotonGuardar}>Guardar</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
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
        maxHeight: '90%',
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
        paddingBottom: 16,
    },
    campo: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    requerido: {
        color: '#EF4444',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 10,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
        paddingTop: 12,
    },
    iconoTextArea: {
        marginTop: 2,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
    },
    textArea: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        padding: 14,
        borderRadius: 10,
        marginTop: 8,
    },
    switchInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    switchTextos: {
        flex: 1,
    },
    switchLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    switchDescripcion: {
        fontSize: 11,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 12,
    },
    botonCancelar: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoBotonCancelar: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6B7280',
    },
    botonGuardar: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    botonDeshabilitado: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    textoBotonGuardar: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default ModalDireccion;
