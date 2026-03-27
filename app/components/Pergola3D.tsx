"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type Props = {
  length: number;
  width: number;
  fields: number;
  slatCount: number;
};

export default function Pergola3D({
  length,
  width,
  fields,
  slatCount,
}: Props) {
  // המרות למטרים (three עובד במטרים)
  const L = length / 1000;
  const W = width / 1000;

  // פרופילים אמיתיים (במטרים)
  const frameWidth = 0.04;
  const frameHeight = 0.12;

  const divisionWidth = 0.04;

  const slatHeight = 0.02;
  const gap = 0.01;

  // חישובים
  const innerLength = L - frameWidth * 2;
  const divisions = fields - 1;

  const fieldLength =
    (innerLength - divisions * divisionWidth) / fields;

  const innerWidth = W - frameWidth * 2;

  return (
    <Canvas camera={{ position: [2, 2, 3] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} />

      <group rotation={[-Math.PI / 2, 0, 0]}>
        
        {/* ===== מסגרת ===== */}
        {/* קדמי */}
        <mesh position={[0, 0, W / 2 - frameWidth / 2]}>
          <boxGeometry args={[L, frameHeight, frameWidth]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* אחורי */}
        <mesh position={[0, 0, -W / 2 + frameWidth / 2]}>
          <boxGeometry args={[L, frameHeight, frameWidth]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* צד שמאל */}
        <mesh position={[-L / 2 + frameWidth / 2, 0, 0]}>
          <boxGeometry args={[frameWidth, frameHeight, W]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* צד ימין */}
        <mesh position={[L / 2 - frameWidth / 2, 0, 0]}>
          <boxGeometry args={[frameWidth, frameHeight, W]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* ===== חלוקות ===== */}
        {Array.from({ length: divisions }).map((_, i) => {
          const x =
            -L / 2 +
            frameWidth +
            fieldLength * (i + 1) +
            divisionWidth * i;

          return (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[divisionWidth, frameHeight, W]} />
              <meshStandardMaterial color="#555" />
            </mesh>
          );
        })}

        {/* ===== הצללות ===== */}
        {Array.from({ length: fields }).map((_, fieldIndex) => {
          const fieldStart =
            -L / 2 +
            frameWidth +
            fieldIndex * (fieldLength + divisionWidth);

          return Array.from({ length: slatCount }).map((_, i) => {
            const spacing = innerWidth / slatCount;

            return (
              <mesh
                key={`${fieldIndex}-${i}`}
                position={[
                  fieldStart + fieldLength / 2,
                  -frameHeight / 2 + slatHeight / 2,
                  -innerWidth / 2 + spacing * (i + 0.5),
                ]}
              >
                <boxGeometry
                  args={[
                    fieldLength,
                    slatHeight,
                    spacing - gap,
                  ]}
                />
                <meshStandardMaterial color="gray" />
              </mesh>
            );
          });
        })}
      </group>

      <OrbitControls />
    </Canvas>
  );
}
