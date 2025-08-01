// client/src/components/Match.js

import "../css/match.scss"; // 매칭 페이지 전용 스타일 파일

// 매칭 페이지 컴포넌트
const Match = () => {
  return (
    <div className="match-container"> {/* 전체 매칭 화면 컨테이너 */}
      <h2 className="match-title">당신과 잘 어울리는 팀원을 찾고 있어요!</h2> {/* 안내 문구 */}
      <button className="match-button">매칭 시작</button> {/* 매칭 시작 버튼 (기능은 아직 없음) */}
    </div>
  );
};

export default Match;
