import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Camera, ImagePlus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import frameKhung1 from '../assets/images/khung 1.png';
import frameKhung2 from '../assets/images/khung 2.png';
import frameKhung3 from '../assets/images/khung 3.png';
import frameKhung4 from '../assets/images/khung 4.png';
import frameKhung5 from '../assets/images/khung 5.png';
import frameKhung6 from '../assets/images/khung 6.png';
import frameKhung7 from '../assets/images/khung 7.png';

const OWNER_EMAIL = 'thuyoanh204@gmail.com';
const tags = ['Tất cả', 'Bạn bè', 'Gia đình', 'Sân trường', 'Khoảnh khắc vui', 'Ảnh yêu thích'];
const uploadTags = tags.filter((t) => t !== 'Tất cả');
const frames = [
  { value: 'Không khung', cls: 'bg-transparent p-0' },
  { value: 'Khung xanh lá', cls: 'border-[10px] border-[#9bd3b0] bg-[linear-gradient(180deg,#f6fff8,#e8f8ee)] p-2 shadow-[0_10px_24px_rgba(73,159,100,0.22)]' },
  { value: 'Khung hồng', cls: 'border-[10px] border-[#f4bfd7] bg-[linear-gradient(180deg,#fff7fb,#ffeef6)] p-2 shadow-[0_10px_24px_rgba(235,123,170,0.22)]' },
  { value: 'Khung xanh lam nhạt', cls: 'border-[10px] border-[#8ac2ec] bg-[linear-gradient(180deg,#f3fbff,#e0f0ff)] p-2 shadow-[0_10px_24px_rgba(47,128,237,0.22)]' },
  { value: 'Khung 1', cls: 'bg-transparent p-0', overlay: frameKhung1 },
  { value: 'Khung 2', cls: 'bg-transparent p-0', overlay: frameKhung2 },
  { value: 'Khung 3', cls: 'bg-transparent p-0', overlay: frameKhung3 },
  { value: 'Khung 4', cls: 'bg-transparent p-0', overlay: frameKhung4 },
  { value: 'Khung 5', cls: 'bg-transparent p-0', overlay: frameKhung5 },
  { value: 'Khung 6', cls: 'bg-transparent p-0', overlay: frameKhung6 },
  { value: 'Khung 7', cls: 'bg-transparent p-0', overlay: frameKhung7 },
];
const stickerOptions = ['😂', '😎', '🤪', '🥳', '💥', '🔥', '🐸', '🦄', '🎉', '📸', '🎓', '💙', '✨', '🌸'];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawContainedImage(ctx, image, canvasW, canvasH, adjust) {
  const baseScale = Math.min(canvasW / image.width, canvasH / image.height);
  const drawW = image.width * baseScale * adjust.scale;
  const drawH = image.height * baseScale * adjust.scale;
  const centerX = (adjust.x / 100) * canvasW;
  const centerY = (adjust.y / 100) * canvasH;
  ctx.drawImage(image, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
}

async function buildCompositedImageBlob({ file, frameObj, stickers, imageAdjust }) {
  const canvas = document.createElement('canvas');
  const baseImage = await loadImage(URL.createObjectURL(file));
  const isNoFrame = frameObj.value === 'Không khung';
  const canvasW = isNoFrame ? baseImage.width : 1200;
  const canvasH = isNoFrame ? baseImage.height : 1600;
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể tạo canvas context.');

  ctx.clearRect(0, 0, canvasW, canvasH);

  // Draw background/frame style for non-overlay frames.
  if (!frameObj.overlay && !isNoFrame) {
    if (frameObj.value === 'Khung xanh lá') {
      ctx.fillStyle = '#e8f8ee';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.lineWidth = 34;
      ctx.strokeStyle = '#9bd3b0';
      ctx.strokeRect(17, 17, canvasW - 34, canvasH - 34);
    } else if (frameObj.value === 'Khung hồng') {
      ctx.fillStyle = '#ffeef6';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.lineWidth = 34;
      ctx.strokeStyle = '#f4bfd7';
      ctx.strokeRect(17, 17, canvasW - 34, canvasH - 34);
    } else if (frameObj.value === 'Khung xanh lam nhạt') {
      ctx.fillStyle = '#e0f0ff';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.lineWidth = 34;
      ctx.strokeStyle = '#8ac2ec';
      ctx.strokeRect(17, 17, canvasW - 34, canvasH - 34);
    } else {
      ctx.fillStyle = '#eaf5ff';
      ctx.fillRect(0, 0, canvasW, canvasH);
    }
  }

  if (isNoFrame) {
    ctx.drawImage(baseImage, 0, 0, canvasW, canvasH);
  } else {
    drawContainedImage(ctx, baseImage, canvasW, canvasH, imageAdjust);
  }

  stickers.forEach((s) => {
    const x = (s.x / 100) * canvasW;
    const y = (s.y / 100) * canvasH;
    const sizePx = (s.size || 1.8) * 16 * (Math.min(canvasW, canvasH) / 360);
    ctx.font = `${Math.round(sizePx)}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.emoji, x, y);
  });

  if (frameObj.overlay) {
    const overlay = await loadImage(frameObj.overlay);
    ctx.drawImage(overlay, 0, 0, canvasW, canvasH);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Không thể xuất ảnh từ canvas.'));
      resolve(blob);
    }, 'image/png');
  });
}

function StickerLayer({ stickers, onPointerDown }) {
  return (
    <>
      {stickers.map((s) => (
        <button
          key={s.id}
          type="button"
          onPointerDown={(e) => onPointerDown(e, s.id)}
          className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab ${s.selected ? 'rounded-full ring-2 ring-[#1D5FD1] ring-offset-1' : ''}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}rem` }}
        >
          {s.emoji}
        </button>
      ))}
    </>
  );
}

export default function AlbumPage() {
  const { user } = useAuth();
  const isOwner = user?.email === OWNER_EMAIL;

  const [photos, setPhotos] = useState([]);
  const [tag, setTag] = useState('Tất cả');
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewAspect, setPreviewAspect] = useState(3 / 4);
  const [caption, setCaption] = useState('');
  const [photoTag, setPhotoTag] = useState(uploadTags[0]);
  const [frame, setFrame] = useState(frames[0].value);
  const [stickers, setStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [imageAdjust, setImageAdjust] = useState({ scale: 1, x: 50, y: 50 });
  const [uploading, setUploading] = useState(false);

  const [draggingId, setDraggingId] = useState(null);
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const activeFrame = useMemo(() => frames.find((f) => f.value === frame) || frames[0], [frame]);
  const effectiveImageAdjust = useMemo(
    () => (activeFrame.value === 'Không khung' ? { scale: 1, x: 50, y: 50 } : imageAdjust),
    [activeFrame.value, imageAdjust],
  );

  const loadPhotos = async () => {
    if (!supabase) return;
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from('album_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) toast.error(error.message);
    setPhotos(data || []);
    setLoadingPhotos(false);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (!draggingId || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const nx = Math.max(5, Math.min(95, x));
      const ny = Math.max(5, Math.min(95, y));
      setStickers((prev) => prev.map((s) => (s.id === draggingId ? { ...s, x: nx, y: ny } : s)));
    };
    const up = () => setDraggingId(null);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [draggingId]);

  const filtered = useMemo(() => (tag === 'Tất cả' ? photos : photos.filter((p) => p.tag === tag)), [photos, tag]);

  const onPickFile = (picked) => {
    if (!picked) return;
    const objectUrl = URL.createObjectURL(picked);
    setFile(picked);
    setPreviewUrl(objectUrl);
    setStickers([]);
    setSelectedStickerId(null);
    setImageAdjust({ scale: 1, x: 50, y: 50 });
    const img = new Image();
    img.onload = () => {
      if (img.width > 0 && img.height > 0) {
        setPreviewAspect(img.width / img.height);
      } else {
        setPreviewAspect(3 / 4);
      }
    };
    img.onerror = () => {
      setPreviewAspect(3 / 4);
    };
    img.src = objectUrl;
  };

  const addSticker = (emoji) => {
    const id = crypto.randomUUID();
    setStickers((prev) => [...prev.map((s) => ({ ...s, selected: false })), { id, emoji, x: 50, y: 50, size: 1.8, selected: true }]);
    setSelectedStickerId(id);
  };

  const selectSticker = (id) => {
    setSelectedStickerId(id);
    setStickers((prev) => prev.map((s) => ({ ...s, selected: s.id === id })));
  };

  const resizeSticker = (delta) => {
    if (!selectedStickerId) return;
    setStickers((prev) =>
      prev.map((s) => (s.id === selectedStickerId ? { ...s, size: Math.max(1.2, Math.min(3.2, Number((s.size + delta).toFixed(2)))) } : s)),
    );
  };

  const resetUploadForm = () => {
    setFile(null);
    setPreviewUrl('');
    setPreviewAspect(3 / 4);
    setCaption('');
    setPhotoTag(uploadTags[0]);
    setFrame(frames[0].value);
    setStickers([]);
    setSelectedStickerId(null);
    setImageAdjust({ scale: 1, x: 50, y: 50 });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const resizeImageInFrame = (delta) => {
    if (activeFrame.value === 'Không khung') return;
    setImageAdjust((prev) => ({
      ...prev,
      scale: Math.max(0.7, Math.min(2.5, Number((prev.scale + delta).toFixed(2)))),
    }));
  };

  const nudgeImageInFrame = (dx, dy) => {
    if (activeFrame.value === 'Không khung') return;
    setImageAdjust((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(100, prev.x + dx)),
      y: Math.max(0, Math.min(100, prev.y + dy)),
    }));
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!isOwner) return toast.error('Bạn không có quyền upload.');
    if (!supabase || !file) return toast.error('Vui lòng chọn ảnh trước khi upload.');

    setUploading(true);
    const frameObj = frames.find((f) => f.value === frame) || frames[0];
    let composedBlob;
    try {
      composedBlob = await buildCompositedImageBlob({ file, frameObj, stickers, imageAdjust: frameObj.value === 'Không khung' ? { scale: 1, x: 50, y: 50 } : imageAdjust });
    } catch (err) {
      setUploading(false);
      return toast.error(err.message || 'Không thể ghép ảnh.');
    }

    const filename = `album/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const { error: uploadErr } = await supabase.storage.from('graduation-album').upload(filename, composedBlob, {
      upsert: false,
      contentType: 'image/png',
    });
    if (uploadErr) {
      setUploading(false);
      return toast.error(uploadErr.message);
    }

    const { data: publicData } = supabase.storage.from('graduation-album').getPublicUrl(filename);
    const { error: dbErr } = await supabase.from('album_photos').insert({
      image_url: publicData.publicUrl,
      caption,
      tag: photoTag,
      frame_type: frame,
      sticker_data: {
        items: stickers,
        imageAdjust,
      },
    });

    setUploading(false);
    if (dbErr) return toast.error(dbErr.message);

    toast.success('Đã tải ảnh lên album');
    resetUploadForm();
    loadPhotos();
  };

  return (
    <section className="space-y-4">
      <div className="invite-card flex items-center justify-between rounded-[28px] p-6">
        <h1 className="font-serif text-4xl text-[#1D5FD1]">Album tốt nghiệp</h1>
      </div>

      {isOwner && (
        <form onSubmit={upload} className="invite-card rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="invite-btn flex items-center gap-2">
              <ImagePlus size={16} /> Tải ảnh lên
            </button>
            <button
              type="button"
              onClick={() => {
                if (cameraInputRef.current) {
                  cameraInputRef.current.value = '';
                  cameraInputRef.current.click();
                }
              }}
              className="invite-btn flex items-center gap-2"
            >
              <Camera size={16} /> Chụp ảnh
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onPickFile(e.target.files?.[0])}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <select className="input" value={photoTag} onChange={(e) => setPhotoTag(e.target.value)}>
              {uploadTags.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="input" value={frame} onChange={(e) => setFrame(e.target.value)}>
              {frames.map((f) => <option key={f.value}>{f.value}</option>)}
            </select>
            <button disabled={uploading || !file} className="invite-btn">
              {uploading ? 'Đang upload...' : 'Lưu vào album'}
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm text-[#2a4f73]">Sticker kéo-thả</p>
            <div className="flex flex-wrap gap-2">
              {stickerOptions.map((emoji) => (
                <button key={emoji} type="button" onClick={() => addSticker(emoji)} className="rounded-md border border-[#8eb8d8] bg-[#eef8ff] px-3 py-2 text-xl hover:bg-white">
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-[#2a4f73]">
              <span>Phóng to / thu nhỏ:</span>
              <button type="button" onClick={() => resizeSticker(-0.2)} className="rounded-md border border-[#8eb8d8] bg-[#eef8ff] px-2 py-1">-</button>
              <button type="button" onClick={() => resizeSticker(0.2)} className="rounded-md border border-[#8eb8d8] bg-[#eef8ff] px-2 py-1">+</button>
            </div>
          </div>

          {previewUrl && (
            <div className="rounded-xl border border-[#8eb8d8] bg-[#eef8ff] p-3">
              <p className="mb-2 text-sm text-[#2a4f73]">Căn ảnh trong khung</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#2a4f73]">
                <span>Zoom ảnh:</span>
                <button type="button" onClick={() => resizeImageInFrame(-0.1)} className="rounded-md border border-[#8eb8d8] bg-white px-2 py-1">-</button>
                <button type="button" onClick={() => resizeImageInFrame(0.1)} className="rounded-md border border-[#8eb8d8] bg-white px-2 py-1">+</button>
                <span className="ml-1 rounded-md bg-white px-2 py-1">{Math.round(effectiveImageAdjust.scale * 100)}%</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => nudgeImageInFrame(0, -2)} className="rounded-md border border-[#8eb8d8] bg-white px-2 py-1 text-sm">↑</button>
                <button type="button" onClick={() => nudgeImageInFrame(-2, 0)} className="rounded-md border border-[#8eb8d8] bg-white px-2 py-1 text-sm">←</button>
                <button type="button" onClick={() => nudgeImageInFrame(2, 0)} className="rounded-md border border-[#8eb8d8] bg-white px-2 py-1 text-sm">→</button>
                <button type="button" onClick={() => nudgeImageInFrame(0, 2)} className="rounded-md border border-[#8eb8d8] bg-white px-2 py-1 text-sm">↓</button>
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="mx-auto max-w-sm">
              <div
                ref={previewRef}
                className={`relative overflow-hidden rounded-xl ${activeFrame.cls}`}
                style={{ aspectRatio: activeFrame.value === 'Không khung' ? previewAspect : 3 / 4 }}
              >
                <img
                  src={previewUrl}
                  alt="preview"
                  className="absolute h-full w-full bg-[#eaf5ff] object-contain"
                  style={{
                    left: `${effectiveImageAdjust.x}%`,
                    top: `${effectiveImageAdjust.y}%`,
                    transform: `translate(-50%, -50%) scale(${effectiveImageAdjust.scale})`,
                    transformOrigin: 'center',
                  }}
                />
                <StickerLayer
                  stickers={stickers}
                  onPointerDown={(e, id) => {
                    e.preventDefault();
                    selectSticker(id);
                    setDraggingId(id);
                  }}
                />
                {activeFrame.overlay && (
                  <img src={activeFrame.overlay} alt={activeFrame.value} className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
                )}
              </div>
            </div>
          )}
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              tag === t
                ? 'border-[#1D5FD1] bg-[#1D5FD1] text-white shadow-[0_6px_14px_rgba(29,95,209,0.28)]'
                : 'border-[#b7d8ee] bg-[#eef8ff] text-[#2a4f73] hover:border-[#8dbde3] hover:bg-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loadingPhotos && <p className="invite-card rounded-2xl p-6 text-center">Đang tải album...</p>}
      {!loadingPhotos && filtered.length === 0 && <p className="invite-card rounded-2xl p-8 text-center">Album chưa có ảnh.</p>}

      <div className="columns-2 gap-4 md:columns-3">
        {filtered.map((photo) => {
          return (
            <div key={photo.id} className="invite-card mb-4 break-inside-avoid rounded-2xl p-2">
              <div className="relative overflow-hidden rounded-xl bg-[#eaf5ff]">
                <img src={photo.image_url} alt={photo.caption || 'photo'} className="w-full rounded-lg object-contain" />
              </div>
              {photo.caption ? <p className="p-2 text-sm text-[#2a4f73]">{photo.caption}</p> : null}
              <p className="px-2 pt-2 pb-2 text-xs text-[#5f8fb5]">{photo.tag || 'Không tag'}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
