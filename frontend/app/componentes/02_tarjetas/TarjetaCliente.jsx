import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TarjetaCliente = ({ cliente, esUltimo, onVerDetalle }) => {
    const rolLower = cliente.rol?.toLowerCase() || 'cliente';
    const esAdmin = rolLower === 'admin' || rolLower === 'vendedor';

    const getRolConfig = () => {
        if (rolLower === 'admin') {
            return {
                label: 'Administrador',
                icon: 'shield-checkmark',
                color: '#DC2626',
                bgColor: '#FEE2E2'
            };
        }
        if (rolLower === 'vendedor') {
            return {
                label: 'Vendedor',
                icon: 'briefcase',
                color: '#7C3AED',
                bgColor: '#EDE9FE'
            };
        }
        return {
            label: 'Cliente',
            icon: 'person',
            color: '#059669',
            bgColor: '#D1FAE5'
        };
    };

    const rolConfig = getRolConfig();

    return (
        <TouchableOpacity
            style={[styles.card, esUltimo && styles.lastCard]}
            onPress={() => onVerDetalle(cliente)}
            activeOpacity={0.7}
        >
            {/* Avatar y nombre */}
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: rolConfig.bgColor }]}>
                    <Ionicons name={rolConfig.icon} size={24} color={rolConfig.color} />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.nombre}>{cliente.nombre}</Text>
                    <View style={[styles.rolBadge, { backgroundColor: rolConfig.bgColor }]}>
                        <Ionicons name={rolConfig.icon} size={12} color={rolConfig.color} />
                        <Text style={[styles.rolTexto, { color: rolConfig.color }]}>
                            {rolConfig.label}
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>

            {/* Información de contacto */}
            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="mail-outline" size={16} color="#6B7280" />
                    </View>
                    <Text style={styles.infoTexto} numberOfLines={1}>
                        {cliente.email}
                    </Text>
                </View>

                {cliente.telefono && (
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="call-outline" size={16} color="#6B7280" />
                        </View>
                        <Text style={styles.infoTexto}>
                            {cliente.telefono}
                        </Text>
                    </View>
                )}
            </View>

            {/* Footer con fecha de registro */}
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.footerTexto}>
                        Registrado: {new Date(cliente.created_at || cliente.createdAt).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    lastCard: {
        marginBottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    nombre: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    rolBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    rolTexto: {
        fontSize: 11,
        fontWeight: '700',
    },
    infoContainer: {
        gap: 8,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoTexto: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
    },
    footer: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerTexto: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
});

export default TarjetaCliente;
