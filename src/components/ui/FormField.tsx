/* Reference: ./DESIGN.md §4 Inputs */
import type { InputHTMLAttributes, ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  icon?: ReactNode;
}

export function FormField({ label, error, icon, ...props }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        <input
          {...props}
          style={{
            width: '100%',
            padding: icon ? '10px 12px 10px 36px' : '10px 12px',
            fontSize: '14px',
            color: 'var(--text)',
            backgroundColor: 'var(--bg)',
            border: `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'var(--border)'}`,
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            ...props.style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.8)' : 'var(--border-act)';
            e.currentTarget.style.boxShadow = 'var(--focus-shadow)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.6)' : 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
        />
      </div>
      {error && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)' }}>{error.message}</p>}
    </div>
  );
}
