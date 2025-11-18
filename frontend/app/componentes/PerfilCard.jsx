import { View, Text, StyleSheet } from 'react-native';

const PerfilCard = ({ usuario }) => {
    return (
        <View style={styles.perfilCard}>
            <View style={styles.perfilIcono}>
                <Text style={styles.perfilIconoTexto}>
                    {usuario.nombre.charAt(0).toUpperCase()}
                </Text>
            </View>
            <View style={styles.perfilInfo}>
                <Text style={styles.perfilNombre}>{usuario.nombre}</Text>
                <Text style={styles.perfilEmail}>{usuario.email}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    perfilCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    perfilIcono: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    perfilIconoTexto: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
    },
    perfilInfo: {
        flex: 1,
    },
    perfilNombre: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    perfilEmail: {
        fontSize: 14,
        color: '#6B7280',
    },
});

export default PerfilCard;