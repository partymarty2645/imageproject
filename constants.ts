import { User } from './types';

export const ALLOWED_USERS = [
  {
    email: 'marty.vandenberk@gmail.com',
    id: 'user1',
    username: 'Marty',
    partnerId: 'user2',
  },
  {
    email: 'mariekevanderdennen@gmail.com',
    id: 'user2',
    username: 'Marieke',
    partnerId: 'user1',
  },
];


export const DAILY_QUESTIONS: string[] = [
  "Wat is een klein, onverwacht moment dat je onlangs een diep gevoel van vrede of rust gaf?",
  "Welke geur roept onmiddellijk een sterke, aangename herinnering op? Vertel me over die herinnering.",
  "Als je morgen wakker zou kunnen worden met een nieuwe vaardigheid of talent, wat zou het zijn en waarom?",
  "Beschrijf een droom (een nachtdroom of een dagdroom) die je onlangs hebt gehad en die je is bijgebleven.",
  "Wat is iets kleins dat je vandaag oprecht heeft doen glimlachen?",
  "Welk advies zou je je jongere zelf geven als je 5 minuten terug in de tijd kon gaan?",
  "Als je een mythisch wezen als huisdier zou kunnen hebben, wat zou het zijn en hoe zou je het noemen?",
  "Wat is een liedje waar je altijd vrolijk van wordt? Wat vind je er zo geweldig aan?",
  "Beschrijf een plek waar je nog nooit bent geweest, maar waar je een vreemde band mee voelt.",
  "Wat is een simpel genot waar je nooit genoeg van krijgt?",
  "Als je een dag met een historisch figuur zou kunnen doorbrengen, wie zou het zijn en waar zouden jullie het over hebben?",
  "Wat is een eigenschap die je in anderen bewondert en die je graag in jezelf zou willen ontwikkelen?",
  "Deel een herinnering aan een moment waarop je je volledig in je element voelde.",
  "Welk boek, welke film of welk kunstwerk heeft je onlangs diep geraakt?",
  "Als je een nieuwe feestdag zou kunnen creëren, wat zou die vieren en wat zouden de tradities zijn?",
  "Wat is iets, groot of klein, waar je op dit moment naar uitkijkt?",
  "Beschrijf jouw idee van een perfecte, gezellige avond.",
  "Wat is een kleine daad van vriendelijkheid die je hebt gezien of ervaren die je hart heeft verwarmd?",
  "Als je gevoelens een landschap waren, hoe zou het er dan op dit moment uitzien?",
  "Wat is een doel waar je naartoe werkt waar je trots op bent?",
];

export const INITIAL_YESTERDAY_IMAGE = "https://storage.googleapis.com/maker-studio-project-media-prod/1f79564f-a212-416b-a25e-046603a15231/images/2202650c-e63d-4c3e-8c83-7c089f929367.jpeg";

// Fallback afbeeldingen voor wanneer AI generatie niet beschikbaar is
export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
];