'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

/**
 * Top-of-home banner carousel + one-time popup, driven by the API /banner
 * endpoints. Tapping a banner opens its linked event or URL.
 */
export default function BannerSlider() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const timer = useRef(null);

  const { data: sliders = [] } = useQuery({
    queryKey: ['banners', 'slider'],
    queryFn: async () => (await api.get('/banner/list?placement=slider')).data?.data || [],
  });

  const { data: popup } = useQuery({
    queryKey: ['banners', 'popup'],
    queryFn: async () => (await api.get('/banner/popup')).data?.data || null,
  });

  // Show popup once per session.
  useEffect(() => {
    if (popup && typeof window !== 'undefined') {
      const seen = sessionStorage.getItem(`banner_popup_${popup.id}`);
      if (!seen) setPopupOpen(true);
    }
  }, [popup]);

  // Auto-advance carousel.
  useEffect(() => {
    if (sliders.length <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % sliders.length), 4500);
    return () => clearInterval(timer.current);
  }, [sliders.length]);

  const handleTap = (b) => {
    if (b.link_type === 'event' && b.event_id) router.push(`/events?highlight=${b.event_id}`);
    else if (b.link_type === 'url' && b.link_url) window.open(b.link_url, '_blank');
  };

  const dismissPopup = () => {
    if (popup) sessionStorage.setItem(`banner_popup_${popup.id}`, '1');
    setPopupOpen(false);
  };

  return (
    <>
      {/* Carousel */}
      {sliders.length > 0 && (
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {sliders.map((b) => (
              <button
                key={b.id}
                onClick={() => handleTap(b)}
                className="relative w-full shrink-0 aspect-[16/6] bg-gray-100"
                style={{ flex: '0 0 100%' }}
              >
                <img src={b.image_url} alt={b.title || 'Banner'} className="h-full w-full object-cover" />
                {b.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-left">
                    <p className="text-white font-semibold text-sm sm:text-base">{b.title}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {sliders.length > 1 && (
            <>
              <button onClick={() => setIndex((i) => (i - 1 + sliders.length) % sliders.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow">
                <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
              </button>
              <button onClick={() => setIndex((i) => (i + 1) % sliders.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow">
                <ChevronRightIcon className="w-4 h-4 text-gray-700" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {sliders.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Popup modal */}
      {popupOpen && popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={dismissPopup}>
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={dismissPopup} className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60">
              <XMarkIcon className="w-5 h-5" />
            </button>
            <button onClick={() => { handleTap(popup); dismissPopup(); }} className="block w-full text-left">
              <img src={popup.image_url} alt={popup.title || 'Announcement'} className="w-full object-cover" />
              {popup.title && (
                <div className="p-4">
                  <p className="font-semibold text-gray-900">{popup.title}</p>
                  {(popup.link_type === 'event' || popup.link_type === 'url') && (
                    <p className="mt-1 text-sm text-blue-600">Tap to view →</p>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
