import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalAcercaDe from '../05_modales/ModalAcercaDe';
import ModalSoporte from '../05_modales/ModalSoporte';
import ModalCerrarSesion from '../05_modales/ModalCerrarSesion';

const OpcionesPerfil = ({ onCerrarSesion }) => {
    const [modalAcercaDeVisible, setModalAcercaDeVisible] = useState(false);
    const [modalSoporteVisible, setModalSoporteVisible] = useState(false);
    const [modalCerrarSesionVisible, setModalCerrarSesionVisible] = useState(false);

    return (
        <View style={styles.seccion}>
            {/* Acerca de */}
            <TouchableOpacity
                style={styles.opcion}
                onPress={() => setModalAcercaDeVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.opcionContenido}>
                    <View style={styles.opcionIconContainer}>
                        <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
                    </View>
                    <View>
                        <Text style={styles.opcionTitulo}>Acerca de la app</Text>
                        <Text style={styles.opcionDescripcion}>Versión, tecnología y créditos</Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Soporte */}
            <TouchableOpacity
                style={styles.opcion}
                onPress={() => setModalSoporteVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.opcionContenido}>
                    <View style={styles.opcionIconContainer}>
                        <Ionicons name="headset-outline" size={20} color="#2563EB" />
                    </View>
                    <View>
                        <Text style={styles.opcionTitulo}>Soporte y ayuda</Text>
                        <Text style={styles.opcionDescripcion}>Canales de contacto y atención</Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Cerrar sesión */}
            <TouchableOpacity
                style={[styles.opcion, styles.opcionUltima]}
                onPress={() => setModalCerrarSesionVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.opcionContenido}>
                    <View style={[styles.opcionIconContainer, styles.opcionIconContainerRed]}>
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    </View>
                    <View>
                        <Text style={[styles.opcionTitulo, styles.opcionCerrarSesion]}>
                            Cerrar sesión
                        </Text>
                        <Text style={styles.opcionDescripcionRoja}>
                            Salir de tu cuenta en este dispositivo
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Modales */}
            <ModalAcercaDe
                visible={modalAcercaDeVisible}
                onCerrar={() => setModalAcercaDeVisible(false)}
            />

            <ModalSoporte
                visible={modalSoporteVisible}
                onCerrar={() => setModalSoporteVisible(false)}
            />

            <ModalCerrarSesion
                visible={modalCerrarSesionVisible}
                onCerrar={() => setModalCerrarSesionVisible(false)}
                onConfirmar={() => {
                    setModalCerrarSesionVisible(false);
                    onCerrarSesion();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    seccion: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    opcion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    opcionUltima: {
        borderBottomWidth: 0,
    },
    opcionContenido: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    opcionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    opcionIconContainerRed: {
        backgroundColor: '#FEF2F2',
    },
    opcionTitulo: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
    },
    opcionDescripcion: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    opcionCerrarSesion: {
        color: '#B91C1C',
        fontWeight: '700',
    },
    opcionDescripcionRoja: {
        fontSize: 12,
        color: '#F97373',
        marginTop: 2,
    },
});

export default OpcionesPerfil;
