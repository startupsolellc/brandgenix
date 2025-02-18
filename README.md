# name-generator
# BrandGenix - AI-Powered Brand & Logo Name Generator

BrandGenix, yapay zeka destekli bir marka adı ve logo oluşturucu uygulamasıdır. Bu sistem, modern, kurumsal ve minimalist markalar için hızlı ve etkili bir şekilde isim önerileri sunar. Ayrıca özelleştirme seçenekleri ile kullanıcıların marka kimliklerini kişiselleştirmelerine olanak tanır.

## 🚀 **Özellikler**

- **AI Destekli İsim Üretimi**: Kullanıcı tarafından girilen anahtar kelimeler veya kategorilere göre akıllı isim önerileri.
- **İsim Özelleştirme**: Kullanıcılar, Konva.js destekli düzenleyici ile font, renk ve boyut gibi değişiklikler yapabilir.
- **İndirilebilir Formatlar**: PNG ve WebP olarak marka tasarımlarını indirme.
- **Firebase Authentication**: Google ile giriş yapma ve kullanıcı hesap yönetimi.
- **Firebase Realtime Database**: Kullanıcıların ürettiği isimler, indirme sayıları ve premium durumlarının saklanması.
- **Admin Paneli**: Yönetici, kullanıcıları görüntüleyebilir, isim üretme limitlerini değiştirebilir ve premium yetkilendirmeleri yapabilir.
- **Mobil Uyumluluk**: Mobil cihazlar için optimize edilmiş arayüz ve duyarlı tasarım.

---

## 🏗 **Mimari & Teknik Yapı**

### 📂 **Proje Dosya Yapısı**
```
BrandGenix/
│── functions/                  # Netlify Functions & Firebase işlemleri
│   ├── firebase-auth.js        # Firebase kimlik doğrulama işlemleri
│   ├── admin-auth.js           # Admin erişim kontrolü
│   ├── get-fonts.js            # Google Fonts API
│── public/                     # Statik dosyalar
│── src/                        # Frontend bileşenleri
│   ├── js/                     # JavaScript dosyaları
│   │   ├── script.js           # Genel işlevler ve event listenerlar
│   │   ├── admin.js            # Admin paneli işlemleri
│   │   ├── generate-name.js    # AI destekli isim üretme
│   │   ├── customize.js        # Konva.js ile logo düzenleme
│   ├── styles/                 # CSS dosyaları
│── netlify.toml                # Netlify yapılandırması
│── package.json                # Bağımlılıklar
│── index.html                  # Ana sayfa
│── admin.html                  # Admin paneli
│── customize.html               # Logo özelleştirme sayfası
│── results.html                # Üretilen isimler sayfası
│── header.html                  # Header componenti
│── footer.html                  # Footer componenti
```

---

## 🔥 **Teknolojiler**
- **Frontend**: HTML, CSS (TailwindCSS), JavaScript
- **Backend**: Netlify Functions, Firebase Realtime Database, Firebase Authentication
- **API & Kütüphaneler**:
  - **Firebase**: Kimlik doğrulama ve veritabanı
  - **Konva.js**: Canvas tabanlı logo düzenleme
  - **Google Fonts API**: Dinamik font yükleme
  - **Node.js**: Netlify Functions ve veri yönetimi

---

## ⚡ **Kurulum**

### 🔹 **1. Depoyu Klonlayın**
```sh
git clone https://github.com/kullanici/brandgenix.git
cd brandgenix
```

### 🔹 **2. Bağımlılıkları Yükleyin**
```sh
npm install
```

### 🔹 **3. Firebase API Anahtarlarını Netlify ile Tanımlayın**
Firebase API bilgilerini `.env` veya `netlify.toml` dosyasında şu şekilde tanımlayın:
```toml
[build]
command = "echo \"window.env = { FIREBASE_API_KEY: '${FIREBASE_API_KEY}', FIREBASE_AUTH_DOMAIN: '${FIREBASE_AUTH_DOMAIN}', FIREBASE_PROJECT_ID: '${FIREBASE_PROJECT_ID}', FIREBASE_STORAGE_BUCKET: '${FIREBASE_STORAGE_BUCKET}', FIREBASE_MESSAGING_SENDER_ID: '${FIREBASE_MESSAGING_SENDER_ID}', FIREBASE_APP_ID: '${FIREBASE_APP_ID}' };\" > functions/env.js"
publish = "."
```

### 🔹 **4. Netlify CLI ile Çalıştırın**
```sh
netlify dev
```
📌 **Yerel geliştirme ortamı `http://localhost:8888` adresinde çalışacaktır.**

---

## 👨‍💻 **Geliştirici Rehberi**

### 🛠 **Önemli Komutlar**
- **`npm install`** → Bağımlılıkları yükler.
- **`netlify dev`** → Netlify Functions ile yerel geliştirme ortamını çalıştırır.
- **`firebase deploy`** → Firebase projelerini dağıtır.

### 🔹 **Admin Paneli Yetkilendirme**
Admin erişimi yalnızca şu e-posta adresine verilir:
```js
const adminEmail = "mdikyurt@gmail.com";
```
🚀 **Bu admin harici kullanıcılar `admin.html` sayfasına erişemez.**

### 🔹 **Kullanıcı Yetkilendirme ve İsim Üretme Limitleri**
- **Giriş yapmayanlar**: 5 isim üretebilir.
- **Giriş yapanlar**: `Firebase Realtime Database` içindeki `generatedNames` değişkenine bağlıdır.
- **Admin**: Kullanıcıların limitlerini `admin.html` üzerinden değiştirebilir.

---

## 🎯 **Geliştirme Planı**
- [x] Google ile giriş sistemi
- [x] Firebase Realtime Database entegrasyonu
- [x] AI destekli isim üretme
- [x] Konva.js ile logo özelleştirme
- [x] Admin paneli
- [ ] Kullanıcılar için favori listesi ekleme (Planlanıyor)
- [ ] Daha gelişmiş premium özellikler (Planlanıyor)

📌 **BrandGenix’i geliştirmek için katkıda bulunmak isterseniz, PR’larınızı bekliyoruz!** 🚀

