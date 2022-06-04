# Notatki csgo-tournament

## Trello - śledzenie zadań

[Tablica zadań](https://trello.com/b/TVOeqq9D/thesis-project)

## Opis tematu pracy inżynierskiej

Z roku na rok rośnie liczba organizowanych profesjonalnych turniejów w wielu grach, jednak narzędzia wspomagające organizację turniejów są zwykle niedostępne dla widzów.

Implementacja tej aplikacji miałaby się przyczynić do ułatwienia organizacji turniejów dla każdego. Z założenia miałaby głównie wspierać:
- system ligowy, pucharowy i mieszany,
- rozgrywane mecze w formacie BO1/3/5 (Best of…),
- odrzucanie map przez kapitanów obu drużyn,
- możliwość tworzenia turniejów prywatnych i publicznych,
- panel administracyjny do zarządzania rozgrywkami.

Ponadto implementacja będzie korzystać z dwóch frameworków front-endowych, tj. Vue oraz Cycle.js, które prezentują całkowicie odmienne podejście do programowania aplikacji webowych.

## Struktura tego projektu
1. views -> strony do ktorych przechodze normalnie (np. url localhost:8080/about)
2. components -> reużywalne kompontenty uzywane przez widoki
3. services (nie istnieje jeszcze) -> reuzywalne funkcje uzywane przez widoki/komponenty
4. router/store musi zostac bo fajne (vue-router i vuex)
