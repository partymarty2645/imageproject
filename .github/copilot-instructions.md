@workspace Je bent een expert AI-ontwikkelaar. Ik ga je het verhaal vertellen van een project dat ik wil bouwen. Op basis van dit verhaal genereer je alle benodigde code, bestandsstructuren en commando's in een helder, georganiseerd formaat.

**VERBODEN OM ZONDER SPECIFIEKE TOESTEMMING BEPAALDE FUNCTIES UIT HET PROJECT TE VERWIJDEREN**

Hier is het verhaal:

Ik heb een idee voor een diep persoonlijk en creatief project: een "AI-gestuurd visueel dagboek". Het concept is eenvoudig maar krachtig. Elke dag genereert een AI automatisch een uniek kunstwerk op basis van een reeks thema's en tags die ik definieer. Deze afbeelding wordt vervolgens weergegeven op een strakke, minimalistische website die ik elke ochtend kan bezoeken. Het is als een visueel dagboek, gecreëerd door een AI, dat mijn gekozen stemming of stijl voor die dag weerspiegelt.

De allerbelangrijkste voorwaarde voor dit project is dat het **absoluut gratis** moet zijn. Ik wil geen diensten gebruiken die een factureringsaccount of een creditcard vereisen, zelfs niet als het gebruik binnen een gratis limiet blijft. Het hele systeem moet draaien op diensten met royale, vrijblijvende gratis abonnementen.

Dit is hoe ik de architectuur voor me zie, een volledig op zichzelf staand ecosysteem, aangedreven door GitHub:

1.  **De Kern & Opslag (GitHub Repository):** Alles zal leven in één enkele openbare GitHub-repository. Deze repository host niet alleen de code van de website, maar dient ook als opslag voor de dagelijks gegenereerde afbeeldingen.

2.  **De Motor (GitHub Actions):** Dit is het hart van de automatisering. In plaats van een traditionele server of een betaalde cloudfunctie, gebruiken we een GitHub Actions-workflow. Ik wil dat deze workflow elke dag automatisch op een specifiek tijdstip wordt geactiveerd, bijvoorbeeld om 08:00 uur UTC. Zijn taak is om een script uit te voeren dat de magie verricht.

3.  **De Kunstenaar (Google Gemini API):** Het script binnen de GitHub Action roept de Google Gemini API aan (specifiek een beeldgeneratiemodel zoals Imagen), gebruikmakend van een gratis API-sleutel. Het script geeft de API een prompt die is samengesteld uit een lijst van vooraf gedefinieerde tags (bijv. "surrealistisch", "dromerig landschap", "olieverf").

4.  **Het Bezorgmechanisme (Node.js & Octokit):** Het script, geschreven in Node.js, zal de API-communicatie afhandelen. Na het ontvangen van de gegenereerde afbeelding van Gemini, gebruikt het de GitHub API (via een bibliotheek zoals Octokit.js) om de nieuwe afbeelding direct terug te committen naar onze repository. De afbeelding moet worden vernoemd naar de datum (bijv. `JJJJ-MM-DD.png`) en in een specifieke map worden geplaatst, laten we zeggen `public/images/`.

5.  **De Galerij (React/Vite Frontend):** De website zelf wordt een eenvoudige maar moderne single-page applicatie, gebouwd met React en Vite. Het heeft geen complexe backend-logica nodig. Zijn enige taak is het weergeven van de afbeelding van de dag.

6.  **De Host (Firebase Hosting):** De uiteindelijke React-applicatie wordt geïmplementeerd met Firebase Hosting, dat een fantastisch gratis abonnement biedt dat perfect is voor dit soort statische sites en geen factureringsaccount vereist.

**Hier is de gedetailleerde stroom die ik me voorstel:**

Eerst zet ik de GitHub-repository op. Om mijn API-sleutels veilig te houden, voeg ik ze toe als "Actions secrets" in mijn repository-instellingen. Ik heb twee secrets nodig: `GEMINI_API_KEY` voor Google's AI, en een `GH_TOKEN` (een Personal Access Token) zodat mijn script toestemming heeft om de nieuwe afbeelding terug te schrijven naar de repository.

Vervolgens maak ik het GitHub Actions-workflowbestand, laten we het `.github/workflows/daily_image.yml` noemen. Dit YAML-bestand definieert het schema (`cron: '0 8 * * *'`) en de stappen voor de taak: de code uitchecken, Node.js opzetten, afhankelijkheden installeren (`@google/generative-ai`, `@octokit/rest`, `axios`), en tot slot het hoofd-Node.js-script uitvoeren. Het is cruciaal dat deze workflow de repository-secrets als omgevingsvariabelen doorgeeft aan het script, zodat het zich kan authenticeren bij de API's.

Het Node.js-script, misschien op de locatie `scripts/generate-image.js`, zal de kernlogica bevatten. Het leest de omgevingsvariabelen, definieert de lijst met tags om een prompt te creëren, roept de Gemini API aan, downloadt de resulterende afbeelding en gebruikt vervolgens Octokit om een nieuw bestand te maken in de `public/images/` map van de repository.

Tot slot, de React-app in de `src`-map. Het hoofdcomponent, `App.jsx`, zal heel eenvoudig zijn. Het berekent de huidige datum, construeert het verwachte pad naar de afbeelding van vandaag (bijv. `/images/JJJJ-MM-DD.png`), en stelt dat pad in als de `src` voor een `<img>`-tag. Omdat de afbeelding in de `public`-map staat, wordt deze rechtstreeks door Firebase Hosting op dat rootpad geserveerd.

Om alles online te krijgen, push ik al deze code naar mijn GitHub-repo. Dit zal de workflow activeren. Vervolgens voer ik `npm run build` uit om de statische productiebestanden voor mijn React-app te maken en implementeer ik ze met `firebase deploy --only hosting`.

Dus, AI, op basis van dit verhaal, geef me alsjeblieft een complete, kant-en-klare set bestanden voor dit project. Ik wil de volledige code voor:
- De GitHub Actions workflow YAML (`.github/workflows/daily_image.yml`).
- Het Node.js-script voor beeldgeneratie (`scripts/generate-image.js`).
- Een basis `package.json` voor de afhankelijkheden die het script nodig heeft.
- Het React frontend-component (`src/App.jsx`) en de bijbehorende basis-CSS (`src/App.css`).
- De commando's die ik moet uitvoeren om alles in te stellen.
#todos #sequentialthinking 

Je bent een expert AI-ontwikkelaar. Ik ga je het verhaal vertellen van een project dat ik wil bouwen. Op basis van dit verhaal genereer je alle benodigde code, bestandsstructuren en commando's in een helder, georganiseerd formaat.

Hier is het verhaal:

Ik heb een idee voor een diep persoonlijk en creatief project: een "AI-gestuurd visueel dagboek". Het concept is eenvoudig maar krachtig. Elke dag genereert een AI automatisch een uniek kunstwerk op basis van een reeks thema's en tags die ik definieer. Deze afbeelding wordt vervolgens weergegeven op een strakke, minimalistische website die ik elke ochtend kan bezoeken. Het is als een visueel dagboek, gecreëerd door een AI, dat mijn gekozen stemming of stijl voor die dag weerspiegelt.

De allerbelangrijkste voorwaarde voor dit project is dat het **absoluut gratis** moet zijn. Ik wil geen diensten gebruiken die een factureringsaccount of een creditcard vereisen, zelfs niet als het gebruik binnen een gratis limiet blijft. Het hele systeem moet draaien op diensten met royale, vrijblijvende gratis abonnementen.

Dit is hoe ik de architectuur voor me zie, een volledig op zichzelf staand ecosysteem, aangedreven door GitHub:

1.  **De Kern & Opslag (GitHub Repository):** Alles zal leven in één enkele openbare GitHub-repository. Deze repository host niet alleen de code van de website, maar dient ook als opslag voor de dagelijks gegenereerde afbeeldingen.

2.  **De Motor (GitHub Actions):** Dit is het hart van de automatisering. In plaats van een traditionele server of een betaalde cloudfunctie, gebruiken we een GitHub Actions-workflow. Ik wil dat deze workflow elke dag automatisch op een specifiek tijdstip wordt geactiveerd, bijvoorbeeld om 08:00 uur UTC. Zijn taak is om een script uit te voeren dat de magie verricht.

3.  **De Kunstenaar (Google Gemini API):** Het script binnen de GitHub Action roept de Google Gemini API aan (specifiek een beeldgeneratiemodel zoals Imagen), gebruikmakend van een gratis API-sleutel. Het script geeft de API een prompt die is samengesteld uit een lijst van vooraf gedefinieerde tags (bijv. "surrealistisch", "dromerig landschap", "olieverf").

4.  **Het Bezorgmechanisme (Node.js & Octokit):** Het script, geschreven in Node.js, zal de API-communicatie afhandelen. Na het ontvangen van de gegenereerde afbeelding van Gemini, gebruikt het de GitHub API (via een bibliotheek zoals Octokit.js) om de nieuwe afbeelding direct terug te committen naar onze repository. De afbeelding moet worden vernoemd naar de datum (bijv. `JJJJ-MM-DD.png`) en in een specifieke map worden geplaatst, laten we zeggen `public/images/`.

5.  **De Galerij (React/Vite Frontend):** De website zelf wordt een eenvoudige maar moderne single-page applicatie, gebouwd met React en Vite. Het heeft geen complexe backend-logica nodig. Zijn enige taak is het weergeven van de afbeelding van de dag.

6.  **De Host (Firebase Hosting):** De uiteindelijke React-applicatie wordt geïmplementeerd met Firebase Hosting, dat een fantastisch gratis abonnement biedt dat perfect is voor dit soort statische sites en geen factureringsaccount vereist.

**Hier is de gedetailleerde stroom die ik me voorstel:**

Eerst zet ik de GitHub-repository op. Om mijn API-sleutels veilig te houden, voeg ik ze toe als "Actions secrets" in mijn repository-instellingen. Ik heb twee secrets nodig: `GEMINI_API_KEY` voor Google's AI, en een `GH_TOKEN` (een Personal Access Token) zodat mijn script toestemming heeft om de nieuwe afbeelding terug te schrijven naar de repository.

Vervolgens maak ik het GitHub Actions-workflowbestand, laten we het `.github/workflows/daily_image.yml` noemen. Dit YAML-bestand definieert het schema (`cron: '0 8 * * *'`) en de stappen voor de taak: de code uitchecken, Node.js opzetten, afhankelijkheden installeren (`@google/generative-ai`, `@octokit/rest`, `axios`), en tot slot het hoofd-Node.js-script uitvoeren. Het is cruciaal dat deze workflow de repository-secrets als omgevingsvariabelen doorgeeft aan het script, zodat het zich kan authenticeren bij de API's.

Het Node.js-script, misschien op de locatie `scripts/generate-image.js`, zal de kernlogica bevatten. Het leest de omgevingsvariabelen, definieert de lijst met tags om een prompt te creëren, roept de Gemini API aan, downloadt de resulterende afbeelding en gebruikt vervolgens Octokit om een nieuw bestand te maken in de `public/images/` map van de repository.

Tot slot, de React-app in de `src`-map. Het hoofdcomponent, `App.jsx`, zal heel eenvoudig zijn. Het berekent de huidige datum, construeert het verwachte pad naar de afbeelding van vandaag (bijv. `/images/JJJJ-MM-DD.png`), en stelt dat pad in als de `src` voor een `<img>`-tag. Omdat de afbeelding in de `public`-map staat, wordt deze rechtstreeks door Firebase Hosting op dat rootpad geserveerd.

Om alles online te krijgen, push ik al deze code naar mijn GitHub-repo. Dit zal de workflow activeren. Vervolgens voer ik `npm run build` uit om de statische productiebestanden voor mijn React-app te maken en implementeer ik ze met `firebase deploy --only hosting`.

Dus, AI, op basis van dit verhaal, geef me alsjeblieft een complete, kant-en-klare set bestanden voor dit project. Ik wil de volledige code voor:
- De GitHub Actions workflow YAML (`.github/workflows/daily_image.yml`).
- Het Node.js-script voor beeldgeneratie (`scripts/generate-image.js`).
- Een basis `package.json` voor de afhankelijkheden die het script nodig heeft.
- Het React frontend-component (`src/App.jsx`) en de bijbehorende basis-CSS (`src/App.css`).
- De commando's die ik moet uitvoeren om alles in te stellen.