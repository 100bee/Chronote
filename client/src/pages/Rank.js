// client/src/pages/RankPage.js
import '../css/rankPage.scss';

const RankPage = () => {
  return (
    <div className="rank-page">
      <div className="rank-left-box">
        <h2>내 정보</h2>
        <div className="user-info">
          <p><strong>ID:</strong> example_user</p>
          <p><strong>닉네임:</strong> <span className="nickname silver">지석</span></p>
          <p><strong>현재 랭크:</strong> <span className="nickname silver">Silver</span></p>
          <p><strong>보유 점수:</strong> 125점</p>
        </div>
        <hr />
        <div className="next-rank">
          <h3>다음 랭크 조건</h3>
          <ul>
            <li>다음 랭크: <span className="nickname gold"><strong>Gold</strong></span></li>
            <li>필요 점수: <strong>+25점</strong></li>
            <li>할 일 완료 3개 이상</li>
            <li>연속 출석 5일</li>
          </ul>
        </div>
      </div>

      <div className="rank-right-box">
        <h2>전체 사용자 랭킹</h2>
        <ol className="ranking-list">
          <li>1위 - <span className="nickname diamond">이순신</span> (<span className="nickname diamond">Diamond</span>) - 300점</li>
          <li>2위 - <span className="nickname platinum">홍길동</span> (<span className="nickname platinum">Platinum</span>) - 250점</li>
          <li>3위 - <span className="nickname gold">김철수</span> (<span className="nickname gold">Gold</span>) - 200점</li>
          <li>4위 - <span className="nickname silver">지석</span> (<span className="nickname silver">Silver</span>) - 125점</li>
          <li>5위 - <span className="nickname bronze">이영희</span> (<span className="nickname bronze">Bronze</span>) - 80점</li>
        </ol>
      </div>
    </div>
  );
};

export default RankPage;
