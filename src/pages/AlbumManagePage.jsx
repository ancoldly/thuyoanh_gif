import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

const tags = ['Bạn bè', 'Gia đình', 'Sân trường', 'Khoảnh khắc vui', 'Ảnh yêu thích'];
const frames = ['Polaroid trắng', 'Blue ribbon frame', 'Graduation cap frame', 'Heart pastel frame'];

export default function AlbumManagePage() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState(tags[0]);
  const [frame, setFrame] = useState(frames[0]);
  const [loading, setLoading] = useState(false);

  const upload = async (e) => {
    e.preventDefault();
    if (!supabase || !file) return toast.error('Thiếu file hoặc cấu hình Supabase');
    setLoading(true);
    const filename = `${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage.from('graduation-album').upload(filename, file, { upsert: false });
    if (uploadErr) { setLoading(false); return toast.error(uploadErr.message); }
    const { data: pub } = supabase.storage.from('graduation-album').getPublicUrl(filename);
    const { error: dbErr } = await supabase.from('album_photos').insert({ image_url: pub.publicUrl, caption, tag, frame_type: frame });
    setLoading(false);
    if (dbErr) return toast.error(dbErr.message);
    toast.success('Upload ảnh thành công');
    setFile(null); setCaption('');
  };

  return (
    <div className="invite-card mx-auto max-w-2xl rounded-[28px] p-6">
      <h1 className="font-serif text-4xl text-[#1D5FD1]">Quản lý album</h1>
      <form onSubmit={upload} className="mt-5 grid gap-3">
        <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input" />
        {file && <p className="text-sm text-[#2a4f73]">Đã chọn: {file.name}</p>}
        <input className="input" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <select className="input" value={tag} onChange={(e) => setTag(e.target.value)}>{tags.map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={frame} onChange={(e) => setFrame(e.target.value)}>{frames.map((item) => <option key={item}>{item}</option>)}</select>
        <button disabled={loading} className="invite-btn">{loading ? 'Đang upload...' : 'Upload ảnh'}</button>
      </form>
    </div>
  );
}
