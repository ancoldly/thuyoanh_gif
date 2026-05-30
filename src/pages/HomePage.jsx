import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RSVPForm from '../components/RSVPForm';
import WishesForm from '../components/WishesForm';
import heroImage1 from '../assets/images/image_2.png';
import gradIcon from '../assets/images/1.png';

const mapEmbed = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || 'https://www.google.com/maps?q=97+Vo+Van+Tan+TPHCM&output=embed';
const eventDate = new Date('2026-06-07T16:00:00+07:00');

const calendarCells = [
  ['1', '2', '3', '4', '5', '6', '7'],
  ['8', '9', '10', '11', '12', '13', '14'],
  ['15', '16', '17', '18', '19', '20', '21'],
  ['22', '23', '24', '25', '26', '27', '28'],
  ['29', '30', '-', '-', '-', '-', '-'],
];

const floating = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 2, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

function PhotoCard({ src, alt, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="photo-frame w-full">
      <div className="photo-frame-inner">
        <div className="photo-inner">
          <img src={src} alt={alt} className="h-[300px] w-full object-contain object-top bg-[#eef8ff]" />
        </div>
      </div>
    </motion.div>
  );
}

function getRemaining() {
  const diff = eventDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function CountdownHeart({ value, label }) {
  return (
    <div className="relative mx-auto h-20 w-20">
      <svg viewBox="0 0 100 90" className="h-full w-full" aria-hidden="true">
        <path
          d="M50 82 C46 76, 10 56, 10 32 C10 18, 21 8, 34 8 C42 8, 48 12, 50 17 C52 12, 58 8, 66 8 C79 8, 90 18, 90 32 C90 56, 54 76, 50 82 Z"
          fill="#1D5FD1"
          stroke="#f7bfd6"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 text-white">
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-[11px]">{label}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [remaining, setRemaining] = useState(getRemaining());

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-xl space-y-4 pb-6">
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="invite-card overflow-hidden">
        <div className="invite-floral relative border-b border-white/70 bg-[linear-gradient(to_bottom,#bcdff5,#dff1ff)] px-4 py-6 text-center">
          <motion.div {...floating} className="absolute left-4 top-3 text-xl text-[#7faed0]">✿</motion.div>
          <motion.div {...floating} className="absolute right-4 top-3 text-xl text-[#7faed0]">✿</motion.div>
          <motion.img
            style={{ zIndex: 0 }}
            src={gradIcon}
            alt="Graduation icon"
            className="pointer-events-none absolute right-2 top-12 w-20 opacity-55 md:right-1 md:top-10 md:w-24"
            animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="relative z-10 text-[12px] uppercase tracking-[0.3em] font-semibold text-[#1D5FD1]">Thư mời tham dự</p>
          <h1 className="relative z-10 mt-2 font-serif text-5xl font-semibold leading-none">Lễ Tốt Nghiệp</h1>
          <p className="relative z-10 mt-5 font-script text-6xl text-[#1D5FD1]">Thùy Oanh</p>
        </div>

        <div className="relative px-5 py-6">
          <div className="invite-bunting mb-4 flex items-end justify-center gap-1">
            {['#8eb8d8', '#b5d8f2', '#7faed0', '#c7e4f4', '#8eb8d8', '#b5d8f2'].map((c, i) => (
              <motion.span key={i} className="flag" style={{ borderTopColor: c }} animate={{ y: [0, i % 2 ? -2 : 2, 0] }} transition={{ duration: 2 + i * 0.15, repeat: Infinity }} />
            ))}
          </div>

          <p className="mb-4 text-center text-[#2a4f73]">
            <span className="text-lg">Vào lúc 16:00 - Chủ Nhật</span>
            <br />
            <span className="font-serif text-5xl leading-none text-[#1D5FD1]">07.06.2026</span>
            <br />
            <span className="mt-2 inline-block text-sm italic leading-6">
              Sân trường Đại học Mở TP.HCM - Số 97
              <br />
              Võ Văn Tần, Phường Xuân Hòa
            </span>
            <br />
            <span className="mt-2 inline-block text-base font-medium">📞 0773.795.669 - 0936.365.469</span>
          </p>

          <div className="grid place-items-center gap-5 md:grid-cols-2 md:items-start">
            <div className="mx-auto w-full max-w-[320px]">
              <PhotoCard src={heroImage1} alt="Oanh" delay={0.15} />
            </div>

            <div className="mx-auto w-full max-w-[320px]">
              <div className="photo-frame-inner">
                <div className="photo-inner bg-[#eef8ff] p-4 text-[#244f73]">
                  <p className="font-serif text-3xl text-[#1D5FD1]">THƯƠNG MỜI</p>
                  <p className="mt-3 text-[20px] leading-8 font-script text-[#2a4f73]">
                    Những người thương yêu đã động viên,
                    <br />
                    chứng kiến, đồng hành và dẫn dắt
                    <br />
                    con/em/mình trong suốt hành trình Đại học
                  </p>
                  <p className="mt-4 font-serif text-[24px] italic text-[#1D5FD1] leading-8">
                    Cùng đến tham dự Lễ Tốt
                    <br />
                    nghiệp và lưu giữ những
                    <br />
                    khoảnh khắc đáng nhớ.......
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section id="lich" className="invite-card px-4 py-5">
        <div className="bg-[#1D5FD1] px-4 py-2 text-center text-3xl font-bold text-white">
          <span className="mr-8">THÁNG 06</span>
          <span>2026</span>
        </div>
        <div className="border border-[#8eb8d8] bg-[#eef8ff] px-2 py-3">
          <div className="grid grid-cols-7 border-b border-[#8eb8d8] pb-2 text-center text-lg font-semibold">
            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          </div>
          <div className="mt-2 space-y-2">
            {calendarCells.map((row, idx) => (
              <div key={idx} className="grid grid-cols-7 text-center text-2xl">
                {row.map((cell, colIdx) => (
                  <span key={`${idx}-${colIdx}-${cell}`}>
                    {cell === '7' ? (
                      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-200 text-[#2F80ED]">
                        <span className="absolute -right-1 -top-1 text-[10px]">💗</span>
                        <span className="font-bold">7</span>
                      </span>
                    ) : (
                      <span className={cell !== '-' ? 'text-[#2a4f73]' : 'text-[#9db9cf]'}>{cell}</span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-dashed border-[#8eb8d8] pt-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f8fb5]">Đếm ngược đến giờ dự lễ</p>
          <div className="mt-3 grid grid-cols-4 gap-1">
            <CountdownHeart value={pad(remaining.days)} label="Ngày" />
            <CountdownHeart value={pad(remaining.hours)} label="Giờ" />
            <CountdownHeart value={pad(remaining.minutes)} label="Phút" />
            <CountdownHeart value={pad(remaining.seconds)} label="Giây" />
          </div>
        </div>
      </section>

      <section className="invite-card p-4">
        <h3 className="text-center font-serif text-4xl">Địa điểm</h3>
        <p className="mb-3 mt-2 text-center text-sm text-[#2a4f73]">Sân trường Đại học Mở TP.HCM - 97 Võ Văn Tần, Phường Xuân Hòa</p>
        <iframe title="map" src={mapEmbed} className="h-64 w-full border border-[#b7d8ee]" loading="lazy" />
        <a className="invite-btn mt-3 inline-block w-full text-center" href="https://maps.google.com/?q=97+Võ+Văn+Tần+TP.HCM" target="_blank" rel="noreferrer">Mở Google Maps</a>
      </section>

      <div id="rsvp"><RSVPForm /></div>
      <div id="wish"><WishesForm /></div>

      <section className="invite-card p-6 text-center">
        <h3 className="font-script text-6xl text-[#1D5FD1]">Thank you!</h3>
        <p className="mx-auto mt-2 max-w-sm text-lg italic">Cảm ơn bạn vì đã là một phần trong hành trình thanh xuân và ngày đặc biệt này.</p>
      </section>
    </div>
  );
}








