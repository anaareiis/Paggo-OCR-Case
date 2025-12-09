// frontend/components/Button.tsx
import React from 'react';

export default function Button({ children, className = '', variant = 'default', ...rest }: any) {
  const base = 'btn';
  const cls = variant === 'primary' ? `${base} btn-primary` : variant === 'ghost' ? `${base} ghost` : `${base} ${className}`;
  return <button className={cls} {...rest}>{children}</button>;
}
