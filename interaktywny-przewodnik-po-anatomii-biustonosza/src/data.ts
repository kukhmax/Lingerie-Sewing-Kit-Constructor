import { BraPart } from './types.ts';

export const braParts: BraPart[] = [
  {
    id: 'miseczki',
    name: 'Miseczki (główny kształt)',
    category: 'support',
    categoryLabel: 'Konstrukcja / Podtrzymanie',
    description: 'Główny trójwymiarowy element biustonosza obejmujący i modelujący piersi. Może składać się z kilku zszytych ze sobą części (dolna, górna, boczny panel zbierający).',
    sewingRole: 'Kształtowanie i bezpośrednie podtrzymanie biustu',
    typicalProperties: 'Dostępne jako gotowe miseczki piankowe (kopytka) lub szyte z paneli (materiał, koronka, tiul)',
    sewingTip: 'Przy szyciu miseczek haftuj z milimetrową precyzją. Jeśli miseczka składa się z paneli, kierunki nitki prostej są kluczowe dla prawidłowego ułożenia na piersi.',
    color: '#3B82F6', // Blue
  },
  {
    id: 'material',
    name: 'Materiał główny',
    category: 'fabric',
    categoryLabel: 'Materiały bazowe',
    description: 'Tkanina lub dzianina stanowiąca bazę miseczek lub kołyski. Najczęściej stosuje się mikrofibrę, satynę bielizną (satynę z lycrą), dżersej lub stabilne haftowane hafty.',
    sewingRole: 'Estetyka, osłona i podstawowe podtrzymanie',
    typicalProperties: 'Gramatura zwykle 120-220 g/m², wysoka odporność na piling, często elastyczna w jedną stronę',
    sewingTip: 'Krój elementy stabilne pionowo, by zapobiegać opadaniu biustu, a elastyczne poziomo, żeby miseczka ładnie pracowała z ciałem.',
    color: '#8B5CF6', // Purple
  },
  {
    id: 'koronka',
    name: 'Koronka',
    category: 'accessory',
    categoryLabel: 'Dekoracje / Wykończenia',
    description: 'Ozdobny materiał ażurowy z motywem kwiatowym lub geometrycznym, posiadający dekoracyjny brzeg (rzęski/zęby). Wykorzystywany głównie na górną część miseczek lub boki basqu\'u.',
    sewingRole: 'Wykończenie estetyczne, nadanie lekkości konstrukcji',
    typicalProperties: 'Koronka elastyczna (nadaje się na miseczki stretch) lub stabilna (np. gipiurowa)',
    sewingTip: 'Zęby koronki układaj symetrycznie na lewej i prawej miseczce. Lewą i prawą stronę krój jako lustrzane odbicia ze szczególnym uwzględnieniem wzoru.',
    color: '#EC4899', // Pink
  },
  {
    id: 'tiul_elastyczny',
    name: 'Tiul elastyczny',
    category: 'tulle',
    categoryLabel: 'Materiały bazowe',
    description: 'Dzianina siatkowa typu Powernet o wysokiej sprężystości. Stosowana głównie na pas obwodu (boki/tył biustonosza), gdzie wymagany jest wysoki stopień elastyczności i powrotu do pierwotnego kształtu.',
    sewingRole: 'Dopasowanie pasa obwodu do ciała i rozkład siły naciągu',
    typicalProperties: 'Powernet od 140g/m² do 280g/m², skład z dużą zawartością elastanu (np. 20-30%)',
    sewingTip: 'Mocny powernet stabilizuje pas obwodu, co stanowi 80% podtrzymania całego biustu. Pamiętaj, aby przy mocnym tiulu elastycznym nie naciągać gum zbyt mocno.',
    color: '#06B6D4', // Cyan
  },
  {
    id: 'tiul_stabilny',
    name: 'Tiul stabilny (liner / markizyeta)',
    category: 'tulle',
    categoryLabel: 'Materiały bazowe',
    description: 'Cienki, lekki i całkowicie nieelastyczny tiul nylonowy. Stosowany jako podszewka (liner) do wzmocnienia mostka (mostek nigdy nie może być elastyczny) oraz dolnej części miseczek z koronki.',
    sewingRole: 'Blokowanie rozciągania w miejscach kluczowych dla konstrukcji',
    typicalProperties: '100% poliamid/nylon, gramatura ok. 30-40 g/m²',
    sewingTip: 'Zawsze podszywaj mostek tiulem stabilnym. Bez tego mostek rozciągnie się i fiszbiny rozejdą się na boki, tracąc funkcję zbierania i podtrzymywania piersi.',
    color: '#14B8A6', // Teal
  },
  {
    id: 'guma_obszywkowa',
    name: 'Guma obszywkowa',
    category: 'elastic',
    categoryLabel: 'Gumy i Taśmy',
    description: 'Elastyczna taśma z miękkim wykończeniem (często z mechatej pluszowej strony) i ozdobnym brzegiem zwanym pikotką. Wszywana na dolnej i górnej krawędzi skrzydełek pasa obwodu.',
    sewingRole: 'Komfortowe trzymanie pasa obwodu, zapobieganie zwijaniu',
    typicalProperties: 'Szerokości: 8mm, 10mm, 12mm, 15mm – dopasowane do rozmiaru biustu',
    sewingTip: 'Wszywaj gumę obszywkową metodą dwuetapową ściegiem trójskrokiem (zieg-zag trzyetapowy) lub zygzakiem bieliznianym, lekko ją naprężając (o ok. 5-10%). Pluszowa strona zawsze do ciała!',
    color: '#F59E0B', // Amber
  },
  {
    id: 'guma_ramiackowa',
    name: 'Guma ramiączkowa',
    category: 'elastic',
    categoryLabel: 'Gumy i Taśmy',
    description: 'Gruba, solidna guma o zredukowanej ciągliwości, z jednej strony wykończona miękkim flokiem (pluszem), który bezpośrednio dotyka ramienia.',
    sewingRole: 'Utrzymanie stabilności pionowej ramiączka, estetyczny wygląd',
    typicalProperties: 'Szerokości: 10mm, 12mm, 15mm, 18mm, 20mm (im większy biust, tym szersze ramiączko)',
    sewingTip: 'Ramiączko powinno przejmować maksymalnie 15-20% ciężaru biustu. Dobierz odpowiednią szerokość – zbyt wąskie ramiączko będzie bolesne i wpije się w ramiona.',
    color: '#10B981', // Emerald
  },
  {
    id: 'kolka',
    name: 'Kółka',
    category: 'hardware',
    categoryLabel: 'Dodatki Metalowe / Plastikowe',
    description: 'Okrągłe łączniki (metalowe, nylonowane lub plastikowe) łączące ramiączko z miseczką oraz tyłem biustonosza.',
    sewingRole: 'Ruchome połączenie ramiączka, dopasowujące się do ruchów ciała',
    typicalProperties: 'Średnica wewnętrzna musi idealnie odpowiadać szerokości gumy ramiączkowej (np. 12mm, 15mm)',
    sewingTip: 'Wybieraj kółka metalowe powlekane nylonem – nie uczulają (brak niklu) i są znacznie wytrzymalsze od plastikowych, które mogą pęknąć pod naciskiem.',
    color: '#EF4444', // Red
  },
  {
    id: 'regulatory',
    name: 'Regulatory (klamerki)',
    category: 'hardware',
    categoryLabel: 'Dodatki Metalowe / Plastikowe',
    description: 'Przesuwne regulatory (ósemki) umieszczone na ramiączkach, umożliwiające precyzyjną regulację ich długości.',
    sewingRole: 'Regulacja wysokości uniesienia miseczek biustonosza',
    typicalProperties: 'Dobierane pod szerokość gumy ramiączkowej, identycznie jak kółka',
    sewingTip: 'Złóż ramiączko przekładając je przez regulator, kółko i z powrotem przez regulator zanim doszyjesz je na stałe do tylnego pasa.',
    color: '#F97316', // Orange
  },
  {
    id: 'haftka',
    name: 'Haftka (Zapięcie)',
    category: 'hardware',
    categoryLabel: 'Dodatki Metalowe / Plastikowe',
    description: 'Zapięcie pleców składające się z taśmy z rzędami haftek (haczyków) oraz taśmy z pętelkami (oczkami). Umożliwia regulację obwodu w zakresie trzech poziomów naciągu.',
    sewingRole: 'Główne zapięcie biustonosza, stabilizacja pasa obwodu',
    typicalProperties: 'Dostępne wysokości: np. 28mm (na 2 haczyki szerokości), 38mm, 57mm (na trzy rzędy)',
    sewingTip: 'Taśmę z oczkami wszywaj po lewej stronie tyłu, a haczyki po prawej (patrząc od tyłu). Brzegi haftki zabezpiecz gęstym zygzakiem (ściegiem ryglowym), aby nie drapały.',
    color: '#84CC16', // Lime
  },
  {
    id: 'fiszbiny',
    name: 'Fiszbiny metalowe',
    category: 'support',
    categoryLabel: 'Konstrukcja / Podtrzymanie',
    description: 'Wyprofilowane metalowe półkola powlekane lakierem (np. epoksydowym), które dopasowują się do nasady piersi, dając im mocne podparcie od spodu i separację.',
    sewingRole: 'Maksymalne podtrzymanie, nadanie kształtu i zebranie piersi',
    typicalProperties: 'Dostępne o profilach: klasyczne regularne, plunge, długawe, ramiączkowe, a także o przekrojach płaskich lub okrągłych',
    sewingTip: 'Fiszbina musi być o 1-1.5 cm krótsza niż tunel gorseciarski. Musi mieć przestrzeń (tzw. "wire play"), by poruszać się w tunelu, w przeciwnym razie przebije materiał przy noszeniu.',
    color: '#6366F1', // Indigo
  },
  {
    id: 'tunel_gorseciarski',
    name: 'Tunel gorseciarski (taśma tunelowa)',
    category: 'support',
    categoryLabel: 'Konstrukcja / Podtrzymanie',
    description: 'Specjalna, miękka, lekko elastyczna, pluszowa tkana taśma, w którą wsuwane są fiszbiny. Wszywa się ją wzdłuż podkroju pachy i miseczki pod spodem.',
    sewingRole: 'Izolacja fiszbiny od skóry, zabezpieczenie konstrukcji przed przetarciem',
    typicalProperties: 'Szerokość zazwyczaj 10-12mm, tkana z gęstego, wytrzymałego nylonu ze splotem uniemożliwiającym łatwe przebicie',
    sewingTip: 'Przeszywaj tunel blisko wewnętrznej krawędzi igłą do grubszego szycia (np. Microtex 80/90). Podwójna igła do tuneli daje najbardziej profesjonalny, fabryczny efekt.',
    color: '#D946EF', // Fuchsia
  },
  {
    id: 'kokardka',
    name: 'Kokardka ozdobna',
    category: 'accessory',
    categoryLabel: 'Dekoracje / Wykończenia',
    description: 'Zarówno dekoracja, jak i uroczy akcent wykończeniowy ze wstążki satynowej, szyfonu lub z zawieszką biżuteryjną, umieszczony na mostku.',
    sewingRole: 'Dekoracja środka biustonosza, maskowanie szwu na mostku',
    typicalProperties: 'Ręcznie wiązana lub gotowa ze wstążki atłasowej szerokości 3-6mm',
    sewingTip: 'Przyszywaj kokardkę mocnym, ręcznym ściegiem lub krótkim zygzakiem maszyny w punkcie centralnym, zabezpieczając końcówki wstążki przed strzępieniem.',
    color: '#EAB308', // Yellow
  }
];
