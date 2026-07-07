// frontend/components/Card.tsx
import React from 'react';
export default function Card({ children, className = '' }: any) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}
