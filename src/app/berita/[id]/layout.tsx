import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from('news_articles')
    .select('judul_utama, isi_berita, gambar_judul_url')
    .eq('id', params.id)
    .single();

  if (!data) {
    return {
      title: 'Berita Tidak Ditemukan',
    };
  }

  let description = data.isi_berita?.replace(/<[^>]*>?/gm, '') || '';
  if (description.length > 150) description = description.substring(0, 150) + '...';

  return {
    title: data.judul_utama,
    description: description,
    openGraph: {
      title: data.judul_utama,
      description: description,
      images: data.gambar_judul_url ? [data.gambar_judul_url] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.judul_utama,
      description: description,
      images: data.gambar_judul_url ? [data.gambar_judul_url] : [],
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
