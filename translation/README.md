# Translation Utility

This directory contains a simple tool to build the translation files from a common source.

## What Languages are supported?

At the moment, the code supports the following languages:

1. English
2. French
3. German
4. Spanish
5. Russian

I'm not averse to adding other languages; I'm just trying to make the best effort vs. benefit decision possible.
If you really think we should have another language included (and, especially, if you're willing to help out
with the translations), bring up a topic in the [Discussion](https://github.com/bcholmes/StarTrek2d20/discussions) area.

## How Does the App Get Translated?

### Screens

From a programming point of view, each screen in the application needs to be converted to use translation. Some
screens have been converted, and some have not.

### Types of Text

Broadly speaking, there are three types of text in the application:

1. App-specific instructions. Phrases like "Select a Talent from the list below" are examples of app-specific
   instructions. At the moment, most of the translation work has touched this kind of text. Often, these
   instructions appear on only one or two screens.
2. Game-specific labels. Key labels, such as "Control", "Fitness", "Engineering", "Determination", etc. are
   examples of these game-specific labels that appear in multiple places in the app. Most of these labels are
   translated; some screens have not been updated to make use of the translations.
3. Reference data. For example, the names and text descriptions of species, roles, talents, etc. all fall in to
   this category. This is probably the largest amount of text to deal with, and this work has started, but there's
   still a lot to do.

### PDFs

Static text that appears on PDF character sheets and starship sheets are part of the PDF itself, and is not
translated. At the moment, there's a translated character sheet for German (which only appears if the user)
has selected German as a language; all other PDFs are in English.

If you've created a character sheet in another language, feel free to send it along and I'll include it
when I can.

### Process

At the moment, all the translation text is contained in a
[Google spreadsheet](https://docs.google.com/spreadsheets/d/18cEtoyIYaEx6arl5gjypqzlPULcFgkd34Ua9YFn33Cs).
All the parts of the application that support translation are in the spreadsheet. I periodically put new
lines in the spreadsheet as I revise more and more screens to support translation.

Anyone (including me) can update the text in the spreadsheet to provide a translation. Does that seem like
it could be abused? Yes, sadly, it does. I try to pay attention to the stuff that changes, but it's possible
that someone will decide that it's fun to ruin the text for everyone. But my hope is that giving people the
freedom to change the translations will make it easy for people to contribute, and that there's a greater
likelihood of people helping out.

When I'm making code changes, I download a
[CSV copy](https://github.com/bcholmes/StarTrek2d20/blob/sta-complete/translation/translations.csv)
of the spreadsheet. I then run a utility to convert the CSV file in to a series of
[translation.json](https://github.com/bcholmes/StarTrek2d20/blob/sta-complete/WebTools/src/i18n/locales/en/translations.json)
files used by the app. The conversion is automated, but only happens when I manually trigger it:
I never manually change the `translation.json` files.

Because the `translation.json` files are tracked in git, I can diff the changes to see if something has
changed that I wasn't expecting to change.

The next time I build and deploy the app, the converted text is picked up, and the new translations are
available.

### Conversion Utility

The utility is a simple node script. From the command line in the `translations` directory, I run:

    node convertTranslations.js

### Blank Entries

The spreadsheet has some fields that are empty. When a field is empty, it means that the app knows how
to translate that text, but a translation hasn't yet been provided.

## Credit

If you're helping out with translation, I'd love to credit you. Reach out to me either on GitHub, the
[Modiphius Forums](https://forums.modiphius.com/t/star-trek-adventures-online-character-generator/94/425),
the Modiphius Discord or [Mastodon](https://tech.lgbt/@bcholmes).