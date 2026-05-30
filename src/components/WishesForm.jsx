import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

const schema = z.object({
  sender_name: z.string().min(2, 'Vui lòng nhập tên'),
  message: z.string().min(5, 'Lời chúc tối thiểu 5 ký tự'),
  emoji: z.string().optional(),
});
const emotes = ['🎓', '💙', '✨', '🌸', '🎉'];

function formatTime(value) {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function WishesForm() {
  const [wishes, setWishes] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { emoji: '🎓' },
  });

  const selectedEmoji = watch('emoji');

  const loadWishes = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('wishes').select('*').order('created_at', { ascending: false }).limit(6);
    setWishes(data || []);
  };

  useEffect(() => {
    loadWishes();
  }, []);

  const onSubmit = async (values) => {
    if (!supabase) return toast.error('Thiếu cấu hình Supabase');
    const { error } = await supabase.from('wishes').insert(values);
    if (error) return toast.error(error.message);
    toast.success('Đã gửi lời chúc');
    reset({ emoji: '🎓' });
    loadWishes();
  };

  return (
    <section className="invite-card p-5">
      <h3 className="text-center font-script text-5xl text-[#1D5FD1]">Gửi lời chúc</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 grid gap-3">
        <input className="input" placeholder="Tên người gửi" {...register('sender_name')} />
        {errors.sender_name?.message && <p className="text-xs text-red-600">{errors.sender_name.message}</p>}
        <textarea className="input" rows="4" placeholder="Viết lời chúc đến OANH" {...register('message')} />
        {errors.message?.message && <p className="text-xs text-red-600">{errors.message.message}</p>}

        <div className="flex flex-wrap gap-2">
          {emotes.map((e) => {
            const selected = selectedEmoji === e;
            return (
              <button
                type="button"
                key={e}
                onClick={() => setValue('emoji', e, { shouldDirty: true })}
                className={`px-3 py-2 transition ${
                  selected
                    ? 'scale-105 border-2 border-[#1D5FD1] bg-white shadow-[0_0_0_2px_rgba(47,128,237,0.18)]'
                    : 'border border-[#8eb8d8] bg-[#eef8ff]'
                }`}
                aria-pressed={selected}
                aria-label={`Chọn icon ${e}`}
              >
                {e}
              </button>
            );
          })}
        </div>

        <button disabled={isSubmitting} className="invite-btn">
          {isSubmitting ? 'Đang gửi...' : 'Ấn gửi lời chúc của bạn'}
        </button>
      </form>

      <h4 className="mt-5 text-center font-script text-5xl text-[#1D5FD1]">Lời chúc của mọi người</h4>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {wishes.length === 0 && <p className="dashed-soft rounded-2xl p-6 text-center text-sm">Chưa có lời chúc nào, bạn là người đầu tiên nhé.</p>}
        {wishes.map((wish) => (
          <article
            key={wish.id}
            className="rounded-xl border border-white/80 bg-white/60 px-1.5 py-1.5 shadow-[0_8px_20px_rgba(29,95,209,0.08)] backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e7f4ff] text-lg ring-1 ring-white">
                  {wish.emoji || '💙'}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1c4e7d]">{wish.sender_name}</p>
                  <p className="text-xs text-[#6b8fae]">{formatTime(wish.created_at)}</p>
                </div>
              </div>
              <span className="text-xl text-[#9dc4e2]">❝</span>
            </div>

            <p className=" rounded-lg bg-[#eef8ff] px-2.5 py-2 text-sm leading-5 text-[#244f73]">
              {wish.message}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}







