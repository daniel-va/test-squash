import { faker } from '@faker-js/faker';
import { AssetFormatItem } from '@prisma/client';

export const fakeAssetFormatItemCode = (): string =>
  faker.helpers.arrayElement(assetFormatItems.map((item) => item.assetFormatItemCode));

export const assetFormatItems: AssetFormatItem[] = [
  {
    assetFormatItemCode: 'archive',
    geolCode: 'No-GeolCode-specified',
    name: 'Archive',
    nameDe: 'Archive-Format',
    nameFr: "Format d'archive",
    nameIt: "Formato d'archivio",
    nameEn: 'Archive format',
    description: 'Archive format resp. compression format, such as zip, tar, gz, bz2 etc.',
    descriptionDe: 'Archivformat resp. Komprimierungsformat, wie z.B. zip, tar, gz, bz2 etc.',
    descriptionFr: "Format d'archivage ou de compression, p. ex. zip, tar, gz, bz2, etc.",
    descriptionIt: "Formato d'archivio o formato di compressione, come zip, tar, gz, bz2 ecc.",
    descriptionEn: 'Archive format resp. compression format, such as zip, tar, gz, bz2 etc.',
  },
  {
    assetFormatItemCode: 'other',
    geolCode: 'No-GeolCode-specified',
    name: 'Other',
    nameDe: 'Andere',
    nameFr: 'Autres',
    nameIt: 'Altro',
    nameEn: 'Other',
    description: 'Other formats of assets not covered by the values in this list',
    descriptionDe: 'Andere Formate von Assets, die nicht mit den Werten dieser Liste abgedeckt sind',
    descriptionFr: "Autres formats d'assets non couverts par les valeurs de cette liste",
    descriptionIt: 'Altri formati di elementi non coperti dai valori di questo elenco',
    descriptionEn: 'Other formats of assets not covered by the values in this list',
  },
  {
    assetFormatItemCode: 'textAnalog',
    geolCode: 'No-GeolCode-specified',
    name: 'Text analog',
    nameDe: 'Analoge Dokumente (Papier, Mikrofichen etc.)',
    nameFr: 'Documents analogiques (papier, microfiches, etc.)',
    nameIt: 'Documenti analogici (cartaceo, microfiche, ecc.)',
    nameEn: 'Analogue documents (paper, microfiche etc.)',
    description: 'Analogue asset, on e.g. paper, microfiche etc.',
    descriptionDe: 'Analoges Asset, auf z.B. Papier, Mikrofichen etc.',
    descriptionFr: 'Asset analogique, p. ex. sur papier, microfiches, etc.',
    descriptionIt: 'Elemento in formato analogico, ad esempio cartaceo, microfiche, ecc.',
    descriptionEn: 'Analogue asset, on e.g. paper, microfiche etc.',
  },
  {
    assetFormatItemCode: 'graphicVector',
    geolCode: 'No-GeolCode-specified',
    name: 'Graphic vector',
    nameDe: 'Digitale Vektorgrafik',
    nameFr: 'Format graphique numérique vectoriel',
    nameIt: 'Grafica digitale vettoriale',
    nameEn: 'Digital vector graphics',
    description: 'Vector graphics format, such as eps, ai, svg etc.',
    descriptionDe: 'Vektorgrafikformat, wie z.B. eps, ai, svg etc.',
    descriptionFr: 'Format graphique vectoriel, p. ex. eps, ai, svg, etc.',
    descriptionIt: 'Formato grafico vettoriale, come eps, ai, svg ecc.',
    descriptionEn: 'Vector graphics format, such as eps, ai, svg etc.',
  },
  {
    assetFormatItemCode: 'graphicRaster',
    geolCode: 'No-GeolCode-specified',
    name: 'Graphic raster',
    nameDe: 'Digitale Rastergrafik',
    nameFr: 'Format graphique numérique raster',
    nameIt: 'Grafica digitale raster',
    nameEn: 'Digital raster graphics',
    description: 'Raster graphics format, such as tiff, jpeg, png etc.',
    descriptionDe: 'Rastergrafikformat, wie z.B. tiff, jpeg, png etc.',
    descriptionFr: 'Format graphique raster, p. ex. tiff, jpeg, png, etc.',
    descriptionIt: 'Formato grafico raster, come tiff, jpeg, png ecc.',
    descriptionEn: 'Raster graphics format, such as tiff, jpeg, png etc.',
  },
  {
    assetFormatItemCode: 'binary',
    geolCode: 'No-GeolCode-specified',
    name: 'Binary',
    nameDe: 'Digitales binäres Format',
    nameFr: 'Format binaire numérique',
    nameIt: 'Formato binario digitale',
    nameEn: 'Digital binary format',
    description: 'Binary format',
    descriptionDe: 'Binäres Format',
    descriptionFr: 'Format binaire',
    descriptionIt: 'Formato binario',
    descriptionEn: 'Binary format',
  },
  {
    assetFormatItemCode: 'textDigital',
    geolCode: 'No-GeolCode-specified',
    name: 'Text digital',
    nameDe: 'Textformat digital',
    nameFr: 'Format texte numérique',
    nameIt: 'Formato testo digitale',
    nameEn: 'Digital text format',
    description: 'Text or ASCII format, such as txt, doc, docx, xls, xlsx, xml, csv etc.',
    descriptionDe: 'Textformat, wie z.B. txt, doc, docx, xls, xlsx, xml, csv etc.',
    descriptionFr: 'Format texte, p. ex. txt, doc, docx, xls, xlsx, xml, csv etc.',
    descriptionIt: 'Formato di testo, come txt, doc, docx, xls, xlsx, xml, csv ecc.',
    descriptionEn: 'Text or ASCII format, such as txt, doc, docx, xls, xlsx, xml, csv etc.',
  },
  {
    assetFormatItemCode: 'seismic',
    geolCode: 'No-GeolCode-specified',
    name: 'Seismic',
    nameDe: 'Seismikspezifisches Format',
    nameFr: 'Format spécifique à la sismique',
    nameIt: 'Formato specifico per il sismica',
    nameEn: 'Seismic specific format',
    description: 'Seismic-specific format, such as SPS, SEG2, SEGD, etc.',
    descriptionDe: 'Seismikspezifisches Format, wie z.B. SPS, SEG2, SEGD etc.',
    descriptionFr: 'Format spécifique à la sismologie, p. ex. SPS, SEG2, SEGD, etc.',
    descriptionIt: 'Formato specifico per la sismica, come SPS, SEG2, SEGD, ecc.',
    descriptionEn: 'Seismic-specific format, such as SPS, SEG2, SEGD, etc.',
  },
  {
    assetFormatItemCode: 'segy',
    geolCode: 'No-GeolCode-specified',
    name: 'SEGY',
    nameDe: 'SEGY',
    nameFr: 'SEGY',
    nameIt: 'SEGY',
    nameEn: 'SEGY',
    description: 'Seismic-specific format SEGY',
    descriptionDe: 'Seismikspezifisches Format SEGY',
    descriptionFr: 'Format spécifique à la sismologie SEGY',
    descriptionIt: 'Formato specifico sismico SEGY',
    descriptionEn: 'Seismic-specific format SEGY',
  },
  {
    assetFormatItemCode: 'segyExported',
    geolCode: 'No-GeolCode-specified',
    name: 'SEGY exported',
    nameDe: 'SEGY exportiert',
    nameFr: 'SEGY exporté',
    nameIt: 'SEGY esportato',
    nameEn: 'SEGY exported',
    description: 'Seismic-specific format SEGY exported',
    descriptionDe: 'Seismikspezifisches Format SEGY exportiert',
    descriptionFr: 'Format spécifique à la sismologie SEGY exporté',
    descriptionIt: 'Formato specifico sismico SEGY esportato',
    descriptionEn: 'Seismic-specific format SEGY exported',
  },
];
