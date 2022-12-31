# Translation Utility

This directory contains a simple tool to re-generate the translation files from a common source. I've
uploaded the translation files into a [big spreadsheet](https://docs.google.com/spreadsheets/d/18cEtoyIYaEx6arl5gjypqzlPULcFgkd34Ua9YFn33Cs)
to make it possible for others to help provide some of the translations. If I export that spreadsheet into
a CSV file, I get something that looks like the translations.csv file.

The convertTranslations.js file converts that translations.csv file into the JSON format used by the app. Thus,
it's relatively easy to accept translation changes from contributors.