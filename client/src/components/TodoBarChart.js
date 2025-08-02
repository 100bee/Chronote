// client/src/components/TodoBarChart.js
// ✅ 할 일 목록에서 과목별 총 공부 시간(분)을 계산해 막대그래프로 보여주는 컴포넌트

import {
  Bar, BarChart, Cell, LabelList, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

// ✅ 색상 팔레트 (과목별 막대 색상 순환용)
const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#AA00FF'];

// ✅ todos 배열로부터 과목별 총 공부 시간(초)을 "분" 단위로 변환하여 데이터 생성
function getChartData(todos) {
  const subjectDuration = {}; // 과목별 누적 시간 저장 객체

  todos.forEach(todo => {
    // ✅ duration이 0인 경우도 허용하도록 조건 수정
    if (
      todo &&
      typeof todo === 'object' &&
      typeof todo.content === 'string' &&
      typeof todo.duration === 'number'
    ) {
      subjectDuration[todo.content] = (subjectDuration[todo.content] || 0) + todo.duration;
    }
  });

  // 결과 형식: [{ name: '수학', value: 120 }, ...]
  return Object.entries(subjectDuration).map(([name, value]) => ({
    name,
    value: Math.floor(value / 60), // 초 → 분 단위 변환
  }));
}

const TodoBarChart = ({ todos }) => {
  const data = getChartData(todos); // 과목별 데이터 추출

  // ✅ ResponsiveContainer가 부모 크기를 못 읽는 걸 방지: 데이터가 없으면 아예 렌더링하지 않음
  if (!data || data.length === 0) {
    return <p style={{ color: '#aaa' }}>표시할 데이터가 없습니다.</p>;
  }

  // ✅ 반드시 상위에서 width, height가 0이 아닌 값으로 지정되어 있어야 함!
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          {/* ✅ X축: 과목명 */}
          <XAxis
            dataKey="name"
            tick={{ fill: '#232323', fontWeight: 600 }}
          />
          
          {/* ✅ Y축: 공부 시간 (단위: 분) */}
          <YAxis
            unit="분"
            tick={{ fill: '#232323', fontWeight: 600 }}
            label={{
              value: '분', angle: -90, position: 'insideLeft',
              fill: '#232323', fontWeight: 600
            }}
          />

          {/* ✅ 툴팁: 마우스 오버 시 정보 표시 */}
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            labelStyle={{ fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />

          {/* ✅ 범례 (Legend) */}
          <Legend wrapperStyle={{ fontSize: 12 }} />

          {/* ✅ 막대 그래프 본체 */}
          <Bar dataKey="value" name="공부시간(분)">
            {/* ✅ 막대 위에 값 표시 (style로 안전하게 적용) */}
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: '#232323', fontWeight: 700 }}
            />

            {/* ✅ 막대 색상 개별 지정 */}
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TodoBarChart;
