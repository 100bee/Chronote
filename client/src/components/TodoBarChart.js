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
    if (todo.duration && todo.content) {
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

  return (
    <ResponsiveContainer width="100%" height={300}> {/* 반응형 컨테이너 */}
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
          contentStyle={{ color: '#232323', fontWeight: 600 }}
          labelStyle={{ color: '#232323', fontWeight: 600 }}
          itemStyle={{ color: '#232323', fontWeight: 600 }}
        />

        {/* ✅ 범례 (Legend) */}
        <Legend wrapperStyle={{ color: '#232323', fontWeight: 600 }} />

        {/* ✅ 막대 그래프 본체 */}
        <Bar dataKey="value" name="공부시간(분)">
          {/* 막대 위에 값 표시 */}
          <LabelList dataKey="value" position="top" fill="#232323" fontWeight={700} />

          {/* 막대 색상 개별 지정 */}
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TodoBarChart;
