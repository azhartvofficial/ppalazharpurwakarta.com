import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data, error } = await supabase
    .from('news_articles')
    .select('judul_utama, isi_berita, gambar_judul_url')
    .eq('id', resolvedParams.id)
    .single();

  if (error) {
    console.error("Supabase Error in layout metadata:", error);
  }

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
      url: `https://pp-alazharpwk.com/berita/${resolvedParams.id}`,
      siteName: 'Pondok Pesantren Al Azhar Purwakarta',
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
