## deployments

github action -> ecs deployments

1. github action ( build image )
2. upload to ecr storage
3. runs on ecs service then make ecs tesk for image
4. build image && upload ec2 container
5. combine with gartget group
6. make (api/giveKey) http contact and generate keyValue for hantoo server connect

## styles

using vailla extract. how to find style

src/styles
=> styles/theme : 개별 레이아웃 세팅 
=> styles/globals.css : 웹앱 글로벌 세팅  
=> styles/sparkles.css.ts : 반응형 설정값,반응형 기준,쇼트핸드 설정 등 개별 컴포넌트에 적용가능한 상수 css property 모음. 
=> /src/features/Domain/component/**.css.ts  : 개별 컴포넌트에 적용 가능한 레시피.

## 진행 예정 목록
0. 뉴스 기능,ui작성. ( 완료 ) 
1. 종목 상세 페이지 provider 작성
2. draggable UI 기능 작성
3. 실시간 시세 호가창
4. 구매 FORM
5. 투자자 매매동향
6. 공통 차트,테이블 컴포넌트 작성
7. 종목 종합 정보 ( 도합 10개 이상의 테이블,차트 기능 포함. )  
