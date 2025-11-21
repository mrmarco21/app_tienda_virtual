import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderAdmin = ({ 
    navigation, 
    titulo, 
    subtitulo, 
    mostrarBack = true,
    mostrarRefresh = false,
    onRefresh,
    mostrarAgregar = false,
    onAgregar,
    colorBotonAgregar = '#10B981',
    iconoBotonDerecho,
    onPressDerecho
}) => {
    return (
        <View style={[
            styles.header,
            { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 50 }
        ]}>
            {/* Botón Izquierdo (Back o Espacio) */}
            {mostrarBack ? (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
            ) : (
                <View style={styles.emptySpace} />
            )}

            {/* Título y Subtítulo */}
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{titulo}</Text>
                {subtitulo && (
                    <Text style={styles.headerSubtitle}>{subtitulo}</Text>
                )}
            </View>

            {/* Botón Derecho (Refresh, Agregar o Custom) */}
            {mostrarRefresh && onRefresh ? (
                <TouchableOpacity
                    onPress={onRefresh}
                    style={styles.refreshButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="refresh" size={20} color="#3B82F6" />
                </TouchableOpacity>
            ) : mostrarAgregar && onAgregar ? (
                <TouchableOpacity
                    onPress={onAgregar}
                    style={[styles.addButton, { backgroundColor: colorBotonAgregar + '20' }]}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add-circle" size={24} color={colorBotonAgregar} />
                </TouchableOpacity>
            ) : iconoBotonDerecho && onPressDerecho ? (
                <TouchableOpacity
                    onPress={onPressDerecho}
                    style={styles.customButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name={iconoBotonDerecho} size={24} color="#6B7280" />
                </TouchableOpacity>
            ) : (
                <View style={styles.emptySpace} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
        fontWeight: '500',
        textAlign: 'center',
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptySpace: {
        width: 40,
    },
});

export default HeaderAdmin;