// client/src/components/TodoDonutChart.js
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#AA00FF'];

// ✅ todos 배열로부터 과목별 공부 시간(분 단위) 계산
function getChartData(todos) {
  const subjectDuration = {};
  todos.forEach(todo => {
    // ✅ duration이 0일 수도 있으므로 숫자 타입 검사
    if (
      todo &&
      typeof todo === 'object' &&
      typeof todo.content === 'string' &&
      typeof todo.duration === 'number'
    ) {
      subjectDuration[todo.content] = (subjectDuration[todo.content] || 0) + todo.duration;
    }
  });
  return Object.entries(subjectDuration).map(([name, value]) => ({
    name,
    value: Math.floor(value / 60), // 분 단위
  }));
}

const TodoDonutChart = ({ todos }) => {
  const data = getChartData(todos);

  return (
    <PieChart width={350} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        labelLine={false}
        // ✅ 오류 방지를 위해 문자열 반환으로 변경
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {/* ✅ 과목별 색상 적용 */}
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>

      {/* ✅ 툴팁: 스타일을 SVG 호환 방식으로 수정 */}
      <Tooltip
        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
        labelStyle={{ fontSize: 12 }}
        itemStyle={{ fontSize: 12 }}
      />

      {/* ✅ 범례: 간단한 wrapperStyle만 적용 */}
      <Legend wrapperStyle={{ fontSize: 12 }} />
    </PieChart>
  );
};

export default TodoDonutChart;
