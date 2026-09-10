import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 gap-8 px-4 py-16">
      <div className="max-w-2xl">
        <div className="mx-auto mb-6 rounded-xl px-8 py-4 dark:bg-transparent bg-zinc-900 inline-block">
          <Image
            src="/stellar-tr-logo.png"
            alt="Stellar Turkiye"
            width={320}
            height={80}
            priority
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Stellar Hackathon Türkiye
        </h1>
        <p className="text-lg text-fd-muted-foreground mb-8">
          Stellar ekosistemi ve anchor entegrasyon rehberi. Başlangıçtan pro
          seviyeye, adım adım.
        </p>
        <div className="flex flex-row gap-4 justify-center flex-wrap">
          <Link
            href="/docs"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Dokümantasyon
          </Link>
          <a
            href="https://tr-mock-anchor.fly.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-fd-border font-medium hover:bg-fd-accent transition-colors"
          >
            Mock Anchor
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
        <div className="border border-fd-border rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-2">Başlangıç</h3>
          <p className="text-sm text-fd-muted-foreground">
            Stellar nedir, Anchor nedir, SEP standartları, ilk adımlar
          </p>
        </div>
        <div className="border border-fd-border rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-2">Entegrasyon</h3>
          <p className="text-sm text-fd-muted-foreground">
            Mock Anchor ile SEP-1, SEP-10, SEP-12, SEP-6, SEP-38 hands-on
          </p>
        </div>
        <div className="border border-fd-border rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-2">Pro</h3>
          <p className="text-sm text-fd-muted-foreground">
            Wallet SDK, Smart Contract kompozisyon, submission hazırlığı
          </p>
        </div>
      </div>

      <div className="text-sm text-fd-muted-foreground mt-8">
        <p>19-20 Eylül 2026 · Grand Pera, Beyoğlu, İstanbul</p>
      </div>
    </div>
  );
}
