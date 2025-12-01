import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../../contexto/CarritoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalLoginOInvitado from '../../componentes/05_modales/ModalLoginOInvitado';

const Carrito = ({ navigation }) => {
  const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, obtenerTotal } = useCarrito();
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Inicio');
        return true;
      }
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const usuarioString = await AsyncStorage.getItem('usuario');
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          setUsuarioActivo(usuario);
        }
      } catch (e) {
        console.error('Error al cargar usuario:', e);
      }
    };
    cargarUsuario();
  }, []);

  const handleEliminar = (producto) => {
    Alert.alert(
      'Eliminar producto',
      `¿Deseas eliminar "${producto.nombre}" del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => eliminarDelCarrito(producto.id),
          style: 'destructive'
        }
      ]
    );
  };

  const handleVaciar = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de eliminar todos los productos del carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Vaciar todo',
          onPress: vaciarCarrito,
          style: 'destructive'
        }
      ]
    );
  };

  const paddingTopHeader = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 24) + 8
    : 48;

  const handleProcederPago = () => {
    if (!usuarioActivo) {
      setMostrarModalLogin(true);
    } else {
      navigation.navigate('ConfirmacionCompra');
    }
  };

  const handleIniciarSesion = () => {
    setMostrarModalLogin(false);
    navigation.navigate('Perfil');
  };

  const handleContinuarInvitado = () => {
    setMostrarModalLogin(false);
    navigation.navigate('ConfirmacionCompra');
  };

  if (carrito.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: paddingTopHeader }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Inicio')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Mi Carrito</Text>
            <Text style={styles.headerSubtitle}>Revisa tus productos antes de pagar</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
            <Text style={styles.headerBadgeText}>0</Text>
          </View>
        </View>

        {/* Estado vacío más premium */}
        <View style={styles.vacio}>
          <View style={styles.vacioIconContainerOuter}>
            <View style={styles.vacioIconContainer}>
              <Ionicons name="cart-outline" size={56} color="#9CA3AF" />
            </View>
          </View>
          <Text style={styles.textoVacio}>Tu carrito está vacío</Text>
          <Text style={styles.subtextoVacio}>
            Explora nuestras categorías y encuentra productos ideales para ti.
          </Text>
          <TouchableOpacity
            style={styles.botonVacio}
            onPress={() => navigation.navigate('Inicio')}
            activeOpacity={0.85}
          >
            <Ionicons name="storefront-outline" size={20} color="#FFF" />
            <Text style={styles.textoBotonVacio}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.item, index === 0 && styles.itemFirst]}>
      <View style={styles.imagenWrapper}>
        <Image
          source={{
            uri: item.imagen || 'https://via.placeholder.com/100/f0f0f0/999999?text=Sin+Imagen'
          }}
          style={styles.imagen}
        />
      </View>

      <View style={styles.info}>
        <View>
          <Text style={styles.nombre} numberOfLines={2}>{item.nombre}</Text>
          <Text style={styles.precioUnitario}>S/ {parseFloat(item.precio).toFixed(2)} c/u</Text>

          {/* Indicador de stock máximo */}
          {item.cantidad >= item.stock && (
            <View style={styles.stockAlert}>
              <Ionicons name="alert-circle" size={13} color="#F59E0B" />
              <Text style={styles.stockMaximo}>Cantidad máxima disponible</Text>
            </View>
          )}
        </View>

        {/* Controles de cantidad */}
        <View style={styles.cantidadRow}>
          <View style={styles.cantidadContainer}>
            <TouchableOpacity
              style={[styles.botonCantidad, item.cantidad <= 1 && styles.botonCantidadDisabled]}
              onPress={() => actualizarCantidad(item.id, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              activeOpacity={0.7}
            >
              <Ionicons
                name="remove"
                size={18}
                color={item.cantidad <= 1 ? "#9CA3AF" : "#FFF"}
              />
            </TouchableOpacity>

            <View style={styles.cantidadBadge}>
              <Text style={styles.cantidad}>{item.cantidad}</Text>
            </View>

            <TouchableOpacity
              style={[styles.botonCantidad, item.cantidad >= item.stock && styles.botonCantidadDisabled]}
              onPress={() => actualizarCantidad(item.id, item.cantidad + 1)}
              disabled={item.cantidad >= item.stock}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={18}
                color={item.cantidad >= item.stock ? "#9CA3AF" : "#FFF"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.derecha}>
        <Text style={styles.subtotalLabel}>Subtotal</Text>
        <Text style={styles.subtotal}>
          S/ {(parseFloat(item.precio) * item.cantidad).toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => handleEliminar(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header mejorado */}
      <View style={[styles.header, { paddingTop: paddingTopHeader }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Inicio')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mi Carrito</Text>
          <Text style={styles.headerSubtitle}>
            {carrito.length === 1 ? '1 producto seleccionado' : `${carrito.length} productos seleccionados`}
          </Text>
        </View>

        <View style={styles.headerBadge}>
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
          <Text style={styles.headerBadgeText}>{carrito.length}</Text>
        </View>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listaHeader}>
            <Text style={styles.listaHeaderTexto}>
              Resumen de tu carrito
            </Text>
            <TouchableOpacity
              onPress={handleVaciar}
              activeOpacity={0.7}
            >
              <View style={styles.vaciarWrapper}>
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                <Text style={styles.vaciarLink}>Vaciar todo</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Footer con resumen y acciones */}
      <View style={styles.footer}>
        {/* Línea de agarre tipo sheet */}
        <View style={styles.footerHandle} />

        {/* Resumen de costos */}
        <View style={styles.resumenContainer}>
          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Subtotal</Text>
            <Text style={styles.resumenValor}>S/ {obtenerTotal().toFixed(2)}</Text>
          </View>

          <View style={styles.resumenRow}>
            <View style={styles.envioContainer}>
              <Ionicons name="rocket-outline" size={16} color="#10B981" />
              <Text style={styles.resumenLabel}>Envío estimado</Text>
            </View>
            <Text style={styles.resumenEnvio}>GRATIS</Text>
          </View>

          <View style={styles.dividerFooter} />

          <View style={styles.resumenRow}>
            <View>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalHint}>Impuestos incluidos donde aplique</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalMoneda}>S/</Text>
              <Text style={styles.totalValor}>{obtenerTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Botón de compra */}
        <TouchableOpacity
          style={styles.botonComprar}
          onPress={handleProcederPago}
          activeOpacity={0.9}
        >
          <View style={styles.botonComprarContent}>
            <View style={styles.botonIconBadge}>
              <Ionicons name="lock-closed" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.textoComprar}>Proceder al pago</Text>
              <Text style={styles.textoComprarSub}>Pago seguro en pocos pasos</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Modal Login o Invitado */}
      <ModalLoginOInvitado
        visible={mostrarModalLogin}
        onClose={() => setMostrarModalLogin(false)}
        onIniciarSesion={handleIniciarSesion}
        onContinuarInvitado={handleContinuarInvitado}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    gap: 4,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Estado vacío
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  vacioIconContainerOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  vacioIconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoVacio: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtextoVacio: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 21,
  },
  botonVacio: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  textoBotonVacio: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Lista
  lista: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  listaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  listaHeaderTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  vaciarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vaciarLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },

  // Item
  item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemFirst: {
    borderColor: '#3B82F6',
    borderWidth: 1.4,
  },
  imagenWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 10,
  },
  imagen: {
    width: 96,
    height: 96,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
  },
  info: {
    flex: 1,
    marginLeft: 2,
    justifyContent: 'space-between',
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
    lineHeight: 20,
  },
  precioUnitario: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  stockAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: 2,
    gap: 4,
  },
  stockMaximo: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },

  cantidadRow: {
    marginTop: 6,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botonCantidad: {
    width: 30,
    height: 30,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonCantidadDisabled: {
    backgroundColor: '#E5E7EB',
  },
  cantidadBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cantidad: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  derecha: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  subtotalLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  botonEliminar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  // Footer
  footer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 22 : 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  footerHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },
  resumenContainer: {
    marginBottom: 14,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumenLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  resumenValor: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  envioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resumenEnvio: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
  },
  dividerFooter: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalMoneda: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 3,
  },
  totalValor: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  botonComprar: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
  },
  botonComprarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botonIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoComprar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  textoComprarSub: {
    color: 'rgba(249, 250, 251, 0.8)',
    fontSize: 11,
  },
});

export default Carrito;