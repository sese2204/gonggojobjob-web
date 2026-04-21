import { useState, useRef, useEffect } from 'react';

export default function RippleButton({ children, onClick, className = '', style, disabled, type = 'button', ...rest }) {
  const [ripples, setRipples] = useState([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 30;
    const y = e.clientY - rect.top - 30;
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => {
      if (mountedRef.current) {
        setRipples((r) => r.filter((r2) => r2.id !== id));
      }
    }, 600);
    onClick?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      style={style}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-ring"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </button>
  );
}
