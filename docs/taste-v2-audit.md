# Taste Skill v2 — site ve mimari diyagram auditi

Tarih: 15 Ekim 2026. Uygulama kodu değiştirilmedi; bu dosya ve kanıtları audit çıktısıdır.

**Karar:** Site tutarlı bir mühendislik kimliğine ve güçlü teknik içeriğe sahip. En zayıf nokta, mimarinin anlaşılmasını sağlayacak diyagramların fazla küçük, uzun ve bazı yerlerde yanlış bağlanmış olması. Öncelik yeni efektler eklemek değil; akışların doğruluğu, mobil davranış ve okunabilirlik.

## Yöntem ve sınırlar

- Projede v2 kurulu değildi. Resmî [Taste Skill v2](https://github.com/Leonxlnx/taste-skill/blob/f624f37a8c650b9cc550253104925efe4c8de246/skills/taste-skill/SKILL.md) ve aynı commit içindeki `references/critique.md`, `lint.mjs`, `inspect.mjs` kullanıldı. Kurulum veya skill güncellemesi yapılmadı.
- Yerel Next.js geliştirme sunucusunda `/`, `/platform`, `/projects/agentic-customer-service-platform` için resmî inspector 1440, 768 ve 390 px genişliklerde çalıştırıldı. Screenshot'lar incelendi.
- On proje mimarisi ayrıca 1440 ve 390 px'de ölçülüp görüntülendi: Agent, RAG, ModelOps, Commerce, DecisionSQL, dbt Feature Lineage, Terraform/Docker Lab, Repo Context Forge, Agentic SRE ve ML Platform.
- Writing tarafında iki örnek kontrol edildi: `agent-prompt-injection-guardrails` ve `kafka-at-least-once-idempotency`. Bütün 24 yazı diyagramı tek tek incelenmedi.
- RAG için light mode görüntüsü de kontrol edildi. Tema denetimi bütün sayfalara yayılmadı.
- Platform düğmesi seçildiğinde detay panelinin güncellendiği doğrulandı. Tam klavye/ekran okuyucu testi, Lighthouse, performans profili veya dış repo iddialarının doğrulaması yapılmadı.
- Uzun sayfalarda inspector'ın ekran örnekleme sınırı var; bu nedenle mimari bölümleri ayrıca hedeflendi. Bu, bütün sitenin her etkileşiminin test edildiği anlamına gelmez.

Ham bulgular: [check-results.json](audits/taste-v2/check-results.json). Diyagram ölçümleri: [diagram-measurements.json](audits/taste-v2/diagram-measurements.json).

## Öncelikli bulgular

### 1. P1 — Agent politika sonuçları yürütme yoluna yanlış birleşiyor

**Kanıt:** [Masaüstü](audits/taste-v2/agentic-policy-desktop.jpg), [mobil](audits/taste-v2/agentic-policy-mobile.jpg).

`Allow`, `Confirm`, `Human`, `Deny` aynı stage içinde ve stage'in çıkışı `merge`. Renderer her düğüme çıkış kolu ekliyor. Sonuç: `Deny — no execution` bile `Confirmation Boundary` yoluna bağlanmış görünüyor. Mobilde alt alta dizilim, dört alternatif kararı bir işlem sırası gibi okutuyor. Ekran okuyucu için üretilen ilişki cümlesi de bütün sonuçları birlikte bir sonraki aşamaya taşıyor.

Kaynak: `data/architectures.ts:83`, `components/content/architecture-diagram.tsx:195`, `components/content/architecture-diagram.tsx:105`.

**Öneri:** Stage seviyesinde ortak çıkış yerine açık `source → target` edge modeli kullan. `Deny` terminal, `Human` ayrı escalation yolu olmalı; yalnız ilgili sonuçlar confirmation/revalidation hattına bağlanmalı. Mobilde alternatifleri koşullarıyla sun. Kabul ölçütü: Deny'dan execution'a çizilmiş veya metinsel bir yol bulunmaması.

### 2. P1 — RAG satır dönüşleri gerçek kaynak düğümünü bulmuyor

**Kanıt:** [RAG masaüstü](audits/taste-v2/rag-desktop.jpg), [light mode](audits/taste-v2/rag-light.jpg).

`rows: [3, 2, 2]` düzeninde ikinci satırın sonundaki `Versioned Collection`, x≈788–991 aralığında. Sonraki satıra inen connector x≈635'te; kutudan yaklaşık 153 px solda başlıyor. Çizgi boşluktan çıkıp `Compatibility Check` kutusuna giriyor. İkinci satırın başındaki dönüşte de çizginin kutu merkeziyle hizası kayıyor.

Kaynak: `data/architectures.ts:399`, `components/content/architecture-diagram.tsx:122`, `app/globals.css:1911`.

**Öneri:** Dönüşü maksimum kolon sayısından ve yalnız start/end seçeneğinden hesaplama. Her satırın gerçek başlangıç/bitiş portunu kullan veya sıra düzenini eşit uzunluklara indir. Kabul ölçütü: Her edge'in iki ucu da ilgili kutunun portuna değmeli; iki temada da boşluktan başlayan edge kalmamalı.

### 3. P1 — Mobilde ters satır okları masaüstü yönünü koruyor

`[data-row-direction="reverse"] .architecture-connector` ve `::after` seçicileri mobildeki genel connector kurallarından daha özgül. Böylece `right`, `left` ve ok dönüşü doğru sıfırlanmıyor. 390 px Agent görünümünde bazı connector'lar merkez x≈195 yerine x≈35'e kayıyor. Birleştirme okunun ucu da aşağı yerine çapraza/sola bakıyor.

Kaynak: `app/globals.css:1744`, `app/globals.css:1761`, `app/globals.css:8140`. Kanıt: [Agent mobil](audits/taste-v2/agentic-policy-mobile.jpg), ham computed style değerleri `check-results.json → supplemental`.

**Öneri:** Mobil kurallarında reverse seçicilerini de açıkça kapsa; yatay konumları, border'ları ve pseudo-element dönüşlerini sıfırla. Branch/merge topolojisini salt dikey yığına dönüştürmekten kaçın.

### 4. P1 — Writing diyagramı yalnız kendisini değil, makaleyi genişletiyor

390 px cihaz emülasyonunda iki örnek yazıda layout genişliği yaklaşık 722 px'e çıkıyor; `.article-prose` yaklaşık 706 px oluyor. Diyagramın scroll bölgesi 704 px genişlikte ve `clientWidth === scrollWidth`; dolayısıyla beklenen iç yatay scroll oluşmuyor. Başlıklar ve paragraflar da ekranın sağından taşıyor.

Kaynak: `app/globals.css:6297`, `app/globals.css:6306`, `app/globals.css:6473`. Kanıt: [Writing mobil](audits/taste-v2/writing-mobile.jpg).

**Öneri:** Mobil grid track ve `.article-content` için küçülmeye izin ver (`minmax(0, 1fr)`, `min-width: 0`); 44rem SVG taban genişliğini gerçekten sınırlandırılmış scroll region içinde tut. Kabul ölçütü: 390 px'de yazı gövdesi ekrana sığmalı; yatay kaydırma yalnız diyagram bölgesinde kalmalı. Daha sonra mobil için özet/alternatif düzen düşünülmeli.

### 5. P1 — Platform kanıt kartlarında iki case study bağlantısı 404

`ProofCard`, platform node ID'sini project slug sanıyor. Tarayıcıdan yapılan isteklerde `/projects/knowledge` ve `/projects/modelops` **404** döndü. Gerçek yollar `/projects/knowledge-base-rag` ve `/projects/modelops-control-plane`.

Kaynak: `components/content/platform-page.tsx:72`.

**Öneri:** Platform verisine açık project slug ekle veya merkezi bir eşleme kullan. Kanıt okumaya gelen ziyaretçinin ana yolunu kesiyor; görsel düzenlemeden önce düzeltilmeli.

### 6. P1 — Platform mobil görünümü paralel yetenekleri seri akış gibi gösteriyor

Masaüstünde KNOW, UNDERSTAND ve ACT aynı seviyede, ortak runtime'a bağlanan üç yetenek. Mobilde bunlar dikey diziliyor ve aralarına dashed connector konuyor: RAG → DecisionSQL → Agent Runtime → Router izlenimi oluşuyor. Responsive düzen sistemin ilişkisini değiştiriyor.

Kaynak: `app/globals.css:4597`, `app/globals.css:4624`. Kanıt: [Platform mobil](audits/taste-v2/platform-mobile.jpg).

**Öneri:** Üç yeteneği tek bir capability grubu olarak sun; ortak runtime'a tek grup bağlantısı veya her yeteneğe ait açık ilişki açıklaması kullan. Kardeş düğümleri birbirine bağlama.

### 7. P2 — Diyagram yazıları içerik önemine göre fazla küçük

Ortak renderer'da tür etiketi **8.32 px**, connector etiketi **9.28 px**, alt açıklama **10.56 px**, liste maddeleri **9.92 px**. Agent örneğinde node başlığı yaklaşık **12.96 px**. Bunlar ikincil süs değil; mimariyi açıklayan asıl bilgiler. Mobilde kolon sayısı azalıyor, tipografi anlamlı biçimde büyümüyor.

Kaynak: `app/globals.css:1678`, `app/globals.css:1686`, `app/globals.css:1695`, `app/globals.css:1714`, `app/globals.css:1894`.

**Öneri:** Node başlığı 15–16 px, açıklama 13–14 px, önemli ilişki etiketi en az 13 px hedefle. Bunu mevcut bütün düğümlere tek seferde uygulamak yerine önce görünür düğüm sayısını azalt. Tekrarlanan `Service / Control / Persistence` mikro etiketlerinin hangilerinin karar vermeye yardım ettiğini gözden geçir.

### 8. P2 — Diyagramlar overview yerine uzun yürütme dökümüne dönüşüyor

| Proje | Düğüm | Masaüstü diyagram yüksekliği | Mobil diyagram yüksekliği |
| --- | ---: | ---: | ---: |
| Agent | 33 | 3264 px | 5869 px |
| RAG | 23 | 1563 px | 3226 px |
| ModelOps | 22 | 2063 px | 3793 px |
| ML Platform | 27 | 2008 px | 4071 px |
| DecisionSQL | 23 | 1720 px | 3293 px |

Agent diyagramı tek başına yaklaşık yedi adet 844 px mobil ekran uzunluğunda. Okuyucu ana kontrol sınırını hatırlamak için binlerce piksel geri gitmek zorunda. Dar sol açıklama sütunu da çok satırlı küçük paragraflara dönüşüyor.

**Öneri:** İlk katmanda 5–7 ana bileşen ve güven sınırlarını göster. Request, policy, knowledge, state, observability ayrıntılarını ayrı, adlandırılmış alt görünümlere taşı. Bu bir tasarım önerisidir; tüm projeleri aynı yedi kutuya zorlamak doğru olmaz. Ana görünüm tüm sistemi anlatmalı, ayrıntı ihtiyaca göre açılmalı.

### 9. P2 — Connector etiketleri kutuların başlıklarını örtüyor; RAG'de gizleniyor

ML Platform'da `OIDC + project roles`, `commit intent`, `apply + observe` etiketlerinin koyu zeminleri komşu node'ların alanına giriyor. `Reconcilers` başlığı bu etiketle kısmen örtülüyor. Repo Context Forge'da `atomic artifacts` benzer biçimde `Context Output` başlığına yaklaşıyor. RAG için ise 821 px üstünde bütün inline edge etiketleri `display: none`; `source documents`, `writes inactive version`, `activates or rolls back` gibi ilişki bilgileri kayboluyor.

Kaynak: `app/globals.css:1890`, `app/globals.css:6034`. Kanıt: [ML Platform](audits/taste-v2/ml-platform-desktop.jpg), [RAG](audits/taste-v2/rag-desktop.jpg).

**Öneri:** Edge etiketlerine ayrılmış güzergâh/boşluk tanımla ve metnin kutu sınırlarıyla kesişmesini kontrol et. Okunamayan etiketi gizlemek yerine düzeni düzelt veya ilişkiyi görünür metinle açıkla.

### 10. P2 — “Evidence first” sözü sayfa sırasıyla uyuşmuyor

Platform hero indeksi `Evidence → Architecture → Integration` diyor. Gerçek DOM sırası hero → architecture → implemented systems. Birincil CTA kanıta atlayabiliyor; normal kaydırma yine vizyonu önce gösteriyor. Hero başlığı 1440 px'de de 390 px'de de dört satır; mimari/kanıt ilk ekranda görülemiyor.

Kaynak: `components/content/platform-page.tsx:313`, `components/content/platform-page.tsx:323`, `components/content/platform-page.tsx:330`, `components/content/platform-page.tsx:428`. Kanıt: [Platform hero](audits/taste-v2/platform-hero.jpg).

**Öneri:** Kanıt bloklarını mimariden önce getir. Başlığı kısa bir ana ifade ve daha küçük açıklama olarak düzenle; “building toward” sınırını koru. Bu değişiklik sitenin mevcut ürün ilkesini güçlendirir.

## Taste v2 açısından görsel değerlendirme

Güçlü taraflar: tek ve tutarlı yeşil vurgu, belirgin başlık hiyerarşisi, gerçek teknik kavramlar, sınırları belirtilmiş kanıt, proje içi bölüm navigasyonu. Platform'da düğüm seçimi çalışıyor ve detayları yalnız hover'a saklamıyor. Standart proje diyagramlarının ölçülen ekranlarında sayfa yatay taşması görülmedi; Writing istisnası yukarıda ayrı gösterildi.

Zayıf taraflar: deneyim çoğunlukla küçük yazı, ince çizgi, kutu ve tekrar eden mono/caps etiketlerinden kuruluyor. Büyük başlıkların altında aynı yoğun belge dili tekrarlanıyor. Ana sayfa gerçek sistem çıktıları göstermeden çok sayıda teknik iddiayı metin olarak taşıyor. Özgünlük için en iyi malzeme zaten projelerde var: trace, replay, gerçek console, admission kararı ve benchmark sonucu. Bunlardan birkaçını büyük, okunabilir kanıt olarak göstermek stok görsel eklemekten daha yararlı olur.

V2'nin dört fotoğraf şartı, mono/index ve hairline yasakları birer **stil kuralı**. Teknik diyagramın işlevsel edge'lerini veya kod bloklarını dekorasyon sayıp silmek doğru olmaz. Buna karşılık aynı dilin sayfa başlıklarında, her kartın üstünde ve bütün meta alanlarında tekrarlanması azaltılabilir. Ek animasyon, mevcut topoloji hatalarından daha düşük öncelikte.

## Resmî gate sonuçları

Statik lint 65 dosyada **291 FAIL ve 89 WARN** üretti; bunların **228'i hairline** eşleşmesi. Bunlar 291 bağımsız kullanıcı hatası değil; tekrar eden stil kuralları ve diyagram çizgileri de sayılıyor.

| Yüzey | Inspector FAIL | WARN | Öne çıkan ölçüm |
| --- | ---: | ---: | --- |
| Ana sayfa | 13 | 6 | 87 metin bloğu <13 px; hero politika etiketlerinde 1.9:1 kontrast |
| Platform | 13 | 8 | 201 metin bloğu <13 px; h1 dört satır |
| Agent case study | 9 | 8 | 165 metin bloğu <13 px; mobilde uzun başlıklar |

Inspector bulguları viewport'lar arasında birleştirilmiş kayıt sayılarıdır. Inspector üç yüzeyde JavaScript exception kaydetmedi. Ana sayfanın `allow / confirm / human / deny` kontrastı animasyonun pasif anında ölçülmüş; sonuçları okuyabilmek sürekli animasyona bağlı kalmamalı. Performans veya tam erişilebilirlik uygunluğu sonucu çıkarılmadı.

## Critique — ROUND 1

**Ana sayfa**

Seen in one second: Büyük meslek başlığı ve yeşil proje CTA'sı.
Idea (one sentence): Mühendislik yaklaşımı bir request lifecycle ile anlatılıyor; yaklaşım teknik ama başka bir AI mühendisinin portföyüne de taşınabilir.
Live thing: Animasyonlu request lifecycle; ana projelerin gerçek çıktıları ilk ekranda etkileşimli değil.
Layout words by section: hero=split / highlights=grid / work=list / areas=list / experience=split / writing=list / graph=CTA / contact=split.
Scores: design 6 · usability 7 · creativity 6 · content 8 → weighted 6.5 → **overall 6.0**.
Caps applied: Inspector FAIL nedeniyle 6.0 üst sınırı; ayrıca eyebrow/mono/index ve görsel eksikliği sınırları mevcut.
Top three problems: (1) küçük teknik metin ve düşük kontrastlı lifecycle etiketleri, (2) gerçek sistem kanıtı yerine metin ağırlığı, (3) benzer liste/etiket ritminin bütün sayfaya yayılması. Kanıt: `home-hero.jpg` ve inspector kayıtları. Çözüm: okunabilirlik tabanı, büyük gerçek ürün çıktısı, daha belirgin bölüm kompozisyonları.

**Platform**

Seen in one second: Dört satırlık platform vizyonu.
Idea (one sentence): Bağımsız kanıtlanmış sistemler ortak mimariye evriliyor.
Live thing: Seçilebilir mimari düğümleri ve güncellenen detay paneli.
Layout words by section: hero=split / architecture=graph+detail / evidence=grid / lifecycle=flow / principles=list / roadmap=timeline / close=statement.
Scores: design 6 · usability 5 · creativity 6 · content 8 → **overall 5.9**.
Caps applied: Inspector FAIL nedeniyle maksimum 6.0.
Top three problems: (1) mobil grafiğin ilişki anlamını değiştirmesi, (2) iki case study yolunun 404 olması, (3) kanıtın mimariden sonra gelmesi. Kanıt: `platform-mobile.jpg`, HTTP sonuçları, `platform-hero.jpg`. Çözüm: paralelliği koruyan mobil görünüm, slug eşlemesi, kanıtı öne alma.

**Agent case study**

Seen in one second: Çok büyük proje adı ve deterministik yetki ilkesi.
Idea (one sentence): Modelin önerisi ile yürütme yetkisi ayrılıyor.
Live thing: Repository/product-proof bağlantıları ve görsel kanıtlar; mimari salt okunur.
Layout words by section: hero=statement / capabilities=grid / workflow=steps / authority=table / architecture=flows / decisions=list / proof=media / evidence=metrics.
Scores: design 6 · usability 5 · creativity 6 · content 9 → **overall 6.0**.
Caps applied: Inspector FAIL nedeniyle maksimum 6.0.
Top three problems: (1) politika kararlarının yanlış birleşmesi, (2) mobil connector yönleri, (3) 33 düğümlü 5869 px diyagram. Kanıt: `agentic-policy-desktop.jpg`, `agentic-policy-mobile.jpg`, ölçüm JSON'u. Çözüm: açık edge modeli, doğru mobil portlar, overview ve ayrıntı katmanları.

Bu puanlar Taste v2'nin katı rubriğine göre verilmiş editoryal değerlendirmelerdir; genel mühendislik kalitesi veya bütün site için standart bir kalite ölçümü değildir. Audit istendiği için fix döngüsü ve yeni art direction draw çalıştırılmadı; redesign yapılmadı.

## Uygulama sırası

1. Yanlış edge/topoloji, mobil yönler, Writing taşması ve 404 yolları.
2. Mimari overview/ayrıntı ayrımı ve okunabilir tipografi.
3. Platform'da kanıt sırası, kısa başlıklar ve gerçek sistem çıktıları.
4. Gereksiz çerçeve, index ve mikro etiketleri azaltma; mevcut renk/kimlik korunabilir.

Kontrol tamamlanma ölçütleri: terminal kararlardan execution yolu çıkmaması; bütün edge uçlarının portlara bağlanması; mobilde paralelliğin korunması; Writing gövdesinin 390 px'e sığması; iki case study linkinin 200 dönmesi; overview'un ayrıntıya girmeden ana güven sınırını anlatması.
