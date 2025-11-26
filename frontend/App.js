import { StatusBar } from 'expo-status-bar';
import { CarritoProvider } from './app/contexto/CarritoContext';
import { FavoritosProvider } from './app/contexto/FavoritosContext';
import NavegacionSimple from './app/NavegacionSimple';

export default function App() {
  return (
    <CarritoProvider>
      <FavoritosProvider>
        <NavegacionSimple />
        <StatusBar style="auto" />
      </FavoritosProvider>
    </CarritoProvider>
  );
}
