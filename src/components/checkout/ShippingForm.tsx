/* Reference: ./DESIGN.md §4 Inputs & Buttons */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Mail, Phone, User } from 'lucide-react';
import { shippingSchema, type ShippingFormData } from '../../services/validationSchemas';
import { FormField } from '../ui/FormField';

const BTN_INSET =
  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px';

interface Props {
  onSubmit: (data: ShippingFormData) => void;
}

export function ShippingForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1c1c' }}>Datos de envío</h3>

      <FormField label="Nombre completo" icon={<User style={{ width: 13, height: 13 }} />} placeholder="María García" error={errors.fullName} {...register('fullName')} />
      <FormField label="Email" type="email" icon={<Mail style={{ width: 13, height: 13 }} />} placeholder="maria@ejemplo.com" error={errors.email} {...register('email')} />
      <FormField label="Teléfono" type="tel" icon={<Phone style={{ width: 13, height: 13 }} />} placeholder="+54 11 1234-5678" error={errors.phone} {...register('phone')} />
      <FormField label="Dirección" icon={<MapPin style={{ width: 13, height: 13 }} />} placeholder="Av. Corrientes 1234 3°B" error={errors.address} {...register('address')} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Ciudad" placeholder="Buenos Aires" error={errors.city} {...register('city')} />
        <FormField label="Provincia" placeholder="CABA" error={errors.province} {...register('province')} />
      </div>

      <FormField label="Código postal" placeholder="1043" error={errors.postalCode} {...register('postalCode')} />

      <button
        type="submit"
        style={{
          marginTop: '8px',
          padding: '10px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: '#fcfbf8',
          backgroundColor: '#1c1c1c',
          border: 'none',
          cursor: 'pointer',
          boxShadow: BTN_INSET,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Continuar al pago →
      </button>
    </form>
  );
}
