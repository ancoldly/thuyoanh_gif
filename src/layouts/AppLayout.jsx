import { Link, NavLink, Outlet } from 'react-router-dom';
import { GraduationCap, Images, ListChecks } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const OWNER_EMAIL = 'thuyoanh204@gmail.com';

const baseMenu = [
  { to: '/', label: 'Thư mời', icon: GraduationCap },
  { to: '/album', label: 'Album', icon: Images },
];

export default function AppLayout() {
  const { user } = useAuth();
  const isOwner = user?.email === OWNER_EMAIL;

  const menu = isOwner ? [...baseMenu, { to: '/danh-sach', label: 'Danh sách', icon: ListChecks }] : baseMenu;
  const flowerTarget = !user ? '/login' : isOwner ? '/' : '/album/manage';

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[#dff1ff]/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-wide text-[#1D5FD1]">Thùy Oanh's Graduation</Link>
          <div className="flex items-center gap-4">
            <nav className="hidden gap-5 md:flex">
              {menu.map((item) => (
                <NavLink key={item.label} to={item.to} className="text-sm font-medium text-[#2a4f73] hover:text-[#1D5FD1]">{item.label}</NavLink>
              ))}
            </nav>
            <Link to={flowerTarget} className="grid h-9 w-9 place-items-center rounded-full border border-[#b7d8ee] bg-[#eef8ff]" title="Truy cập nhanh">
              <span className="text-lg leading-none">🌸</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 pt-4">
        <Outlet />
      </main>

      <nav className={`fixed inset-x-2 bottom-2 z-50 grid ${menu.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} border border-[#b7d8ee] bg-[#dff1ff] p-1 shadow-lg md:hidden`}>
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.to} className="flex flex-col items-center gap-1 py-2 text-[10px] text-[#2a4f73]">
              <Icon size={15} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

