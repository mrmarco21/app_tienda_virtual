import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SeccionDirecciones = ({ direcciones, onAgregar, onEditar, onEliminar, onEstablecerPrincipal }) => {
    const [expandido, setExpandido] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setExpandido(!expandido)}
                activeOpacity={0.7}
            >
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="location" size={22} color="#3B82F6" />
                    </View>
                    <Text style={styles.titulo}>Mis Direcciones</Text>
                </View>
                <Ionicons
                    name={expandido ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#9CA3AF"
                />
            </TouchableOpacity>

            {expandido && (
                <View style={styles.contenidoExpandido}>
                    <TouchableOpacity
                        style={styles.botonAgregar}
                        onPress={onAgregar}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add-circle" size={20} color="#3B82F6" />
                        <Text style={styles.textoAgregar}>Agregar dirección</Text>
                    </TouchableOpacity>

                    {direcciones.length === 0 ? (
                        <View style={styles.sinDirecciones}>
                            <Ionicons name="location-outline" size={48} color="#D1D5DB" />
                            <Text style={styles.sinDireccionesTexto}>No tienes direcciones guardadas</Text>
                            <Text style={styles.sinDireccionesSubtexto}>
                                Agrega una dirección para agilizar tus compras
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.listaDirecciones}>
                            {direcciones.map((direccion) => (
                                <View key={direccion.id} style={styles.tarjetaDireccion}>
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

                                    <View style={styles.acciones}>
                                        {!direccion.es_principal && (
                                            <TouchableOpacity
                                                style={styles.botonAccion}
                                                onPress={() => onEstablecerPrincipal(direccion.id)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name="star-outline" size={16} color="#F59E0B" />
                                                <Text style={styles.textoAccion}>Hacer principal</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={styles.botonAccion}
                                            onPress={() => onEditar(direccion)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="create-outline" size={16} color="#3B82F6" />
                                            <Text style={styles.textoAccion}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.botonAccion}
                                            onPress={() => onEliminar(direccion.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                            <Text style={[styles.textoAccion, { color: '#EF4444' }]}>Eliminar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    contenidoExpandido: {
        padding: 16,
    },
    botonAgregar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 16,
    },
    textoAgregar: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
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
        right: 10,
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
        marginBottom: 8,
    },
    telefonoTexto: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    acciones: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    botonAccion: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textoAccion: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
    },
});

export default SeccionDirecciones;
