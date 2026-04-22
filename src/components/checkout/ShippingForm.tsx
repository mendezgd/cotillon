/* Reference: ./DESIGN.md §4 Inputs & Buttons */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Mail, Phone, User, CreditCard } from 'lucide-react';
import { shippingSchema, type ShippingFormData } from '../../services/validationSchemas';
import { PROVINCES } from '../../services/argentina';
import { FormField } from '../ui/FormField';

interface Props { onSubmit: (data: ShippingFormData) => void }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', borderRadius: '6px', fontSize: '13px',
  color: 'var(--text)', backgroundColor: 'var(--bg)',
  border: '1px solid var(--border)', outline: 'none',
  transition: 'border-color 0.15s', appearance: 'none',
  fontFamily: 'inherit',
};

export function ShippingForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Datos de entrega</h3>

      <FormField
        label="Nombre completo"
        icon={<User style={{ width: 13, height: 13 }} />}
        placeholder="María García"
        error={errors.fullName}
        {...register('fullName')}
      />

      <FormField
        label="DNI"
        icon={<CreditCard style={{ width: 13, height: 13 }} />}
        placeholder="12345678"
        inputMode="numeric"
        maxLength={8}
        error={errors.dni}
        {...register('dni')}
      />

      <FormField
        label="Email"
        type="email"
        icon={<Mail style={{ width: 13, height: 13 }} />}
        placeholder="maria@ejemplo.com"
        error={errors.email}
        {...register('email')}
      />

      <FormField
        label="Teléfono (con código de área)"
        type="tel"
        icon={<Phone style={{ width: 13, height: 13 }} />}
        placeholder="11 1234-5678"
        error={errors.phone}
        {...register('phone')}
      />

      <FormField
        label="Dirección (calle, número, piso/depto)"
        icon={<MapPin style={{ width: 13, height: 13 }} />}
        placeholder="Av. Corrientes 1234 3°B"
        error={errors.address}
        {...register('address')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FormField label="Ciudad / Localidad" placeholder="Buenos Aires" error={errors.city} {...register('city')} />
        <FormField label="Código postal" placeholder="1043" maxLength={8} error={errors.postalCode} {...register('postalCode')} />
      </div>

      {/* Province select */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Provincia</label>
        <select
          {...register('province')}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-act)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <option value="">Seleccioná tu provincia…</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.province && (
          <p style={{ fontSize: '11px', color: 'rgb(220,38,38)', marginTop: '2px' }}>
            {errors.province.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        style={{
          marginTop: '6px', padding: '11px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          color: 'var(--action-text)', backgroundColor: 'var(--action-bg)',
          border: 'none', cursor: 'pointer', boxShadow: 'var(--btn-shadow)', transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Continuar al pago →
      </button>
    </form>
  );
}
