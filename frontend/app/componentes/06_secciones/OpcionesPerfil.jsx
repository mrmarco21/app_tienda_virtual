import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OpcionesPerfil = ({ onCerrarSesion }) => {
    return (
        <View style={styles.seccion}>
            <TouchableOpacity
                style={styles.opcion}
                onPress={() => Alert.alert(
                    'Acerca de',
                    'ElectroStore App v1.0\n\nDesarrollada con React Native + Expo\n\n¡Gracias por usar nuestra aplicación!',
                    [{ text: 'Cerrar', style: 'cancel' }]
                )}
                activeOpacity={0.7}
            >
                <View style={styles.opcionContenido}>
                    <View style={styles.opcionIconContainer}>
                        <Ionicons name="information-circle-outline" size={22} color="#3B82F6" />
                    </View>
                    <Text style={styles.opcionTexto}>Acerca de la app</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.opcion}
                onPress={() => Alert.alert(
                    'Soporte',
                    '¿Necesitas ayuda?\n\nContacta con nosotros:\n\n📧 Email: soporte@tienda.com\n📞 Teléfono: +51 999 999 999',
                    [{ text: 'Entendido', style: 'default' }]
                )}
                activeOpacity={0.7}
            >
                <View style={styles.opcionContenido}>
                    <View style={styles.opcionIconContainer}>
                        <Ionicons name="headset-outline" size={22} color="#3B82F6" />
                    </View>
                    <Text style={styles.opcionTexto}>Soporte y ayuda</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.opcion, styles.opcionUltima]}
                onPress={onCerrarSesion}
                activeOpacity={0.7}
            >
                <View style={styles.opcionContenido}>
                    <View style={[styles.opcionIconContainer, styles.opcionIconContainerRed]}>
                        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    </View>
                    <Text style={[styles.opcionTexto, styles.opcionCerrarSesion]}>
                        Cerrar sesión
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    seccion: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    opcion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
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
    opcionTexto: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    opcionCerrarSesion: {
        color: '#EF4444',
        fontWeight: '700',
    },
});

export default OpcionesPerfil;
