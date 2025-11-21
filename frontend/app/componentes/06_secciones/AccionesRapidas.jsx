import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AccionesRapidas = ({ navigation }) => {
    const acciones = [
        {
            id: 'productos',
            titulo: 'Productos',
            icono: 'cube',
            color: '#3B82F6',
            bgColor: '#EFF6FF',
            onPress: () => navigation.navigate('GestionProductos')
        },
        {
            id: 'pedidos',
            titulo: 'Pedidos',
            icono: 'receipt',
            color: '#8B5CF6',
            bgColor: '#F3E8FF',
            onPress: () => navigation.navigate('GestionPedidos')
        },
        {
            id: 'agregar',
            titulo: 'Agregar',
            icono: 'add-circle',
            color: '#10B981',
            bgColor: '#ECFDF5',
            onPress: () => navigation.navigate('AgregarProducto')
        },
        {
            id: 'reportes',
            titulo: 'Reportes',
            icono: 'bar-chart',
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            onPress: () => navigation.navigate('Reportes')
        }
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionsGrid}>
                {acciones.map(accion => (
                    <TouchableOpacity
                        key={accion.id}
                        style={styles.actionCard}
                        onPress={accion.onPress}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIconCircle, { backgroundColor: accion.bgColor }]}>
                            <Ionicons name={accion.icono} size={22} color={accion.color} />
                        </View>
                        <Text style={styles.actionText}>{accion.titulo}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 12,
    },
    actionCard: {
        width: (width - 42) / 2,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    actionIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
    },
});

export default AccionesRapidas;