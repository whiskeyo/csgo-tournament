# CStrikers (csgo-tournament)
## Opis tematu pracy inżynierskiej

Z roku na rok rośnie liczba organizowanych profesjonalnych turniejów w wielu grach, jednak narzędzia wspomagające organizację turniejów są zwykle niedostępne dla widzów.

Implementacja tej aplikacji miałaby się przyczynić do ułatwienia organizacji turniejów dla każdego. Z założenia miałaby głównie wspierać:
- system ligowy, pucharowy i mieszany,
- rozgrywane mecze w formacie BO1/3/5 (Best of...),
- odrzucanie map przez kapitanów obu drużyn,
- możliwość tworzenia turniejów prywatnych i publicznych,
- panel administracyjny do zarządzania rozgrywkami.

Ponadto implementacja będzie korzystać z dwóch frameworków front-endowych, tj. Vue oraz Cycle.js, które prezentują całkowicie odmienne podejście do programowania aplikacji webowych.

## Description of thesis

The number of organized professional tournaments in many games is growing every year, but the tools for organizing tournaments are usually inaccessible to spectators.

Implementation of this application would contribute to facilitating the organization of tournaments for everyone. By design it would mainly support:
- league, cup and mixed system,
- matches played in BO1/3/5 (Best of...) format,
- discarding of maps by the captains of both teams,
- possibility to create private and public tournaments,
- administration panel to manage the games.

Moreover, the implementation will use two front-end frameworks, i.e. Vue and Cycle.js, which present a completely different approach to web application programming.

## Struktura projektu

```
src
|
+---api (funkcje obsługujące zapytania do Cloud Firestore)
|
+---App.vue (główny komponent zawierający layout strony)
|
+---assets (pliki CSS)
|
+---components (komponenty Vue.js)
|
+---configs (pliki konfiguracyjne Firebase)
|
+---main.js (plik tworzący aplikację Vue)
|
+---router (router Vue, katalog zawierający plik obsługujący przekierowania)
|
+---services (funkcje pomocnicze, komponenty Cycle.js)
|
+---store (Vuex store, katalog zawierający plik przechowujący globalny stan)
|
+---views (widoki Vue.js)
|
+---tests (testy jednostkowe)
```

## Podstawowe polecenia pozwalające uruchomić projekt

### Konfiguracja Vue + instalacja paczek

```bash
sudo npm install -g @vue/cli # jednorazowo
cd app && npm install # jednorazowo
```

### Polecenia uruchamiane przez `npm run`

```bash
npm run dev      # uruchomienie serwera developerskiego
npm run build    # kompilacja projektu z możliwością hostowania na serwerach
npm run lint     # uruchomienie lintera wskazującego błędy w kodzie
npm run format   # uruchomienie formattera
npm run test     # uruchomienie testów jednostkowych
npm run coverage # uruchomienie testów jednostkowych oraz wygenerowanie pokrycia
npm run docs     # wygenerowanie dokumentacji
```
