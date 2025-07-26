// client/src/pages/RankPage.js
import '../css/rankPage.scss';

const RankPage = () => {
  return (
    <div className="rank-page">
      <div className="rank-left-box">
        <h2>내 정보</h2>
        <div className="user-info">
          <p><strong>ID:</strong> example_user</p>
          <p><strong>닉네임:</strong> 지석</p>
          <p><strong>현재 랭크:</strong> Silver</p>
          <p><strong>보유 점수:</strong> 125점</p>
        </div>
        <hr />
        <div className="next-rank">
          <h3>다음 랭크 조건</h3>
          <ul>
            <li>다음 랭크: <strong>Gold</strong></li>
            <li>필요 점수: <strong>+25점</strong></li>
            <li>할 일 완료 3개 이상</li>
            <li>연속 출석 5일</li>
          </ul>
        </div>
      </div>

      <div className="rank-right-box">
        <h2>전체 사용자 랭킹</h2>
        <ol className="ranking-list">
          <li>1위 - 홍길동 (Platinum) - 250점</li>
          <li>2위 - 김철수 (Gold) - 200점</li>
          <li>3위 - 지석 (Silver) - 125점</li>
          <li>4위 - 이영희 (Silver) - 100점</li>
        </ol>
      </div>
    </div>
  );
};

export default RankPage;
