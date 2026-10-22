# Overview Animation & Motion Guidelines

## Pengantar

Animasi dalam aplikasi kita bukan sekadar dekorasi, melainkan alat fungsional untuk meningkatkan *User Experience* (UX). Animasi memberikan konteks spasial, umpan balik interaksi, dan memandu perhatian pengguna.

Dalam ekosistem React + Vite ini, kita menggunakan dua pustaka utama dengan pembagian tanggung jawab yang jelas:
1.  **Framer Motion**: Untuk animasi UI deklaratif, transisi halaman, dan interaksi komponen standar.
2.  **GSAP (GreenSock Animation Platform)**: Untuk animasi sekuensial yang kompleks, manipulasi SVG berat, dan kinerja tinggi yang membutuhkan kontrol imperatif presisi.

---

## 1. Framer Motion (Primary UI Animation)

Framer Motion adalah pilihan *default* untuk 90% kebutuhan animasi antarmuka. Sifatnya yang "React-centric" dan deklaratif membuat kode lebih bersih dan mudah dibaca.

### Kapan Menggunakan Framer Motion?
- Animasi Entry/Exit elemen (Mount/Unmount).
- Interaksi sederhana (Hover, Tap, Drag).
- Layout animations (reordering list).
- Animasi berbasis scroll sederhana (Viewport).

### Basic Implementation

Gunakan komponen `motion` sebagai pengganti elemen HTML standar. Hindari mendefinisikan objek animasi di dalam render cycle; ekstrak ke luar komponen atau gunakan `useMemo` jika statis.

```typescript
import { motion } from "framer-motion";

export default function FadeInCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 bg-white rounded shadow"
    >
      <h3>Konten Teranimasi</h3>
    </motion.div>
  );
}
```

### Menggunakan Variants (Best Practice)

Untuk orkestrasi animasi (seperti *staggering* anak elemen), **wajib** menggunakan pola `variants`. Ini memisahkan logika animasi dari struktur JSX, membuat kode lebih rapi dan *reusable*.

```typescript
import { motion } from "framer-motion";

// Definisi varian di luar komponen
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren", // Parent animasi dulu
      staggerChildren: 0.1,   // Delay antar children
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function StaggeredMenu() {
  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {[1, 2, 3].map((id) => (
        <motion.li key={id} variants={itemVariants} className="bg-gray-100 p-2">
          Item Menu {id}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

---

## 2. GSAP (Advanced & Timeline Animation)

GSAP digunakan ketika Framer Motion menyentuh batasnya, terutama untuk animasi yang membutuhkan kontrol waktu presisi (timeline), manipulasi atribut DOM non-CSS (seperti SVG paths), atau animasi berkinerja tinggi yang kompleks.

### Kapan Menggunakan GSAP?
- Animasi *chaining* yang kompleks (Timeline).
- Manipulasi SVG Path (Morphing, Drawing).
- Animasi Canvas/WebGL.
- Scroll-linked animations yang sangat presisi (ScrollTrigger).

### Integrasi GSAP di React

Karena GSAP bersifat imperatif (memanipulasi DOM langsung), kita harus berhati-hati dengan siklus hidup React (`useEffect`). **Penting:** Selalu lakukan *cleanup* (`.kill()`) untuk mencegah *memory leaks* atau animasi ganda, terutama di React 18 Strict Mode.

#### Basic GSAP Ref Pattern

```typescript
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function GsapBox() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pastikan ref ada
    if (!boxRef.current) return;

    // Simpan tween dalam variabel untuk cleanup
    const tween = gsap.to(boxRef.current, {
      duration: 1,
      x: 100,
      rotation: 360,
      ease: "power2.out",
    });

    // Cleanup wajib!
    return () => {
      tween.kill();
    };
  }, []);

  return <div ref={boxRef} className="w-20 h-20 bg-blue-500" />;
}
```

#### GSAP Timeline

Timeline adalah fitur terkuat GSAP. Gunakan ini untuk menyusun urutan animasi tanpa harus menghitung delay manual ("callback hell").

```typescript
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function IntroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
    })
    .from(buttonRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
    }, "-=0.5"); // Overlap 0.5 detik dengan animasi sebelumnya

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <h1 ref={titleRef}>Welcome</h1>
      <button ref={buttonRef}>Start</button>
    </div>
  );
}
```

#### SVG Manipulation (Path Animation)

Contoh kasus di mana GSAP jauh lebih unggul daripada CSS atau Framer Motion adalah interpolasi atribut string kompleks seperti `d` path pada SVG.

```typescript
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function BlobMorph() {
  const pathRef = useRef<SVGPathElement>(null);
  
  // Path data
  const pathA = "M10,10 L90,10 L90,90 L10,90 Z"; // Kotak
  const pathB = "M50,10 L90,50 L50,90 L10,50 Z"; // Diamond

  useEffect(() => {
    if (!pathRef.current) return;

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { duration: 1.5, ease: "elastic.out(1, 0.3)" }
    });

    tl.to(pathRef.current, {
      attr: { d: pathB }, // Interpolasi atribut 'd'
      fill: "#ff0000"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32">
      <path ref={pathRef} d={pathA} fill="#0000ff" />
    </svg>
  );
}
```

---

## 3. Performance & Best Practices

### Gunakan Properti "Cheap"
Browser paling efisien menganimasikan properti yang tidak memicu *Layout* atau *Paint* ulang.
- **Good:** `transform` (translate, scale, rotate), `opacity`.
- **Bad:** `width`, `height`, `top`, `left`, `margin`.

### Lazy Loading Motion (Framer Motion)
Untuk mengurangi ukuran bundle awal, gunakan fitur `LazyMotion` dari Framer Motion jika aplikasi memiliki banyak animasi berat.

```typescript
import { LazyMotion, domAnimation, m } from "framer-motion";

// Gunakan 'm' sebagai pengganti 'motion'
<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

### Aksesibilitas (Reduced Motion)
Selalu hormati preferensi pengguna yang mematikan animasi (*prefers-reduced-motion*).

**Framer Motion:**
```typescript
import { motion, useReducedMotion } from "framer-motion";

function AccessibleComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ 
        x: shouldReduceMotion ? 0 : 100, // Matikan gerakan jika user minta
        opacity: 1 
      }} 
    />
  );
}
```

**GSAP:**
Gunakan `gsap.matchMedia()` untuk menangani *reduced motion*.

```typescript
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Animasi normal hanya berjalan jika user TIDAK meminta reduced motion
  gsap.to(ref.current, { x: 100 });
});
```