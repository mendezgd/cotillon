/* Reference: ./DESIGN.md — max content width ~1200px, centered */
import type { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Container({ children, style, className }: Props) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: '1152px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
