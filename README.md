# typing-game
Gotta get high score by correct typed word.

## scripts
- npm run start
  - 개발서버 실행
  - 실행시마다 /public 폴더 비움
- npm run test
  - 테스트 실행
- npm run build
  - /public 폴더에 결과물 생성
  - 빌드된 파일들을 서버에서 실행 시켜야 정상 실행됩니다.

### 개발의도
- Web API를 사용
  - WebComponent, Hisoty
- 단위 테스트에 용이하도록 기능으로 펑션 분리
- 기존의 SPA 애플리케이션과 유사한 구조로 설계
- 메모리상의 엘리먼트를 변경해서 돔접근 최소화


### 테스트전략
- 기능단위 펑션들을 테스트

### 컴포넌트 구조
- 레이아웃 컴포넌트(부모)
  - 게임 컴포넌트(자식)
  - 스코어 컴포넌트(자식)
