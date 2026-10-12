import { WEAPON_MUZZLES } from './weaponMuzzles';
import React, { useEffect, useState } from 'react';
import './WeaponStructure.css';

// Visual-only PNG sprites. Combat rules, damage and target selection remain external.
export default function WeaponStructure({ weapon, enemy = false, active = false }) {
  const [firing, setFiring] = useState(false);
  const id = weapon?.id || '';
  useEffect(() => {
    let timer;
    const onFire = (event) => {
      if (event.detail?.weaponId !== id || Boolean(event.detail?.enemy) !== enemy) return;
      setFiring(false);
      requestAnimationFrame(() => setFiring(true));
      clearTimeout(timer);
      timer = setTimeout(() => setFiring(false), 650);
    };
    window.addEventListener('weapon-visual-fire', onFire);
    return () => { window.removeEventListener('weapon-visual-fire', onFire); clearTimeout(timer); };
  }, [id, enemy]);

  const base = `/assets/structures/${id}`;
  const muzzle = WEAPON_MUZZLES[id] || { x: 0.5, y: 0.25 };
  return (
    <span data-weapon-structure="true" className={`weapon-structure ${enemy ? 'weapon-structure-enemy' : ''} ${active ? 'weapon-structure-active' : ''} ${firing ? 'weapon-structure-firing' : ''}`}
      title={weapon?.name} aria-label={`Struttura ${weapon?.name}`} role="img">
      <span className="weapon-structure-png-frames" aria-hidden="true">
        {[0, 1, 2].map((frame) => (
          <img key={frame} className={`weapon-structure-frame weapon-structure-frame-${frame}`}
            src={`${base}_${frame}.png`} alt="" draggable="false" />
        ))}
      </span>
      <span className="weapon-muzzle-anchor" data-weapon-muzzle="true" style={{ '--muzzle-x': `${muzzle.x * 100}%`, left: `${muzzle.x * 100}%`, top: `${muzzle.y * 100}%` }} aria-hidden="true" />
    </span>
  );
}
