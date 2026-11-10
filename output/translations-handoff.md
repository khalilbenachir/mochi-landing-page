# Editorial translations ready for integration

Completed locales: `fr`, `de`, `es`, `pt-BR`, `pt-PT`.

- Each `messages/<locale>.json` now contains complete `Blog` and `PeriodEducationFAQ` namespaces matching the current English schema.
- Each `src/features/blog/content/articles/<locale>/` contains all nine article JSON files, matching the English filenames, section keys, FAQ keys and table dimensions.
- Includes article titles, descriptions, introductions, body text, image alt text, questions, answers and tables; blog metadata, categories, navigation labels, editorial policy, newsletter requests and sharing controls; and the four sourced homepage education FAQs.
- Preserves clinical limitations, urgent-care advice, attributed source names, fictional-example caveats and optional-backup distinctions. Source URLs remain owned by the existing source catalog.
- French uses the existing site's “vous” voice. Portuguese variants use distinct regional language, including “absorvente/celular/aplicativo” in Brazil and “penso/telemóvel/aplicação” in Portugal.

Validation: 45 translated articles and 1,830 strings checked. All source keys and ICU arguments match. No empty strings, draft markers or unchanged English article fields. Existing message namespaces are unchanged semantically except the `Navigation.blog` additions made by the concurrent integration work.

## Integration owner

Per the user's instruction, this translation task leaves application code to the other agent. At this handoff, `src/features/blog/locales.ts` enables only `en`, and `content/copy.ts` registers only English article imports. Enable the five translated locales and register their article files there when ready. The concurrent agent's existing locale-aware routes and components can then consume them. Run the complete translation tests, type check, production build and locale route checks after registration; this task does not claim deployment or browser verification.
