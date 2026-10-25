# MangasKino — MVP starter

Монгол хэлтэй богино киноны каталог, бүртгэл/нэвтрэлт, VIP entitlement, админ видео upload, QPay Merchant V2 invoice + callback verification бүхий хөгжүүлэлтийн эхлэл.

## Шаардлага
- Node.js 20+
- QPay merchant credentials, `invoice_code` (эхний ээлжид sandbox)
- Түгээх эрхтэй видео файлууд

## Ажиллуулах
1. Энэ хавтсыг компьютер дээрээ татаж ав.
2. Terminal дээр энэ хавтас руу ор.
3. `npm install`
4. `.env.example` файлыг `.env` нэрээр хуулж утгуудыг бөглө.
5. `npm start`
6. `http://localhost:3000` нээ.

Windows PowerShell дээр `.env` хуулбарлах: `Copy-Item .env.example .env`
macOS/Linux: `cp .env.example .env`

## QPay тохиргоо
- Эхлээд QPay-тай мерчантын бүртгэл, sandbox эрх, `QPAY_INVOICE_CODE`-оо тохируул.
- `QPAY_BASE_URL=https://merchant-sandbox.qpay.mn`-оор sandbox турш.
- QPay callback нь гаднаас хүрч болох HTTPS URL байх ёстой. Localhost callback QPay-ээс хүрэхгүй. Нийтэд гаргахдаа `SITE_URL=https://your-domain.example` тохируул.
- Production руу зөвхөн QPay-аас production credentials авч, sandbox урсгалыг шалгасны дараа шилж.
- Энэ starter QPay callback-ийг дангаар нь итгэхгүй; `/v2/payment/check`-ээр серверээс төлбөрийг шалгаад дараа нь VIP эрх олгоно.
- QPay invoice payload-ын нэмэлт талбар, callback бүтэц нь мерчантын гэрээ болон QPay тохиргооноос шалтгаалж болно. Тэдний одоогийн API docs-оор шалгана уу: https://developer.qpay.mn/mn/docs/merchant?version=2.0.0

## Админ видео оруулах
- `.env` дахь `ADMIN_KEY`-г урт, таахад хэцүү утгаар солино.
- Сайт дахь “Админ — кино нэмэх” хэсэгт түлхүүрээ оруулж, киноны нэр, тайлбар, MP4 зэрэг видео файлаа сонго.
- Видео `uploads/` дотор хадгалагдана. Энэ нь том файлын улмаас серверийн диск их ашиглаж болзошгүй.

## Чухал хязгаарлалтууд — production-д гаргахаас өмнө заавал засах
- Энэ бол MVP/demo, production-ready гэж үзэж болохгүй.
- Express-ийн default MemoryStore нь production-д тохиромжгүй. Persistent session store тохируул.
- HTTPS, rate limiting, CSRF хамгаалалт, нууц үг сэргээх, имэйл баталгаажуулалт, privacy/terms, backup болон monitoring нэм.
- Видео файлууд local disk дээр байна. Cloud deployment дээр persistent storage эсвэл private video storage/CDN тохируулж, signed URL/token ашигла.
- Бүх video file-size, disk quota, file scanning болон upload authorization-ийг production-д сайжруул.
- Одоогийн VIP загвар 30 хоногийн access олгоно; давхардсан хугацаа сунгах, refund, payment reconciliation болон админ moderation-ийг өргөтгө.
- QPay callback төлбөрийн баталгаажуулалт нь үндсэн урсгалын жишээ. Таны мерчантын төлбөрийн response shape-тай тулгаж туршилт хийнэ.
- Энэ нь жинхэнэ хэрэглэгчид нээлттэй нийтлэгдээгүй; QPay credentials байхгүй бол төлбөр үүсэхгүй.
- Зөвхөн зохиогчийн эрх эзэмшдэг эсвэл төлбөртэйгээр түгээх бичгээр зөвшөөрөлтэй кино байршуул.

## Файлын бүтэц
- `server.js` — Express backend, user auth, upload, VIP video gate, QPay flow
- `public/index.html` — responsive frontend
- `.env.example` — нууц тохиргооны загвар
- `uploads/` — local video storage (git-д оруулахгүй)
- `data/` — SQLite database (git-д оруулахгүй)
