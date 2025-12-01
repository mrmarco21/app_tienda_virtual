import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModalLoginOInvitado = ({ visible, onClose, onIniciarSesion, onContinuarInvitado }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Icono principal */}
                        <View style={styles.iconContainer}>
                            <Ionicons name="person-circle-outline" size={48} color="#3B82F6" />
                        </View>

                        {/* Título */}
                        <Text style={styles.titulo}>¿Cómo deseas continuar?</Text>
                        <Text style={styles.subtitulo}>
                            Elige la mejor opción para ti
                        </Text>

                        {/* Opciones */}
                        <View style={styles.opcionesContainer}>
                            {/* Opción: Iniciar sesión */}
                            <TouchableOpacity
                                style={styles.opcionCard}
                                onPress={onIniciarSesion}
                                activeOpacity={0.8}
                            >
                                <View style={styles.opcionHeader}>
                                    <View style={styles.opcionIcono}>
                                        <Ionicons name="log-in-outline" size={22} color="#3B82F6" />
                                    </View>
                                    <View style={styles.recomendadoBadge}>
                                        <Text style={styles.recomendadoTexto}>Recomendado</Text>
                                    </View>
                                </View>
                                
                                <Text style={styles.opcionTitulo}>Iniciar sesión</Text>
                                
                                <View style={styles.beneficiosContainer}>
                                    <View style={styles.beneficioItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                        <Text style={styles.beneficioTexto}>Historial de compras</Text>
                                    </View>
                                    <View style={styles.beneficioItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                        <Text style={styles.beneficioTexto}>Guardar direcciones</Text>
                                    </View>
                                    <View style={styles.beneficioItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                        <Text style={styles.beneficioTexto}>Ofertas exclusivas</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.botonOpcion}>
                                    <Text style={styles.botonOpcionTexto}>Iniciar sesión</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                                </View>
                            </TouchableOpacity>

                            {/* Opción: Continuar como invitado */}
                            <TouchableOpacity
                                style={[styles.opcionCard, styles.opcionSecundaria]}
                                onPress={onContinuarInvitado}
                                activeOpacity={0.8}
                            >
                                <View style={styles.opcionHeader}>
                                    <View style={[styles.opcionIcono, styles.opcionIconoSecundario]}>
                                        <Ionicons name="person-outline" size={22} color="#6B7280" />
                                    </View>
                                </View>
                                
                                <Text style={styles.opcionTitulo}>Continuar como invitado</Text>
                                
                                <View style={styles.beneficiosContainer}>
                                    <View style={styles.beneficioItem}>
                                        <Ionicons name="mail-outline" size={14} color="#6B7280" />
                                        <Text style={styles.beneficioTextoSecundario}>
                                            Confirmación por email
                                        </Text>
                                    </View>
                                    <View style={styles.beneficioItem}>
                                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                                        <Text style={styles.beneficioTextoSecundario}>
                                            Compra rápida
                                        </Text>
                                    </View>
                                </View>
                                
                                <View style={[styles.botonOpcion, styles.botonSecundario]}>
                                    <Text style={styles.botonSecundarioTexto}>Continuar</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#6B7280" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Botón cerrar */}
                    <TouchableOpacity
                        style={styles.botonCerrar}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        width: '100%',
        maxWidth: 380,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 16,
    },
    iconContainer: {
        alignSelf: 'center',
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    titulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    subtitulo: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
    opcionesContainer: {
        gap: 12,
    },
    opcionCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    opcionSecundaria: {
        backgroundColor: '#FFFFFF',
    },
    opcionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    opcionIcono: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    opcionIconoSecundario: {
        backgroundColor: '#F3F4F6',
    },
    recomendadoBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    recomendadoTexto: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    opcionTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    beneficiosContainer: {
        gap: 6,
        marginBottom: 12,
    },
    beneficioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    beneficioTexto: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
        flex: 1,
    },
    beneficioTextoSecundario: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        flex: 1,
    },
    botonOpcion: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    botonSecundario: {
        backgroundColor: '#F3F4F6',
    },
    botonOpcionTexto: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    botonSecundarioTexto: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    botonCerrar: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ModalLoginOInvitado;