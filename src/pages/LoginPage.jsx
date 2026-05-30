import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

const OWNER_EMAIL_DOMAIN = '@gmail.com';

export default function LoginPage() {
  const [username, setUsername] = useState('thuyoanh204@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) return toast.error('Thiếu cấu hình Supabase');

    const normalized = username.trim();
    const email = normalized.includes('@') ? normalized : `${normalized}${OWNER_EMAIL_DOMAIN}`;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return toast.error(error.message);
    toast.success('Đăng nhập thành công');
    nav('/album');
  };

  return (
    <div className="flex min-h-[100dvh] items-center">
      <div className="mx-auto w-[calc(100%-20px)] max-w-sm rounded-[28px] border border-white/70 bg-[#cfe3f4] px-6 py-5 shadow-[0_16px_38px_rgba(29,95,209,0.18)] sm:w-full sm:p-7">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-[#5f8fb5]">Owner Access</p>
        <h1 className="mt-1 text-center font-serif text-5xl text-[#1D5FD1]">Đăng Nhập</h1>
        <p className="mt-2 text-center text-sm text-[#2a4f73]">Quản lý album tốt nghiệp</p>

        <form onSubmit={submit} className="mt-6 grid gap-3">
          <label className="text-sm font-medium text-[#2a4f73]">Username</label>
          <input
            className="input"
            placeholder="thuyoanh204@gmail.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="mt-1 text-sm font-medium text-[#2a4f73]">Mật khẩu</label>
          <input
            className="input"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="invite-btn mt-1" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập quản trị'}
          </button>
        </form>
      </div>
    </div>
  );
}


