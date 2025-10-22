// components/AudioPlayer.js

"use client"; // Permite o uso de Hooks

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = () => {
  // Estados
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Referência do Áudio
  const audioRef = useRef(null);
  
  // Efeito 1: Sincronização de VOLUME e MUTE (MANTIDO)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Função para Play/Pause (Lógica de reprodução movida para cá)
  const togglePlayPause = () => {
    const audio = audioRef.current;
    const shouldPlay = !isPlaying; 

    if (audio) {
      if (shouldPlay) {
        // Tenta tocar APENAS E EXCLUSIVAMENTE quando o usuário clica
        // Este é o método mais robusto contra o AbortError.
        audio.play().catch(error => {
            // Ignora o erro de autoplay e loga outros erros
            if (error.name !== 'NotAllowedError') {
                 console.error("Erro ao tentar tocar o áudio:", error);
            }
        });
      } else {
        // Pausa o áudio
        audio.pause();
      }
    }

    // Atualiza o estado
    setIsPlaying(shouldPlay);
  };
  
  // ****** NOTA IMPORTANTE: REMOVIDO O useEffect de [isPlaying] ******
  // A remoção elimina o último ponto onde o StrictMode poderia causar o AbortError.
  // *******************************************************************


  // Função para controlar o volume via slider
  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  // Função para Mute/Unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Ícones dinâmicos
  const PlayPauseIcon = isPlaying ? Pause : Play;
  const MuteUnmuteIcon = isMuted || volume === 0 ? VolumeX : Volume2;

  return (
    <div className="audio-player-container">
      <h1>Simulador de Controle de Áudio</h1>

      {/* Elemento de Áudio HTML5 */}
      <audio ref={audioRef} loop>
        <source src="/audio/sample.mp3" type="audio/mp3" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      <div className="controls">
        {/* Botão de Play e Pause */}
        <button onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"}>
          <PlayPauseIcon size={32} />
        </button>

        {/* Botão de Mute / Unmute */}
        <button onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
          <MuteUnmuteIcon size={32} />
        </button>

        {/* Controle de Volume (Slider) */}
        <div className="volume-control">
          <MuteUnmuteIcon size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            title={`Volume: ${Math.round(isMuted ? 0 : volume * 100)}%`}
          />
          <Volume2 size={20} />
          <span>{Math.round(isMuted ? 0 : volume * 100)}%</span>
        </div>
      </div>

      <style jsx>{`
        .audio-player-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          border: 1px solid #ccc;
          border-radius: 8px;
          max-width: 600px;
          margin: 50px auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          margin-bottom: 30px;
          font-size: 1.5rem;
        }
        .controls {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-top: 20px;
        }
        button {
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 50%;
          padding: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        button:hover {
          background: #005bb5;
        }
        .volume-control {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 250px;
        }
        .volume-control input[type="range"] {
          flex-grow: 1;
          -webkit-appearance: none;
          height: 8px;
          background: #ddd;
          border-radius: 5px;
          cursor: pointer;
        }
        .volume-control span {
            width: 40px;
            text-align: right;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;