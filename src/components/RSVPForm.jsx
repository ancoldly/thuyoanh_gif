import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

const schema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone: z.string().optional(),
  attendance_status: z.string().min(1, 'Vui lòng chọn trạng thái'),
  note: z.string().optional(),
});

export default function RSVPForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { attendance_status: 'Có, mình sẽ đến' },
  });

  const onSubmit = async (values) => {
    if (!supabase) return toast.error('Thiếu cấu hình Supabase');
    const payload = { ...values, guest_count: 0 };
    const { error } = await supabase.from('rsvps').insert(payload);
    if (error) return toast.error(error.message);
    toast.success('Đã xác nhận tham dự');
    reset({ attendance_status: 'Có, mình sẽ đến' });
  };

  return (
    <section className="invite-card p-5">
      <h3 className="text-center font-serif text-4xl">Xác nhận tham dự</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3">
        <input className="input" placeholder="Họ và tên" {...register('name')} />
        {errors.name?.message && <p className="text-xs text-red-600">{errors.name.message}</p>}
        <input className="input" placeholder="Số điện thoại" {...register('phone')} />
        <select className="input" {...register('attendance_status')}>
          <option>Có, mình sẽ đến</option>
          <option>Có thể</option>
          <option>Tiếc quá, mình không đến được</option>
        </select>
        <textarea className="input" rows="3" placeholder="Lời nhắn ngắn" {...register('note')} />
        <button disabled={isSubmitting} className="invite-btn">{isSubmitting ? 'Đang gửi...' : 'Gửi xác nhận'}</button>
      </form>
    </section>
  );
}
