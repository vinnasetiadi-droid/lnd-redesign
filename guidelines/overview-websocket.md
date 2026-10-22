# Overview WebSocket & Real-time Communication

## Pengantar

Dokumen ini menjelaskan standar implementasi komunikasi real-time dalam aplikasi kita. Mengingat sifat interaktif dari aplikasi modern, kita membutuhkan saluran komunikasi dua arah yang persisten antara klien dan server. Kita menggunakan dua teknologi utama untuk kebutuhan ini:

1.  **Socket.io**: Untuk pertukaran pesan data umum (chat, notifikasi, status updates).
2.  **LiveKit**: Khusus untuk streaming media berkualitas tinggi (video/audio conferencing, screen sharing).

Pendekatan kita mengutamakan modularitas, _reusability_ melalui React Hooks, dan pengelolaan koneksi yang efisien untuk mencegah kebocoran memori (_memory leaks_).

---

## 1. Socket.io Pattern

Kita menggunakan **Socket.io Client** karena keandalannya dalam menangani _reconnection_, _fallback_ transport, dan kompatibilitas event-based.

### Arsitektur Hook (`useSimpleWebsocket`)

Alih-alih membuat koneksi socket secara manual di setiap komponen, kita membungkus logika koneksi ke dalam custom hook yang _reusable_. Hook ini bertanggung jawab atas siklus hidup koneksi: inisialisasi, otentikasi, _event listening_, dan pembersihan (_cleanup_).

**Lokasi File:** `src/hooks/useSimpleWebsocket.ts`

**Spesifikasi Teknis:**

- **Auto-connect**: Dimatikan secara default (`autoConnect: false`) untuk memberikan kontrol penuh kapan koneksi dimulai.
- **Authentication**: Mengirim token melalui objek `auth` saat _handshake_.
- **Transports**: Memprioritaskan `polling` lalu upgrade ke `websocket` untuk kompatibilitas jaringan maksimal, atau dipaksa `websocket` jika performa latensi sangat krusial.
- **Cleanup**: Wajib memutus koneksi (`disconnect`) saat komponen _unmount_ untuk mencegah koneksi gantung.

### Implementasi Hook

```typescript
import { io, Socket } from "socket.io-client";
import { useEffect, useState, useCallback, useRef } from "react";

// Tipe data payload untuk event join
interface JoinPayload {
  roomId?: string;
  userId?: string;
  [key: string]: unknown;
}

interface UseSimpleWebsocketProps {
  url?: string;
  token?: string;
  namespace?: string; // Opsional: untuk memisahkan logika socket
  joinPayload?: JoinPayload;
  onMessage?: (data: unknown) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
}

export function useSimpleWebsocket({
  url,
  token,
  namespace = "",
  joinPayload,
  onMessage,
  onError,
  onConnect,
}: UseSimpleWebsocketProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Ref untuk callback agar tidak memicu re-render/re-connect yang tidak perlu
  // jika fungsi handler berubah referensinya.
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
  }, [onMessage, onError]);

  useEffect(() => {
    const socketUrl = (url || import.meta.env.VITE_WS_URL) + namespace;
    const socketToken = token || localStorage.getItem("access_token");

    if (!socketUrl) {
      console.warn("Socket URL is missing");
      return;
    }

    const sio = io(socketUrl, {
      autoConnect: false, // Penting: kontrol manual
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["polling", "websocket"], // Fallback strategy
      auth: { token: socketToken },
    });

    // Setup Event Listeners
    sio.on("connect", () => {
      setIsConnected(true);
      if (joinPayload) {
        sio.emit("join", joinPayload);
      }
      onConnect?.();
    });

    sio.on("disconnect", () => {
      setIsConnected(false);
    });

    sio.on("connect_error", (err) => {
      onErrorRef.current?.(err.message);
    });

    // Event listener generik untuk pesan masuk
    // (Sesuaikan dengan event name dari backend, misal: 'message' atau 'chat:new')
    sio.on("message", (data) => {
      onMessageRef.current?.(data);
    });

    // Memulai koneksi
    sio.connect();
    setSocket(sio);

    // Cleanup Function
    return () => {
      sio.removeAllListeners();
      sio.disconnect();
    };
  }, [url, token, namespace, JSON.stringify(joinPayload)]); // Deep compare payload sederhana

  const emit = useCallback(
    (event: string, data: unknown) => {
      if (socket?.connected) {
        socket.emit(event, data);
      } else {
        console.warn("Socket not connected, cannot emit:", event);
      }
    },
    [socket]
  );

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setIsConnected(false);
    }
  }, [socket]);

  return { socket, isConnected, emit, disconnect };
}
```

### Contoh Penggunaan dalam Komponen

Pola penggunaan ini memisahkan logika koneksi dari UI, menjaga kode komponen tetap bersih.

```typescript
// src/pages/chat/components/ChatRoom.tsx
import { useState } from "react";
import { useSimpleWebsocket } from "@/hooks/useSimpleWebsocket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  const { isConnected, emit } = useSimpleWebsocket({
    namespace: "/chat",
    joinPayload: { roomId },
    onMessage: (data: any) => {
      setMessages((prev) => [...prev, data.text]);
    },
    onError: (err) => console.error("Socket error:", err),
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    emit("message", { text: inputText, roomId });
    setInputText("");
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="mb-2">
        Status:{" "}
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "Live" : "Offline"}
        </span>
      </div>

      <div className="h-64 overflow-y-auto mb-4 bg-gray-50 p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pesan..."
        />
        <Button onClick={handleSend} disabled={!isConnected}>
          Kirim
        </Button>
      </div>
    </div>
  );
}
```

---

## 2. LiveKit Pattern (Media Streaming)

Untuk fitur konferensi video atau audio, kita menggunakan **LiveKit**. Berbeda dengan socket.io yang mengirim pesan teks/JSON, LiveKit menangani streaming media binary (WebRTC) dengan arsitektur SFU (Selective Forwarding Unit) yang skalabel.

### Dependensi

Pastikan library berikut terinstal (sesuai `overview-dependencies.md`):

- `@livekit/components-react`
- `@livekit/components-styles`
- `livekit-client`

### Struktur Komponen LiveKit

Kita memisahkan logika room container dengan komponen kontrol video.

**1. LiveKit Room Wrapper**

Komponen ini bertugas menginisialisasi room dan menangani koneksi ke LiveKit Server.

```typescript
// src/pages/conference/components/LiveVideoRoom.tsx
import {
  LiveKitRoom,
  VideoConference,
  useTracks,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles"; // Import default styles

interface LiveVideoRoomProps {
  token: string; // Token JWT dari backend
  serverUrl?: string;
  connect?: boolean;
}

export function LiveVideoRoom({
  token,
  serverUrl,
  connect = true,
}: LiveVideoRoomProps) {
  const liveKitUrl = serverUrl || import.meta.env.VITE_LIVEKIT_URL;

  if (!token) return <div>Menyiapkan room...</div>;

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={liveKitUrl}
      connect={connect}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      {/* Komponen Pre-built untuk Video Conference lengkap */}
      <VideoConference />

      {/* Atau Custom Layout (lihat bagian Custom Layout di bawah) */}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
```

**2. Custom Layout (Opsional)**

Jika tidak ingin menggunakan `<VideoConference />` bawaan yang tampilannya generik, kita bisa membangun layout sendiri menggunakan hook `useTracks`.

```typescript
// src/pages/conference/components/CustomVideoGrid.tsx
import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";

export function CustomVideoGrid() {
  // Ambil semua track kamera dari partisipan lain
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {tracks.map((trackRef) => (
        <div
          key={trackRef.participant.identity}
          className="relative aspect-video bg-black rounded-lg overflow-hidden"
        >
          <VideoTrack
            trackRef={trackRef}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 rounded">
            {trackRef.participant.name}
          </div>
        </div>
      ))}
      \n{" "}
    </div>
  );
}
```

### Best Practices Real-time

1.  **Token Management**:
    - Jangan pernah generate token LiveKit di sisi client. Selalu minta token dari backend via API endpoint (misal: `/api/livekit/token`) sebelum merender komponen `<LiveKitRoom>`.
2.  **Connection Lifecycle**:
    - Pastikan untuk memutuskan koneksi socket/room saat pengguna menavigasi keluar halaman (handled by `useEffect` cleanup).
3.  **Error Handling**:
    - Selalu sediakan UI feedback saat koneksi terputus atau gagal (misal: _toast notification_ "Koneksi terputus, mencoba menghubungkan ulang...").
4.  **Network Resilience**:
    - Socket.io hook kita sudah mengaktifkan `reconnection: true`. Jangan ubah ini kecuali ada alasan spesifik.

---

Dengan mengikuti pola ini, kita memastikan fitur real-time dalam aplikasi dibangun dengan fondasi yang kokoh, mudah di-debug, dan konsisten dengan arsitektur React modern.
