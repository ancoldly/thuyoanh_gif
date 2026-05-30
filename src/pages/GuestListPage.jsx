import { useEffect, useState } from 'react';
import { CircleCheck, MessageCircleMore, Phone, UserRound } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function GuestListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setError('Thiếu cấu hình Supabase');
        setLoading(false);
        return;
      }
      const { data, error: e } = await supabase.from('rsvps').select('*').order('created_at', { ascending: false });
      if (e) setError(e.message);
      else setItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section className="invite-card p-5">
      <h1 className="font-serif text-4xl text-[#1D5FD1]">Danh sách xác nhận tham gia lễ tốt nghiệp</h1>
      {loading && <p className="mt-3 text-[#2a4f73]">Đang tải dữ liệu...</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="mt-3 text-[#2a4f73]">Chưa có ai xác nhận tham gia.</p>}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="mt-4 grid gap-3 md:hidden">
            {items.map((row) => (
              <article key={row.id} className="rounded-2xl border border-[#b7d8ee] bg-white/70 p-3 shadow-[0_6px_16px_rgba(29,95,209,0.08)]">
                <div className="space-y-2 text-[#244f73]">
                  <div className="flex items-center gap-2 text-[15px]"><UserRound size={16} className="text-[#1D5FD1]" /><span>{row.name}</span></div>
                  <div className="flex items-center gap-2 text-[15px]"><Phone size={16} className="text-[#1D5FD1]" /><span>{row.phone || '-'}</span></div>
                  <div className="flex items-center gap-2 text-[15px]"><CircleCheck size={16} className="text-[#1D5FD1]" /><span>{row.attendance_status}</span></div>
                  <div className="flex items-start gap-2 text-[15px]"><MessageCircleMore size={16} className="mt-0.5 text-[#1D5FD1]" /><span>{row.note || '-'}</span></div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full border-collapse border border-[#b7d8ee] bg-[#eef8ff] text-sm">
              <thead>
                <tr className="bg-[#dff1ff] text-left text-[#1D5FD1]">
                  <th className="border border-[#b7d8ee] px-3 py-2">Họ tên</th>
                  <th className="border border-[#b7d8ee] px-3 py-2">SĐT</th>
                  <th className="border border-[#b7d8ee] px-3 py-2">Trạng thái</th>
                  <th className="border border-[#b7d8ee] px-3 py-2">Lời nhắn</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="text-[#244f73]">
                    <td className="border border-[#b7d8ee] px-3 py-2">{row.name}</td>
                    <td className="border border-[#b7d8ee] px-3 py-2">{row.phone || '-'}</td>
                    <td className="border border-[#b7d8ee] px-3 py-2">{row.attendance_status}</td>
                    <td className="border border-[#b7d8ee] px-3 py-2">{row.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
