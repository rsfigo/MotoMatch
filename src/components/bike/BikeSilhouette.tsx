import type { ReactNode } from 'react';
import type { Category } from '@/data/schema';
import { cn } from '@/lib/cn';

/**
 * Generische Motorrad-Silhouetten als Platzhalter (keine Herstellerfotos, keine Logos).
 * Seitenansicht, Fahrtrichtung nach rechts. Farben kommen aus den Design-Tokens,
 * damit die Grafik im hellen und dunklen Theme passt.
 */

type Shape = 'naked' | 'sport' | 'adventure' | 'retro' | 'scooter';

const SHAPE_BY_CATEGORY: Record<Category, Shape> = {
  naked: 'naked',
  supermoto: 'naked',
  supersport: 'sport',
  sport: 'sport',
  touring: 'adventure',
  adventure: 'adventure',
  enduro: 'adventure',
  retro: 'retro',
  cruiser: 'retro',
  scooter: 'scooter',
};

const BODY = 'fill-silhouette';
const DETAIL = 'fill-silhouette-detail';
const DETAIL_STROKE = 'fill-none stroke-silhouette-detail';

function Wheel({
  cx,
  cy,
  r = 55,
  spokes = false,
  disc = false,
}: {
  cx: number;
  cy: number;
  r?: number;
  spokes?: boolean;
  disc?: boolean;
}) {
  const rim = r - 11;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} strokeWidth={14} className="fill-none stroke-silhouette" />
      <circle cx={cx} cy={cy} r={rim} strokeWidth={3} className={DETAIL_STROKE} />
      {spokes &&
        Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return (
            <line
              key={index}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * rim}
              y2={cy + Math.sin(angle) * rim}
              strokeWidth={1.5}
              className="stroke-silhouette-detail"
            />
          );
        })}
      {disc && <circle cx={cx} cy={cy} r={rim * 0.62} strokeWidth={4} className={DETAIL_STROKE} />}
      <circle cx={cx} cy={cy} r={9} className={DETAIL} />
    </g>
  );
}

function Naked() {
  return (
    <>
      <Wheel cx={112} cy={200} />
      <Wheel cx={366} cy={200} disc />
      {/* Schwinge */}
      <path d="M106 194 L216 170 L224 184 L114 208 Z" className={BODY} />
      {/* Heckrahmen */}
      <path
        d="M118 126 L210 168"
        strokeWidth={6}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      {/* Motor */}
      <path
        d="M194 150 L268 142 Q286 142 288 158 L290 196 Q290 214 272 214 L214 214 Q196 214 194 198 Z"
        className={BODY}
      />
      <path d="M244 144 L278 104 L306 118 L284 152 Z" className={BODY} />
      <path
        d="M210 166 L276 160 M210 182 L278 176 M212 198 L278 194"
        strokeWidth={2.5}
        className={DETAIL_STROKE}
      />
      {/* Kühler */}
      <path d="M292 120 L312 118 L316 176 L298 182 Z" className={DETAIL} />
      {/* Rahmen */}
      <path d="M318 84 L334 98 L238 178 L218 170 Z" className={BODY} />
      {/* Tank */}
      <path
        d="M200 120 C206 88 262 72 320 84 L326 104 C294 118 248 126 204 130 Z"
        className={BODY}
      />
      <path
        d="M232 98 C258 88 290 86 312 90"
        strokeWidth={3}
        strokeLinecap="round"
        className={DETAIL_STROKE}
      />
      {/* Sitzbank und Heck */}
      <path
        d="M110 116 C142 106 184 108 208 118 L206 130 C178 132 142 132 114 128 Z"
        className={BODY}
      />
      <path d="M110 116 L70 100 L76 114 L114 128 Z" className={BODY} />
      {/* Gabel */}
      <path
        d="M366 200 L328 96"
        strokeWidth={12}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      {/* Scheinwerfer und Lenker */}
      <circle cx={340} cy={108} r={14} className={DETAIL} />
      <path
        d="M322 86 L312 66 L290 60"
        strokeWidth={6}
        strokeLinecap="round"
        className="fill-none stroke-silhouette"
      />
      {/* Kotflügel vorne */}
      <path
        d="M334 150 C348 136 380 136 398 150"
        strokeWidth={6}
        strokeLinecap="round"
        className={DETAIL_STROKE}
      />
      {/* Auspuff unter dem Motor */}
      <path
        d="M204 214 L288 214 Q300 214 298 226 L296 232 L212 234 Q198 232 204 214 Z"
        className={DETAIL}
      />
    </>
  );
}

function Sport() {
  return (
    <>
      <Wheel cx={112} cy={200} />
      <Wheel cx={366} cy={200} disc />
      <path d="M106 194 L216 170 L224 184 L114 208 Z" className={BODY} />
      {/* Verkleidung */}
      <path
        d="M194 150 C198 124 238 106 300 98 C332 94 356 102 374 118 C382 126 380 138 370 146 L332 172 C300 196 252 210 216 208 C198 206 190 190 194 150 Z"
        className={BODY}
      />
      <path
        d="M228 150 C262 142 300 140 340 132"
        strokeWidth={3}
        strokeLinecap="round"
        className={DETAIL_STROKE}
      />
      <path d="M252 180 L300 168 L296 186 L256 194 Z" className={DETAIL} />
      {/* Scheibe */}
      <path
        d="M316 100 C326 86 342 80 360 80 L364 88 C350 90 340 98 332 108 Z"
        className={DETAIL}
      />
      {/* Tank */}
      <path
        d="M206 118 C222 94 272 86 308 94 L302 110 C270 116 238 120 208 126 Z"
        className={BODY}
      />
      {/* Sitz und hohes Heck */}
      <path
        d="M114 112 C150 104 186 108 210 116 L206 126 C172 128 142 128 118 124 Z"
        className={BODY}
      />
      <path d="M114 112 L66 92 L76 108 L118 124 Z" className={BODY} />
      {/* Gabel und Stummellenker */}
      <path
        d="M366 200 L334 112"
        strokeWidth={12}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      <path
        d="M318 100 L300 96"
        strokeWidth={6}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      {/* Kotflügel und Auspuff */}
      <path
        d="M336 150 C350 136 382 136 400 150"
        strokeWidth={6}
        strokeLinecap="round"
        className={DETAIL_STROKE}
      />
      <path d="M150 168 L208 186 L204 200 L146 182 Z" className={DETAIL} />
    </>
  );
}

function Adventure() {
  return (
    <>
      <Wheel cx={108} cy={200} r={54} spokes />
      <Wheel cx={372} cy={196} r={60} spokes disc />
      <path d="M102 194 L214 166 L222 180 L110 208 Z" className={BODY} />
      {/* Motor mit seitlichem Zylinder */}
      <path
        d="M196 140 L270 134 Q288 134 290 152 L292 192 Q292 210 274 210 L216 210 Q198 210 196 194 Z"
        className={BODY}
      />
      <path
        d="M262 166 L322 160 Q330 160 330 168 L330 184 Q330 192 322 192 L266 196 Z"
        className={BODY}
      />
      <path d="M296 164 L296 190 M310 162 L310 190" strokeWidth={2.5} className={DETAIL_STROKE} />
      {/* Unterfahrschutz */}
      <path d="M210 214 L298 206 L302 218 L216 226 Z" className={DETAIL} />
      {/* Rahmen und Tank */}
      <path d="M314 74 L332 88 L238 176 L218 168 Z" className={BODY} />
      <path
        d="M194 108 C202 74 262 58 320 70 L328 108 C292 120 240 126 198 128 Z"
        className={BODY}
      />
      <path
        d="M226 86 C256 74 292 72 314 76"
        strokeWidth={3}
        strokeLinecap="round"
        className={DETAIL_STROKE}
      />
      {/* Sitz und Gepäckträger */}
      <path
        d="M100 102 C138 92 180 96 204 106 L202 120 C170 122 134 122 104 118 Z"
        className={BODY}
      />
      <path d="M100 102 L74 98 L76 112 L104 118 Z" className={BODY} />
      <path
        d="M76 92 L112 94"
        strokeWidth={5}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      {/* Lange Gabel, Schnabel, Cockpit und hohe Scheibe */}
      <path
        d="M372 196 L336 82"
        strokeWidth={12}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      <path d="M326 122 L394 128 L390 142 L326 138 Z" className={BODY} />
      <path d="M300 78 L340 66 L354 108 L318 120 Z" className={BODY} />
      <path d="M332 68 L352 28 L366 32 L350 72 Z" className={DETAIL} />
      <path
        d="M318 72 L302 52 L280 50"
        strokeWidth={6}
        strokeLinecap="round"
        className="fill-none stroke-silhouette"
      />
      {/* Auspuff seitlich hoch */}
      <path d="M126 150 L196 166 L192 182 L122 166 Z" className={DETAIL} />
    </>
  );
}

function Retro() {
  return (
    <>
      <Wheel cx={112} cy={200} spokes />
      <Wheel cx={366} cy={200} spokes disc />
      <path d="M106 194 L214 172 L222 186 L114 208 Z" className={BODY} />
      {/* Luftgekühlter Motor mit Kühlrippen */}
      <path
        d="M196 150 L270 144 Q286 144 288 160 L290 196 Q290 214 272 214 L214 214 Q196 214 194 198 Z"
        className={BODY}
      />
      <path d="M232 146 L276 112 L298 124 L270 156 Z" className={BODY} />
      <path
        d="M244 140 L284 116 M250 148 L290 124 M258 154 L294 132"
        strokeWidth={2.5}
        className={DETAIL_STROKE}
      />
      {/* Doppelschleifenrahmen */}
      <path
        d="M322 92 L296 206"
        strokeWidth={7}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      <path d="M318 86 L332 98 L236 178 L218 170 Z" className={BODY} />
      {/* Tropfen-Tank und flache Sitzbank */}
      <path d="M204 112 C212 82 296 74 322 96 C312 118 254 126 210 126 Z" className={BODY} />
      <path
        d="M226 102 C254 92 286 90 306 96"
        strokeWidth={3}
        strokeLinecap="round"
        className={DETAIL_STROKE}
      />
      <path d="M100 112 L210 112 L208 126 L104 128 Z" className={BODY} />
      <path
        d="M84 124 C94 106 124 100 146 108"
        strokeWidth={6}
        strokeLinecap="round"
        className="fill-none stroke-silhouette"
      />
      {/* Gabel, runder Scheinwerfer, hoher Lenker */}
      <path
        d="M366 200 L328 98"
        strokeWidth={11}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      <circle cx={342} cy={106} r={16} className={DETAIL} />
      <path
        d="M322 90 L316 64 L290 58"
        strokeWidth={6}
        strokeLinecap="round"
        className="fill-none stroke-silhouette"
      />
      <path
        d="M334 150 C348 136 380 136 398 150"
        strokeWidth={6}
        strokeLinecap="round"
        className={DETAIL_STROKE}
      />
      {/* Zwei lange Auspuffrohre */}
      <path
        d="M210 206 L86 214"
        strokeWidth={8}
        strokeLinecap="round"
        className="stroke-silhouette-detail"
      />
      <path
        d="M212 194 L92 200"
        strokeWidth={8}
        strokeLinecap="round"
        className="stroke-silhouette-detail"
      />
    </>
  );
}

function Scooter() {
  return (
    <>
      <Wheel cx={130} cy={214} r={44} />
      <Wheel cx={352} cy={214} r={44} disc />
      {/* Trittbrett und Verkleidung */}
      <path d="M150 178 L300 178 L306 198 L156 204 Z" className={BODY} />
      <path
        d="M96 150 C110 112 176 104 214 116 L218 178 L150 186 C120 186 100 172 96 150 Z"
        className={BODY}
      />
      <path
        d="M118 112 C150 98 192 100 214 110 L212 122 C186 116 150 116 120 124 Z"
        className={DETAIL}
      />
      {/* Front mit Beinschild */}
      <path
        d="M288 178 C290 140 300 96 318 70 L338 74 C330 112 330 150 340 186 Z"
        className={BODY}
      />
      <path d="M314 72 L328 44 L344 48 L334 76 Z" className={DETAIL} />
      <path
        d="M352 214 L326 120"
        strokeWidth={10}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
      <path
        d="M318 66 L296 58"
        strokeWidth={6}
        strokeLinecap="round"
        className="stroke-silhouette"
      />
    </>
  );
}

const SHAPES: Record<Shape, () => ReactNode> = {
  naked: Naked,
  sport: Sport,
  adventure: Adventure,
  retro: Retro,
  scooter: Scooter,
};

interface BikeSilhouetteProps {
  category: Category;
  className?: string;
}

/** Rein dekorativ – der Name des Bikes steht immer als Text daneben. */
export function BikeSilhouette({ category, className }: BikeSilhouetteProps) {
  const Shape = SHAPES[SHAPE_BY_CATEGORY[category]];
  return (
    <svg viewBox="40 10 400 268" aria-hidden="true" className={cn('h-auto w-full', className)}>
      <Shape />
    </svg>
  );
}
