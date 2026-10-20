# Spanish · Daily English Words

EL PAÍS 영어 뉴스 제목에서 매일 단어 20개를 무작위로 뽑고, OpenAI로 문맥에 맞는 한국어 뜻을 생성해 웹사이트에 게시합니다.

저장소 이름은 `spanish`이며 학습 언어는 영어 → 한국어입니다.

## 작동 방식

매일 한국 시간 오전 8시 예약 → 홈페이지 수집 → 차단되면 공식 영어판 RSS → 중복 없는 단어 20개 → AI 번역 및 검증 → JSON 생성 → GitHub Pages 배포.

- 수집 대상은 제목입니다. 본문 전체를 수집하거나 재게시하지 않습니다.
- 공식 RSS: https://feeds.elpais.com/mrss-s/pages/ep/site/english.elpais.com/portada
- RSS 안내: https://elpais.com/info/rss/
- 홈페이지의 robots.txt를 확인합니다. 차단 화면을 우회하지 않습니다.
- 정규식과 기본 불용어 필터로 선정하므로 고유명사나 쉬운 단어가 포함될 수 있습니다.
- 하루 내 중복은 없지만 과거 날짜의 단어가 다시 나올 수 있습니다.
- 기사 후보는 방문 시점의 메인 화면 또는 피드이며 반드시 당일 발행 기사만은 아닙니다.
- 수집·번역·검증이 실패하면 새 배포를 하지 않아 기존 페이지가 유지됩니다.
- GitHub Actions 예약은 지연되거나 누락될 수 있으며 정확한 08:00 갱신을 보장하지 않습니다.
- 공개 저장소에서 일정 기간 활동이 없으면 GitHub가 예약 실행을 비활성화할 수 있습니다. Actions에서 확인하세요.

## 최초 설정

1. Settings → Secrets and variables → Actions → **New repository secret**에서 `OPENAI_API_KEY`를 등록합니다. 키를 코드나 이슈에 붙여넣지 마세요.
2. 선택 사항: 같은 화면의 Variables에서 `OPENAI_MODEL`을 등록합니다. 기본값은 `gpt-4.1-mini`이며 계정에서 사용 가능한 Structured Outputs 지원 모델로 변경할 수 있습니다.
3. Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 설정합니다.
4. Actions → **Daily English Words** → **Run workflow**로 첫 실행을 시작합니다.
5. 성공 후 https://justinpark-97.github.io/spanish/ 에서 확인합니다.

API 키가 없으면 번역·배포는 실패합니다. ChatGPT 구독과 별도로 OpenAI API 사용 요금이 발생할 수 있습니다. 환경 보호 규칙이 있다면 배포 승인도 필요합니다.

## 로컬 실행

Python 3.12 기준:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m unittest discover -s tests -v
python scripts/refresh.py --collect-only
```

번역은 로컬 환경에 `OPENAI_API_KEY`를 설정한 뒤 `python scripts/refresh.py`를 실행합니다. `.env`를 자동 로딩하지 않습니다.

```sh
python -m http.server 8000 --directory site
```

http://localhost:8000 에서 확인합니다. HTML 파일을 직접 열면 JSON 요청이 차단될 수 있습니다.

## 파일

- `scripts/refresh.py`: 수집, 무작위 선정, AI 번역, 결과 검증과 원자적 저장
- `site/index.html`, `site/app.js`: 모바일 대응 단어 카드, 출처 링크, 마지막 갱신 날짜, 5분 자동 확인
- `.github/workflows/daily.yml`: 예약/수동 실행과 Pages 배포
- `.github/workflows/check.yml`: 커밋/PR 검증
- `tests/test_refresh.py`: 출처 검증, 단어 중복 및 잘못된 AI 응답 검증

생성된 JSON은 배포 산출물에 포함되며 저장소에는 커밋하지 않습니다. 브라우저는 API 키 없이 JSON만 읽습니다.
