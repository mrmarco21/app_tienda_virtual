import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FormularioLogin = ({ onLogin, onSwitchToRegister, cargando }) => {
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleSubmit = () => {
        onLogin(loginForm);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    <View style={styles.formIconContainer}>
                        <Ionicons name="log-in-outline" size={48} color="#3B82F6" />
                    </View>
                    <Text style={styles.formTitulo}>¡Bienvenido de nuevo!</Text>
                    <Text style={styles.formSubtitulo}>Ingresa tus datos para continuar</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="tu@email.com"
                                placeholderTextColor="#9CA3AF"
                                value={loginForm.email}
                                onChangeText={(text) => setLoginForm({ ...loginForm, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Contraseña</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                value={loginForm.password}
                                onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
                                secureTextEntry={!mostrarPassword}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />
                            <TouchableOpacity
                                onPress={() => setMostrarPassword(!mostrarPassword)}
                                style={styles.eyeButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={mostrarPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.botonPrimario, cargando && styles.botonDeshabilitado]}
                        onPress={handleSubmit}
                        disabled={cargando}
                        activeOpacity={0.8}
                    >
                        {cargando ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="log-in-outline" size={20} color="#FFF" style={styles.botonIcon} />
                                <Text style={styles.textoBotonPrimario}>Iniciar sesión</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>o</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={onSwitchToRegister}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.linkTexto}>
                            ¿No tienes cuenta? <Text style={styles.linkDestacado}>Regístrate aquí</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    formContainer: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    formIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 24,
    },
    formTitulo: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    formSubtitulo: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 14,
    },
    eyeButton: {
        padding: 4,
    },
    botonPrimario: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    botonIcon: {
        marginRight: 8,
    },
    textoBotonPrimario: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    botonDeshabilitado: {
        opacity: 0.6,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#9CA3AF',
        fontSize: 13,
    },
    linkContainer: {
        alignItems: 'center',
    },
    linkTexto: {
        fontSize: 14,
        color: '#6B7280',
    },
    linkDestacado: {
        color: '#3B82F6',
        fontWeight: '700',
    },
});

export default FormularioLogin;
