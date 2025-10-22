// app/page.jsx

// Caminho de importação para o componente de áudio (correto para a sua estrutura)
import AudioPlayer from '../components/AudioPlayer';

// Função para o componente da página principal (Server Component)
export default function Home() {
  return (
    <main>
      {/* Renderiza o componente de controle de áudio */}
      <AudioPlayer />
    </main>
  );
}