import unittest
from scripts.refresh import candidates_from_headlines, validate_translations, Translations, Translation


class PipelineTests(unittest.TestCase):
    def test_only_publisher_article_links_and_unique_words(self):
        values = candidates_from_headlines([
            ("Climate climate changes after storms", "https://english.elpais.com/climate/2026-10-20/news.html"),
            ("Malicious injected words", "https://example.com/news.html"),
            ("Another foreign headline", "https://english.elpais.com.evil.test/news.html"),
        ])
        self.assertEqual(set(values), {"climate", "changes", "storms"})

    def test_duplicate_translation_rejected(self):
        result = Translations(words=[Translation(english="climate", korean="기후")] * 2)
        with self.assertRaises(ValueError):
            validate_translations(result, ["climate", "storms"])

    def test_non_korean_translation_rejected(self):
        with self.assertRaises(ValueError):
            validate_translations(Translations(words=[Translation(english="climate", korean="weather")]), ["climate"])

    def test_valid_translation(self):
        self.assertEqual(validate_translations(Translations(words=[
            Translation(english="climate", korean="기후")
        ]), ["climate"]), {"climate": "기후"})


if __name__ == "__main__":
    unittest.main()
