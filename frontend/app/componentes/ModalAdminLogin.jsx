import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalAdminLogin = ({ visible, onClose, onLogin, cargando }) => {
    const [adminForm, setAdminForm] = useState({ email: '', password: '' });

    const handleSubmit = () => {
        onLogin(adminForm);
    };

    const handleClose = () => {
        setAdminForm({ email: '', password: '' });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="shield-checkmark" size={32} color="#3B82F6" />
                        </View>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={handleClose}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalTitle}>Acceso Administrativo</Text>
                    <Text style={styles.modalSubtitle}>
                        Ingresa tus credenciales de administrador
                    </Text>

                    <View style={styles.modalForm}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="admin@tienda.com"
                                    value={adminForm.email}
                                    onChangeText={(text) => setAdminForm({ ...adminForm, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    value={adminForm.password}
                                    onChangeText={(text) => setAdminForm({ ...adminForm, password: text })}
                                    secureTextEntry
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, cargando && styles.modalButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={cargando}
                            activeOpacity={0.8}
                        >
                            {cargando ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Ionicons name="log-in-outline" size={20} color="#FFF" />
                                    <Text style={styles.modalButtonText}>Acceder al panel</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.modalFooter}>
                            <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                            <Text style={styles.modalFooterText}>
                                Solo personal autorizado
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },
    modalForm: {
        gap: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 14,
    },
    modalButton: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginTop: 8,
    },
    modalButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingTop: 16,
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    modalFooterText: {
        fontSize: 12,
        color: '#6B7280',
    },
});

export default ModalAdminLogin;
