# Spanish · Daily Words

CNN en Español (https://cnnespanol.cnn.com/) 기사 제목에서 매일 스페인어 단어 20개를 무작위 선정해 표시합니다. 번역을 사용하면 영어와 한국어 뜻을 함께 생성합니다.

## 실행 및 배포

- 웹사이트: https://justinpark-97.github.io/spanish/
- 매일 한국 시간 08:00에 GitHub Actions 예약 실행. 예약은 지연되거나 누락될 수 있습니다.
- Actions → Daily Spanish Words → Run workflow에서 `skip_translation`을 선택하면 API 비용 없이 실제 스페인어 단어와 출처 링크를 배포합니다.
- 번역 사용 시 GitHub Actions Secrets의 `OPENAI_API_KEY`와 API 크레딧이 필요합니다. 모델은 Variables의 `OPENAI_MODEL`로 지정하며 기본값은 `gpt-4.1-mini`입니다.
- Settings → Pages → Source: GitHub Actions.
- 예약 실행은 번역을 사용합니다. 크레딧이 없으면 갱신에 실패하고 기존 배포는 유지됩니다.

## 수집 범위

홈페이지의 기사 제목만 수집하며 본문 전체는 재게시하지 않습니다. robots.txt를 확인하고, 차단 화면을 우회하지 않습니다. 스페인어 악센트와 ñ를 보존하며 불용어와 영상 링크를 제외합니다. 고유명사는 포함될 수 있고, 과거 날짜 단어가 다시 선정될 수 있습니다. 당일 발행 기사만을 보장하지 않습니다.

수집·번역·검증 실패 시 새 배포를 중단합니다. 화면은 5분마다 JSON을 다시 읽으며 마지막 갱신 시간을 표시합니다. API 키는 브라우저에 전달하지 않습니다.

## 로컬 실행 (Python 3.12)

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m unittest discover -s tests -v
python scripts/refresh.py --collect-only
SKIP_TRANSLATION=true python scripts/refresh.py
python -m http.server 8000 --directory site
```

번역 실행은 환경에 `OPENAI_API_KEY`를 설정한 뒤 `python scripts/refresh.py`를 사용합니다. `.env`는 자동 로딩하지 않습니다. 생성된 `site/daily-words.json`은 배포 산출물이며 저장소에 커밋하지 않습니다.
