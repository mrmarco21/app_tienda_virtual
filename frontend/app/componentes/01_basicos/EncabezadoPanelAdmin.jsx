import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderPanelAdmin = ({ navigation, usuario }) => {
    const handleCerrarSesion = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('usuario');
                        await AsyncStorage.removeItem('token');
                        navigation.navigate('Perfil');
                    }
                }
            ]
        );
    };

    return (
        <View style={[
            styles.header,
            { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50 }
        ]}>
            <View style={styles.headerContent}>
                {/* Avatar y Info del Usuario */}
                <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="shield-checkmark" size={20} color="#FFF" />
                        </View>
                        <View style={styles.statusIndicator} />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Panel de Control</Text>
                        <Text style={styles.headerSubtitle}>
                            {usuario ? `Hola, ${usuario.nombre}` : 'Administrador'}
                        </Text>
                    </View>
                </View>

                {/* Botón Cerrar Sesión */}
                <TouchableOpacity
                    onPress={handleCerrarSesion}
                    style={styles.logoutButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 1,
        letterSpacing:1,
    },
    logoutButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HeaderPanelAdmin;