import type { Lang } from '@/i18n/core';

/** Mineral names as [English, Somali, Arabic, Chinese]. */
const N: Record<string, [string, string, string, string]> = {
  emerald: ['Emerald', 'Emerald', 'الزمرد', '祖母绿'], beryl: ['Beryl', 'Beryl', 'البريل', '绿柱石'], sapphire: ['Sapphire', 'Sapphire', 'الياقوت الأزرق', '蓝宝石'],
  garnet: ['Garnet', 'Garnet', 'العقيق الرماني', '石榴石'], spinel: ['Spinel', 'Spinel', 'السبينل', '尖晶石'], jade: ['Nephrite jade', 'Jade (nephrite)', 'اليشم', '软玉'],
  ruby: ['Ruby', 'Ruby', 'الياقوت الأحمر', '红宝石'], amethyst: ['Amethyst', 'Amethyst', 'الجمشت', '紫水晶'], tourmaline: ['Tourmaline', 'Tourmaline', 'التورمالين', '电气石'], topaz: ['Topaz', 'Topaz', 'التوباز', '黄玉'],
  gold: ['Gold', 'Dahab', 'الذهب', '金'], silver: ['Silver', 'Lacag-bir', 'الفضة', '银'], copper: ['Copper', 'Naxaas', 'النحاس', '铜'], lead: ['Lead', 'Rasaas', 'الرصاص', '铅'],
  zinc: ['Zinc', 'Zinc', 'الزنك', '锌'], tin: ['Tin', 'Tin', 'القصدير', '锡'], tungsten: ['Tungsten', 'Tungsten', 'التنغستن', '钨'], tantalum: ['Tantalum', 'Tantalum', 'التنتالوم', '钽'],
  niobium: ['Niobium', 'Niobium', 'النيوبيوم', '铌'], molybdenum: ['Molybdenum', 'Molybdenum', 'الموليبدينوم', '钼'], nickel: ['Nickel', 'Nickel', 'النيكل', '镍'], chromium: ['Chromium', 'Chromium', 'الكروم', '铬'],
  iron: ['Iron', 'Bir', 'الحديد', '铁'], manganese: ['Manganese', 'Manganese', 'المنغنيز', '锰'], titanium: ['Titanium (rutile, ilmenite)', 'Titanium (rutile, ilmenite)', 'التيتانيوم (روتيل، إلمنيت)', '钛（金红石、钛铁矿）'],
  bismuth: ['Bismuth', 'Bismuth', 'البزموت', '铋'], platinum: ['Platinum-group metals', 'Platinum-group metals', 'معادن مجموعة البلاتين', '铂族金属'], lithium: ['Lithium (unverified)', 'Lithium (aan la xaqiijin)', 'الليثيوم (غير مؤكد)', '锂（未证实）'],
  zircon: ['Zircon', 'Zircon', 'الزركون', '锆石'], monazite: ['Monazite', 'Monazite', 'المونازيت', '独居石'], rareearth: ['Allanite and samarskite', 'Allanite iyo samarskite', 'الأنيت والسمارسكيت', '褐帘石和铌钇矿'],
  gypsum: ['Gypsum', 'Gypsum', 'الجبس', '石膏'], anhydrite: ['Anhydrite', 'Anhydrite', 'الأنهيدريت', '硬石膏'], limestone: ['Limestone', 'Dhagaxda ciid-qaadka', 'الحجر الجيري', '石灰岩'],
  salt: ['Rock salt', 'Cusbo', 'ملح الصخور', '岩盐'], barite: ['Barite', 'Barite', 'الباريت', '重晶石'], fluorite: ['Fluorite', 'Fluorite', 'الفلورايت', '萤石'], mica: ['Mica', 'Mica', 'الميكا', '云母'],
  graphite: ['Graphite', 'Graphite', 'الجرافيت', '石墨'], kyanite: ['Kyanite', 'Kyanite', 'الكيانيت', '蓝晶石'], talc: ['Talc', 'Talc', 'التلك', '滑石'], vermiculite: ['Vermiculite', 'Vermiculite', 'الفرميكيولايت', '蛭石'],
  asbestos: ['Asbestos', 'Asbestos', 'الأسبستوس', '石棉'], quartz: ['Quartz and silica sand', 'Quartz iyo ciid silica ah', 'الكوارتز ورمل السيليكا', '石英和硅砂'], apatite: ['Apatite', 'Apatite', 'الأباتيت', '磷灰石'],
  guano: ['Guano (phosphate)', 'Guano (phosphate)', 'الغوانو (الفوسفات)', '鸟粪（磷酸盐）'], kaolin: ['Kaolin', 'Kaolin', 'الكاولين', '高岭土'], strontium: ['Strontium', 'Strontium', 'السترونتيوم', '锶'],
  bromine: ['Bromine (hot springs)', 'Bromine (ceelasha kulul)', 'البروم (الينابيع الحارة)', '溴（温泉）'], clay: ["Fuller's earth clay", "Fuller's earth", 'طين فولر', '漂白土'], stone: ['Building stone, marble, granite', 'Dhagax dhisme, marble, granite', 'حجر البناء والرخام والغرانيت', '建筑石材、大理石、花岗岩'],
  feldspar: ['Feldspar', 'Feldspar', 'الفلسبار', '长石'], oil: ['Oil and gas basin', 'Dooxada saliidda iyo gaaska', 'حوض النفط والغاز', '油气盆地'], coal: ['Lignite coal', 'Dhuxul (lignite)', 'فحم الليغنيت', '褐煤'],
  oilshale: ['Oil shale', 'Oil shale', 'الصخر الزيتي', '油页岩'], uranium: ['Uranium', 'Uranium', 'اليورانيوم', '铀'],
};
const idx: Record<Lang, number> = { en: 0, so: 1, ar: 2, zh: 3 };
export const mineralName = (id: string, lang: Lang) => N[id]?.[idx[lang]] ?? id;
export const KNOWN_MINERALS = Object.keys(N);

type UI = {
  title: string; hint: string; clear: string; pick: string; records: (n: number) => string; point: string; district: string; reported: string; outside: string;
  basis: Record<string, string>; precisionNote: string; source: string; none: string; selected: string; unknownSite: string; typeOf: Record<string, string>;
  evidence: Record<string, string>; company: string; projects: string; priority: (n: number) => string; evidenceNote: string; port: string;
};
const mk = (u: Omit<UI, 'typeOf'> & { types: [string, string, string, string] }): UI => ({ ...u, typeOf: { occurrence: u.types[0], prospect: u.types[1], mine: u.types[2], spring: u.types[3] } });
export const FINDER: Record<Lang, UI> = {
  en: mk({
    title: 'Find a mineral', hint: 'Choose a mineral to see every place it has been recorded.', clear: 'Clear', pick: 'Minerals', records: (n) => `${n} ${n === 1 ? 'record' : 'records'}`,
    point: 'Mapped site (USGS, accurate to about 2 km)', district: 'Region only, exact location not published', reported: 'Reported in Somaliland, locality not given',
    outside: 'Recorded outside the six regions shown (border zone or neighbouring region), so it is not pinned',
    basis: { survey: 'Published survey', gov: 'Government listing', trade: 'Gemstone trade', anomaly: 'Unconfirmed anomaly', estimate: 'Surface estimate, not a resource', unverified: 'Unverified report' },
    precisionNote: 'Mapped sites were transcribed by USGS from 1950s and 1960s colonial survey maps and rounded to about 2 km. They need field checking.', source: 'Source', none: 'No record for this mineral yet.', selected: 'Selected', unknownSite: 'Unnamed',
    evidence: { observed: 'Observed in the field', reported: 'Reported by local miners', unverified: 'Unverified, no test', inferred: 'Geologist\'s inference', confirmed: 'Confirmed by lab' }, company: 'Company field record', projects: 'Company project areas', priority: (n) => `Priority ${n}`, port: 'Port site', evidenceNote: 'Company field records come from a reconnaissance survey in 2017 and a 2024 prospect survey. They show where to sample next. They are not assays, grades or resource estimates, and they do not mean an area is licensed.',
    types: ['Occurrence', 'Prospect', 'Mine', 'Hot spring'],
  }),
  so: mk({
    title: 'Raadi macdan', hint: 'Dooro macdan si aad u aragto meel kasta oo laga diiwaangeliyay.', clear: 'Tirtir', pick: 'Macdanta', records: (n) => `${n} diiwaan`,
    point: 'Goob khariidad ah (USGS, qiyaastii 2 km gudahood)', district: 'Gobol kaliya, goobta saxda ah lama daabicin', reported: 'Laga sheegay Somaliland, goobta lama sheegin',
    outside: 'Waxaa laga diiwaangeliyay banaanka lixda gobol ee la muujiyay (aagga xadka ama gobol deriska ah), sidaas darteed lama calaamadin',
    basis: { survey: 'Sahan la daabacay', gov: 'Liis dawladeed', trade: 'Ganacsiga dhagaxyada qaaliga ah', anomaly: 'Calaamad aan la xaqiijin', estimate: 'Qiyaas dusha ah, ma aha kheyraad', unverified: 'Warbixin aan la xaqiijin' },
    precisionNote: 'Goobaha khariidadda waxaa USGS ka qoray khariidado sahan oo gumeysi (1950-1960) lagana soo xigtay qiyaas ahaan 2 km. Waxay u baahan yihiin hubin goobta.', source: 'Il', none: 'Weli ma jiro diiwaan macdantan ah.', selected: 'La doortay', unknownSite: 'Magac la\'aan',
    evidence: { observed: 'La arkay goobta', reported: 'Laga sheegay macdan-qodayaasha', unverified: 'Aan la xaqiijin, tijaabo la\'aan', inferred: 'Fikirka juqraafiga', confirmed: 'Lab ayaa xaqiijiyay' }, company: 'Diiwaan goob ee shirkadda', projects: 'Goobaha mashruuca shirkadda', priority: (n) => `Mudnaan ${n}`, port: 'Goobta dekedda', evidenceNote: 'Diiwaannada goobta shirkadda waxay ka yimaadeen sahan hordhac ah oo 2017 ah iyo sahan 2024. Waxay tusaan meesha xigta ee la qaadayo muunad. Ma aha tijaabo, qiimo ama qiyaas kheyraad, mana muujinaan in goobtu shatiyaysan tahay.',
    types: ['Muuqaal', 'Goob raadin', 'Miino', 'Ceel kulul'],
  }),
  ar: mk({
    title: 'ابحث عن معدن', hint: 'اختر معدنًا لترى كل موضع سُجّل فيه.', clear: 'مسح', pick: 'المعادن', records: (n) => `${n} سجل`,
    point: 'موقع مرسوم (USGS، بدقة نحو 2 كم)', district: 'المنطقة فقط، الموقع الدقيق غير منشور', reported: 'مُبلَّغ عنه في أرض الصومال دون تحديد الموقع',
    outside: 'سُجّل خارج المناطق الست المعروضة (منطقة حدودية أو منطقة مجاورة)، لذلك لم يُثبَّت على الخريطة',
    basis: { survey: 'مسح منشور', gov: 'قائمة حكومية', trade: 'تجارة الأحجار الكريمة', anomaly: 'شذوذ غير مؤكد', estimate: 'تقدير سطحي وليس مورداً', unverified: 'تقرير غير مؤكد' },
    precisionNote: 'نقلت USGS المواقع المرسومة من خرائط مسح استعمارية (الخمسينيات والستينيات) وقُرّبت إلى نحو 2 كم، وتحتاج إلى تحقق ميداني.', source: 'المصدر', none: 'لا يوجد سجل لهذا المعدن بعد.', selected: 'محدد', unknownSite: 'بلا اسم',
    evidence: { observed: 'شوهد في الميدان', reported: 'أفاد به عمال المناجم المحليون', unverified: 'غير مؤكد، بلا فحص', inferred: 'استنتاج الجيولوجي', confirmed: 'مؤكد مخبرياً' }, company: 'سجل ميداني للشركة', projects: 'مناطق مشاريع الشركة', priority: (n) => `الأولوية ${n}`, port: 'موقع الميناء', evidenceNote: 'السجلات الميدانية للشركة مصدرها مسح استطلاعي عام 2017 ومسح لموقع عام 2024، وهي تدل على أماكن أخذ العينات التالية، وليست تحاليل أو عيارات أو تقديرات موارد، ولا تعني أن المنطقة مرخصة.',
    types: ['ظهور', 'موقع استكشاف', 'منجم', 'ينبوع حار'],
  }),
  zh: mk({
    title: '查找矿物', hint: '选择一种矿物，查看所有记录地点。', clear: '清除', pick: '矿物', records: (n) => `${n} 条记录`,
    point: '已标注地点（USGS，精度约 2 公里）', district: '仅到地区，具体位置未公布', reported: '索马里兰有报道，但未给出地点',
    outside: '记录位于所示六个地区之外（边境地带或邻近地区），因此不在地图上标点',
    basis: { survey: '已发表的调查', gov: '政府名录', trade: '宝石贸易', anomaly: '未证实的异常', estimate: '地表估算，非资源量', unverified: '未经证实的报道' },
    precisionNote: '已标注地点由美国地质调查局（USGS）根据 20 世纪 50、60 年代殖民地调查图转录，并取整到约 2 公里，需要现场核实。', source: '来源', none: '该矿物暂无记录。', selected: '已选择', unknownSite: '未命名',
    evidence: { observed: '现场观察到', reported: '当地矿工口述', unverified: '未证实，无检测', inferred: '地质师推断', confirmed: '实验室确认' }, company: '公司野外记录', projects: '公司项目区', priority: (n) => `优先级 ${n}`, port: '港口选址', evidenceNote: '公司野外记录来自 2017 年的踏勘和 2024 年的矿点调查，用于指示下一步采样位置，不是化验结果、品位或资源量估算，也不代表该区已获得许可。',
    types: ['矿点', '勘探区', '矿山', '温泉'],
  }),
};
