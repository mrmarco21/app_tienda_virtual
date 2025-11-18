import { useState, useRef } from 'react';
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

const RegisterForm = ({ onRegister, onSwitchToLogin, cargando }) => {
    const [registroForm, setRegistroForm] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: ''
    });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

    // Refs para navegar entre inputs
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmarPasswordRef = useRef(null);

    const handleSubmit = () => {
        onRegister(registroForm);
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
                        <Ionicons name="person-add-outline" size={48} color="#3B82F6" />
                    </View>
                    <Text style={styles.formTitulo}>¡Únete ahora!</Text>
                    <Text style={styles.formSubtitulo}>Crea tu cuenta en segundos</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Nombre completo</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Juan Pérez"
                                placeholderTextColor="#9CA3AF"
                                value={registroForm.nombre}
                                onChangeText={(text) => setRegistroForm({ ...registroForm, nombre: text })}
                                returnKeyType="next"
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                ref={emailRef}
                                style={styles.input}
                                placeholder="tu@email.com"
                                placeholderTextColor="#9CA3AF"
                                value={registroForm.email}
                                onChangeText={(text) => setRegistroForm({ ...registroForm, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Contraseña</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                ref={passwordRef}
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor="#9CA3AF"
                                value={registroForm.password}
                                onChangeText={(text) => setRegistroForm({ ...registroForm, password: text })}
                                secureTextEntry={!mostrarPassword}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmarPasswordRef.current?.focus()}
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

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                ref={confirmarPasswordRef}
                                style={styles.input}
                                placeholder="Repite tu contraseña"
                                placeholderTextColor="#9CA3AF"
                                value={registroForm.confirmarPassword}
                                onChangeText={(text) => setRegistroForm({ ...registroForm, confirmarPassword: text })}
                                secureTextEntry={!mostrarConfirmarPassword}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />
                            <TouchableOpacity
                                onPress={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                                style={styles.eyeButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={mostrarConfirmarPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.termsContainer}>
                        <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                        <Text style={styles.termsText}>
                            Al registrarte, aceptas nuestros términos y condiciones
                        </Text>
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
                                <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={styles.botonIcon} />
                                <Text style={styles.textoBotonPrimario}>Crear cuenta</Text>
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
                        onPress={onSwitchToLogin}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.linkTexto}>
                            ¿Ya tienes cuenta? <Text style={styles.linkDestacado}>Inicia sesión</Text>
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        gap: 8,
    },
    termsText: {
        flex: 1,
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    botonPrimario: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
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

export default RegisterForm;