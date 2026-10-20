import unittest
from scripts.refresh import candidates_from_headlines, validate_translations, Translations, Translation


class PipelineTests(unittest.TestCase):
    def test_only_publisher_article_links_and_unique_words(self):
        values = candidates_from_headlines([
            ("Economía economía cambia después tormentas", "https://cnnespanol.cnn.com/2026/10/20/economia/noticia"),
            ("Malicious injected words", "https://example.com/news.html"),
            ("Another foreign headline", "https://cnnespanol.cnn.com.evil.test/2026/10/20/noticia"),
        ])
        self.assertEqual(set(values), {"economía", "cambia", "tormentas"})

    def test_duplicate_translation_rejected(self):
        result = Translations(words=[Translation(spanish="clima", english="climate", korean="기후")] * 2)
        with self.assertRaises(ValueError):
            validate_translations(result, ["clima", "tormentas"])

    def test_non_korean_translation_rejected(self):
        with self.assertRaises(ValueError):
            validate_translations(Translations(words=[Translation(spanish="clima", english="climate", korean="weather")]), ["clima"])

    def test_valid_translation(self):
        self.assertEqual(validate_translations(Translations(words=[
            Translation(spanish="clima", english="climate", korean="기후")
        ]), ["clima"]), {"clima": {"english": "climate", "korean": "기후"}})


if __name__ == "__main__":
    unittest.main()
