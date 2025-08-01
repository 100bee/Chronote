// client/src/components/TodoDonutChart.js
// ✅ 과목별 공부 시간 분포를 도넛 차트로 시각화하는 컴포넌트

import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

// ✅ 과목별 색상 팔레트
const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#AA00FF'];

// ✅ todos 배열로부터 과목별 공부 시간(분 단위) 계산
function getChartData(todos) {
  const subjectDuration = {};

  todos.forEach(todo => {
    if (todo.duration && todo.content) {
      subjectDuration[todo.content] = (subjectDuration[todo.content] || 0) + todo.duration;
    }
  });

  // 결과 형식: [{ name: '과목명', value: 분단위 시간 }, ...]
  return Object.entries(subjectDuration).map(([name, value]) => ({
    name,
    value: Math.floor(value / 60),
  }));
}

const TodoDonutChart = ({ todos }) => {
  const data = getChartData(todos); // 가공된 차트 데이터

  return (
    <PieChart width={350} height={300}> {/* 전체 도넛 차트 영역 */}
      <Pie
        data={data}             // 차트 데이터
        cx="50%"                // 중심 x좌표
        cy="50%"                // 중심 y좌표
        outerRadius={100}       // 도넛 반지름
        dataKey="value"         // 표시할 값 키
        labelLine={false}       // 라벨 라인 제거
        label={({ name, percent }) => ( // 라벨 내용: 과목명 + 비율
          <tspan style={{ fill: '#232323', fontWeight: 700 }}>
            {`${name} ${(percent * 100).toFixed(0)}%`}
          </tspan>
        )}
      >
        {/* 과목별 색상 지정 */}
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>

      {/* 마우스 오버 툴팁 */}
      <Tooltip
        contentStyle={{ color: '#232323', fontWeight: 600 }}
        labelStyle={{ color: '#232323', fontWeight: 600 }}
        itemStyle={{ color: '#232323', fontWeight: 600 }}
      />

      {/* 범례 */}
      <Legend wrapperStyle={{ color: '#232323', fontWeight: 600 }} />
    </PieChart>
  );
};

export default TodoDonutChart;
