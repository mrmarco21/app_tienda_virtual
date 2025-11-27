import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SeccionImagen = ({ imagenLocal, imagenUrl, subiendoImagen, onPressMostrarOpciones }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Imagen del Producto <Text style={styles.required}>*</Text>
            </Text>

            {(imagenLocal || imagenUrl) ? (
                <View style={styles.imagenPreview}>
                    <Image
                        source={{ uri: imagenLocal || imagenUrl }}
                        style={styles.imagen}
                    />
                    <TouchableOpacity
                        style={styles.cambiarImagenButton}
                        onPress={onPressMostrarOpciones}
                        disabled={subiendoImagen}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="camera" size={20} color="#1A1A1A" />
                        <Text style={styles.cambiarImagenText}>Cambiar imagen</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.subirImagenButton}
                    onPress={onPressMostrarOpciones}
                    disabled={subiendoImagen}
                    activeOpacity={0.7}
                >
                    {subiendoImagen ? (
                        <ActivityIndicator size="large" color="#3B82F6" />
                    ) : (
                        <>
                            <View style={styles.uploadIconCircle}>
                                <Ionicons name="camera-outline" size={40} color="#3B82F6" />
                            </View>
                            <Text style={styles.subirImagenTexto}>Subir Imagen</Text>
                            <Text style={styles.subirImagenSubtexto}>
                                Toca para seleccionar o tomar una foto
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            )}

            {subiendoImagen && (
                <View style={styles.subiendoContainer}>
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text style={styles.subiendoTexto}>Subiendo imagen...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    titulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    required: {
        color: '#EF4444',
    },
    imagenPreview: {
        alignItems: 'center',
    },
    imagen: {
        width: 200,
        height: 200,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    cambiarImagenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    cambiarImagenText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    subirImagenButton: {
        backgroundColor: '#F8FAFC',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    uploadIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    subirImagenTexto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    subirImagenSubtexto: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
    },
    subiendoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom:10,
        gap: 8,
    },
    subiendoTexto: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '500',
    },
});

export default SeccionImagen;