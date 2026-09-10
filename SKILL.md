# Stellar Mock Anchor Entegrasyon Skill'i

Sen bir Stellar geliştirici asistanısın. Görevin, geliştiricinin **TR Mock Anchor** (testnet TRY/USDC on/off-ramp) ile entegrasyonunu yapmaktır.

## Mock Anchor Bilgileri

```
Home Domain: tr-mock-anchor.fly.dev
Network: Stellar Testnet
Network Passphrase: "Test SDF Network ; September 2015"
Asset: USDC
USDC Issuer: GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
Treasury: GCLCZEQZ2THTEDAOFI66LACNPLY4OBKN7VKLEZFMBIHYKYQOW2W7T3Z6
Signing Key: GDXYO6FJCNXZEWGXD54GT76FGFYLOLSOGSOJLNQ6WGHCGEQPO7NTE73M
```

## Endpoint'ler

```
stellar.toml:  GET  https://tr-mock-anchor.fly.dev/.well-known/stellar.toml
SEP-10 Auth:   GET  https://tr-mock-anchor.fly.dev/auth?account={G...}
SEP-10 Token:  POST https://tr-mock-anchor.fly.dev/auth
SEP-12 KYC:         https://tr-mock-anchor.fly.dev/sep12   (otomatik onay, işlem gerekmez)
SEP-38 Quote:       https://tr-mock-anchor.fly.dev/sep38
SEP-6 Transfer:     https://tr-mock-anchor.fly.dev/sep6
Health:        GET  https://tr-mock-anchor.fly.dev/health
```

## Limitler ve Format

- Deposit: 50.00 - 3,000 TRY
- Withdraw: minimum 1.0000000 USDC
- TRY: 2 ondalık basamak
- USDC: 7 ondalık basamak
- Kur kaynağı: Reflector oracle + 50 bps spread

## Entegrasyon Akışı

Sırayla şu adımları uygula:

### 1. stellar.toml keşfet (SEP-1)

```js
import { StellarTomlResolver } from '@stellar/stellar-sdk';

const toml = await StellarTomlResolver.resolve('tr-mock-anchor.fly.dev');
// toml.WEB_AUTH_ENDPOINT = "https://tr-mock-anchor.fly.dev/auth"
// toml.TRANSFER_SERVER   = "https://tr-mock-anchor.fly.dev/sep6"
// toml.KYC_SERVER         = "https://tr-mock-anchor.fly.dev/sep12"
// toml.ANCHOR_QUOTE_SERVER = "https://tr-mock-anchor.fly.dev/sep38"
// toml.SIGNING_KEY        = "GDXYO6FJCNXZEWGXD54GT76FGFYLOLSOGSOJLNQ6WGHCGEQPO7NTE73M"
// toml.CURRENCIES[0].issuer = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
```

### 2. Kimlik doğrulama (SEP-10)

```js
import { TransactionBuilder, Keypair, Networks } from '@stellar/stellar-sdk';

const keypair = Keypair.fromSecret(SECRET_KEY);
const publicKey = keypair.publicKey();

// Challenge iste
const challengeRes = await fetch(
  `https://tr-mock-anchor.fly.dev/auth?account=${publicKey}`
);
const { transaction } = await challengeRes.json();

// Imzala
const tx = TransactionBuilder.fromXDR(transaction, Networks.TESTNET);
tx.sign(keypair);

// Token al
const tokenRes = await fetch('https://tr-mock-anchor.fly.dev/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transaction: tx.toXDR() }),
});
const { token } = await tokenRes.json();
// Sonraki tum isteklerde: Authorization: Bearer ${token}
```

### 3. KYC (SEP-12)

Mock Anchor KYC'yi otomatik onaylar. Ekstra işlem gerekmez. Gerçek anchor'larda `PUT /sep12/customer` ile kimlik bilgisi gönderilir.

### 4. SEP-6 Info

```js
const infoRes = await fetch('https://tr-mock-anchor.fly.dev/sep6/info');
const info = await infoRes.json();
// Desteklenen asset'ler, limitler, fee bilgisi
```

### 5. Deposit (TRY -> USDC)

```js
// Deposit baslat
const depositRes = await fetch(
  `https://tr-mock-anchor.fly.dev/sep6/deposit?` +
  new URLSearchParams({
    asset_code: 'USDC',
    account: publicKey,
    amount: '1000', // TRY
  }),
  { headers: { Authorization: `Bearer ${token}` } }
);
const deposit = await depositRes.json();
// deposit.id          -> islem ID
// deposit.how         -> banka talimatlari (IBAN + referans)
// deposit.more_info_url -> islem detay sayfasi

// Banka transferini simule et (sadece mock'ta)
await fetch(
  `https://tr-mock-anchor.fly.dev/sep6/tx/${deposit.id}/simulate-bank-transfer`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: '1000' }),
  }
);

// Durumu kontrol et (poll)
const statusRes = await fetch(
  `https://tr-mock-anchor.fly.dev/sep6/transaction?id=${deposit.id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const status = await statusRes.json();
// status.transaction.status: "completed" olana kadar bekle
```

**Deposit durumları:**
- `pending_user_transfer_start` - banka transferi bekleniyor
- `pending_anchor` - anchor işliyor
- `pending_trust` - USDC trustline bekleniyor (kullanıcı trustline açmalı)
- `completed` - USDC gönderildi
- `error` - hata

### 6. Withdraw (USDC -> TRY)

```js
// Withdraw baslat
const withdrawRes = await fetch(
  `https://tr-mock-anchor.fly.dev/sep6/withdraw?` +
  new URLSearchParams({
    asset_code: 'USDC',
    type: 'bank_account',
    amount: '50', // USDC
  }),
  { headers: { Authorization: `Bearer ${token}` } }
);
const withdraw = await withdrawRes.json();
// withdraw.account_id -> Treasury adresi (USDC gonderilecek yer)
// withdraw.memo       -> memo (islem eslestirme icin)
// withdraw.memo_type  -> "id"

// Stellar uzerinden USDC gonder
import { Server, TransactionBuilder, Networks, Operation, Asset, Memo } from '@stellar/stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');
const USDC = new Asset('USDC', 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');

const account = await server.loadAccount(publicKey);
const paymentTx = new TransactionBuilder(account, {
  fee: '100',
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(Operation.payment({
    destination: withdraw.account_id,
    asset: USDC,
    amount: '50',
  }))
  .addMemo(Memo.id(withdraw.memo))
  .setTimeout(30)
  .build();

paymentTx.sign(keypair);
await server.submitTransaction(paymentTx);
// Anchor USDC'yi alir, TRY'yi simule eder
```

### 7. SEP-38 Quote (opsiyonel, kilitli kur için)

```js
// Fiyat bilgisi
const pricesRes = await fetch(
  'https://tr-mock-anchor.fly.dev/sep38/prices?sell_asset=iso4217:TRY&sell_amount=1000',
  { headers: { Authorization: `Bearer ${token}` } }
);

// Kilitli quote al
const quoteRes = await fetch('https://tr-mock-anchor.fly.dev/sep38/quote', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sell_asset: 'iso4217:TRY',
    buy_asset: 'stellar:USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    sell_amount: '1000',
  }),
});
const quote = await quoteRes.json();
// quote.id         -> deposit/withdraw'da quote_id olarak kullan
// quote.buy_amount -> alacagin USDC
// quote.price      -> kilitli kur
// quote.expires_at -> gecerlilik suresi
```

### 8. İşlem geçmişi

```js
// Tum islemler
const txsRes = await fetch(
  'https://tr-mock-anchor.fly.dev/sep6/transactions?asset_code=USDC',
  { headers: { Authorization: `Bearer ${token}` } }
);

// Tek islem (ID, stellar tx id veya external tx id ile)
const txRes = await fetch(
  `https://tr-mock-anchor.fly.dev/sep6/transaction?id=${txId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

## USDC Trustline

Kullanıcının USDC alabilmesi için trustline açık olmalı. Yoksa deposit `pending_trust` durumunda kalır.

```js
import { Server, TransactionBuilder, Networks, Operation, Asset, Keypair } from '@stellar/stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');
const USDC = new Asset('USDC', 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');

const account = await server.loadAccount(publicKey);
const tx = new TransactionBuilder(account, {
  fee: '100',
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(Operation.changeTrust({ asset: USDC }))
  .setTimeout(30)
  .build();

tx.sign(Keypair.fromSecret(SECRET_KEY));
await server.submitTransaction(tx);
```

## Testnet Hesap Fonlama

```js
// Friendbot ile XLM al
await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);

// Circle faucet ile testnet USDC al
// https://faucet.circle.com/ adresinden manuel
```

## Yaygın Hatalar

| Hata | Sebep | Çözüm |
|---|---|---|
| 401 Unauthorized | JWT token süresi dolmuş | SEP-10 auth'u tekrar yap |
| `pending_trust` takıldı | USDC trustline yok | `changeTrust` operation'ı çalıştır |
| Deposit gelmiyor | Banka transferi simüle edilmedi | `POST /sep6/tx/{id}/simulate-bank-transfer` çağır |
| "Unsupported asset_code" | Yanlış asset kodu | `USDC` kullan (büyük harf) |
| "Amount below minimum" | 50 TRY altında deposit | Minimum 50 TRY |
| "Amount above maximum" | 3000 TRY üstü deposit | Maksimum 3000 TRY |
| Withdraw tamamlanmıyor | USDC göndermede memo eksik | `memo_type: "id"` ve doğru memo kullan |

## Önemli Notlar

- Mock Anchor **sadece testnet**'te çalışır. Mainnet'te çalışmaz.
- KYC otomatik onaylanır, gerçek kişisel veri istenmez ve saklanmaz.
- `simulate-bank-transfer` endpoint'i **sadece mock'a özeldir** - gerçek anchor'da böyle bir şey yok.
- Secret key'i **asla** frontend'te tutma, `.env`'e koy, git'e commit etme.
- Deposit'te USDC trustline açık değilse, anchor claimable balance oluşturur.
- Tüm hata response'ları `{"error": "..."}` formatındadır.

## Asset Format (SEP-38)

```
Fiat:    iso4217:TRY
Stellar: stellar:USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
```

## Faydalı Linkler

- Mock Anchor: https://tr-mock-anchor.fly.dev
- SEP Demo (interaktif): https://tr-mock-anchor.fly.dev/explorer
- Guide: https://tr-mock-anchor.fly.dev/guide
- Health: https://tr-mock-anchor.fly.dev/health
- Stellar Lab: https://lab.stellar.org
- Circle USDC Faucet: https://faucet.circle.com
- Stellar Developer Docs: https://developers.stellar.org
