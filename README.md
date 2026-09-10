<p align="center">
  <img src="assets/stellar-tr-logo.png" alt="Stellar Turkiye" width="400" />
</p>

<h1 align="center">Stellar Hackathon Turkiye</h1>

<p align="center">
  <strong>Rise In x Stellar Pro Hackathon 2026</strong><br/>
  19-20 Eylül 2026 | Grand Pera, Beyoğlu, İstanbul<br/><br/>
  <a href="https://stellar-hackathon-turkiye.vercel.app"><strong>Docs Sitesi</strong></a> ·
  <a href="https://tr-mock-anchor.fly.dev"><strong>Mock Anchor</strong></a> ·
  <a href="SKILL.md"><strong>AI Skill</strong></a>
</p>

---

Stellar ekosistemi ve **özellikle anchor entegrasyonu** (TRY on/off-ramp) için hazırlanmış kapsamlı rehber. Hackathon'a ilk kez katılıyorsan da, Stellar'da deneyimliysen de bu dokümantasyon seni hazırlar.

## Başlangıç

Stellar'da ilk kez mi geliştiriyorsun? Bu bölüm temel kavramları anlatıyor:

- **Stellar Nedir?** - Ağ yapısı, XLM, ledger, testnet
- **Hesap ve Kavramlar** - Account, keypair, trustline, transaction, operation, memo
- **Anchor Nedir?** - Fiat (TRY) ile dijital varlıklar (USDC) arasında köprü, nasıl çalışır, neden önemli
- **SEP Standartları** - SEP-1, SEP-6, SEP-10, SEP-12, SEP-38 ne işe yarar, genel bakış
- **İlk Adımlar** - Freighter cüzdan kurulumu, Friendbot ile testnet fonlama, Stellar Lab'da ilk işlem, USDC trustline açma

## Entegrasyon

Mock Anchor (`tr-mock-anchor.fly.dev`) ile adım adım, çalışır kod örnekleriyle (JavaScript, Python, Rust):

| Adım | SEP | Ne Yapılır |
|---|---|---|
| 1 | **SEP-1** | `stellar.toml` dosyasını oku, tüm endpoint'leri keşfet |
| 2 | **SEP-10** | Cüzdan anahtarıyla challenge-response auth, JWT token al |
| 3 | **SEP-12** | KYC (mock'ta otomatik onay, ekstra işlem yok) |
| 4 | **SEP-38** | TRY/USDC döviz kuru al, kilitli fiyat teklifi iste |
| 5 | **SEP-6** | Deposit (TRY -> USDC) ve withdraw (USDC -> TRY) işlemleri |
| 6 | **Tam Akış** | Uçtan uca çalışır script - kopyala yapıştır, çalıştır |

Her sayfada 3 dilde tab'lı kod örnekleri var. `simulate-bank-transfer` endpoint'i ile mock'ta banka transferini simüle edebilirsin.

## Pro

Temel entegrasyonun ötesinde:

- **Wallet SDK** - Stellar Wallet SDK ile tüm SEP akışını tek API arkasında yönet, Freighter/Passkey/Wallets Kit entegrasyonu
- **Smart Contract + Anchor** - Soroban contract'ları ile anchor'ı birleştir (örnek: TRY yatır -> USDC al -> DeFi vault'a koy)
- **SEP ve Gerçek Dünya** - Mock Anchor'da öğrendiklerin gerçek dünyada nasıl karşılık buluyor
- **Submission Hazırlığı** - Jürinin baktığı 6 kriter, README şablonu, Mermaid diyagramı, sunum ipuçları

## Entegrasyon Partnerleri

Anchor'a ek olarak kullanabileceğin Stellar ekosistem protokolleri:

| Kategori | Protokol | Ne Yapar |
|---|---|---|
| DeFi - Yield | **DeFindex** | Vault aggregator, yield altyapısı |
| DeFi - Lending | **Blend v2** | Lending pool protokolü |
| DeFi - DEX | **Soroswap** | Soroban + classic likidite aggregator |
| DeFi - DEX | **Aquarius** | Stellar DEX likidite ve swap routing |
| Cross-chain | **Circle CCTP** | Zincirler arası native USDC transferi |
| Wallets | **Stellar Wallets Kit** | Cüzdan bağlama toolkit'i |
| Wallets | **Privy** | Email/social cüzdan onboarding |
| Wallets | **DFNS** | Wallets-as-a-Service |
| On/Off-ramp | **Bridge** | Çok para birimli ödeme |
| On/Off-ramp | **BlindPay** | Global ödeme, fiat + stablecoin |

## AI Skill Dosyası

Projede bir [`SKILL.md`](SKILL.md) var. AI kodlama aracına (Claude Code, Cursor, vb.) ver, Mock Anchor entegrasyonunu senin için yazsın.

İçinde:
- Tüm endpoint URL'leri ve gerçek değerler (issuer, treasury, signing key)
- 8 adımlık entegrasyon akışı, çalışır JavaScript kodlarıyla
- Deposit/withdraw limitleri ve format bilgisi
- 7 yaygın hata ve çözümleri
- `simulate-bank-transfer` gibi mock'a özel detaylar

```
# Claude Code'da
"SKILL.md'yi oku ve Mock Anchor deposit akışını uygula"

# Cursor'da
@SKILL.md bu skill'e göre anchor entegrasyonu yaz
```

## Mock Anchor

| | |
|---|---|
| **Home Domain** | [tr-mock-anchor.fly.dev](https://tr-mock-anchor.fly.dev) |
| **Asset** | USDC |
| **Ağ** | Stellar Testnet |
| **USDC Issuer** | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` |
| **SEP'ler** | SEP-1, SEP-6, SEP-10, SEP-12, SEP-38 |
| **Deposit Limiti** | 50 - 3,000 TRY |
| **Withdraw Min** | 1 USDC |
| **KYC** | Otomatik onay (simüle) |
| **Kur Kaynağı** | Reflector oracle + 50 bps spread |

> Mock Anchor sadece testnet'te çalışır. Gerçek para, gerçek banka veya gerçek KYC işlemi yoktur.

### Nasıl Denersiniz?

- **Tarayıcıda canlı, adım adım:** [tr-mock-anchor.fly.dev/explorer](https://tr-mock-anchor.fly.dev/explorer) (API key yok, cüzdan uygulaması gerekmez)
- **Kendi cüzdanınızla:** [demo-wallet.stellar.org](https://demo-wallet.stellar.org) açın, home domain olarak `tr-mock-anchor.fly.dev` girin
- **Örnek cüzdan (kaynak kod + canlı):** [kaankacar.github.io/tr-mock-wallet](https://kaankacar.github.io/tr-mock-wallet/)
- **Rehber (buradan başlayın):** [tr-mock-anchor.fly.dev/sep](https://tr-mock-anchor.fly.dev/sep)

## Kaynaklar

| Kaynak | Link |
|---|---|
| Mock Anchor | https://tr-mock-anchor.fly.dev |
| Mock Anchor API (AI için) | https://tr-mock-anchor.fly.dev/llms-full.txt |
| SEP Demo (interaktif) | https://tr-mock-anchor.fly.dev/explorer |
| Stellar Developer Docs | https://developers.stellar.org |
| Stellar AI Skills | https://skills.stellar.org |
| Raven MCP | https://raven.stellar.buzz |
| Stellar Lab | https://lab.stellar.org |
| Stellar Expert (Explorer) | https://stellar.expert |
| Circle USDC Faucet | https://faucet.circle.com |
| stellar-build | https://github.com/kaankacar/stellar-build |
| Stellar Wallets Kit | https://stellarwalletskit.dev |
| Smart Wallet Docs | https://developers.stellar.org/docs/build/apps/smart-wallets |
