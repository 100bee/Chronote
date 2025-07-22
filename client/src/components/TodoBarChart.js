import { Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// 도넛 차트에서 쓰는 색상 배열과 동일하게 사용
const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#AA00FF'];

function getChartData(todos) {
  const subjectDuration = {};
  todos.forEach(todo => {
    if (todo.duration && todo.content) {
      subjectDuration[todo.content] = (subjectDuration[todo.content] || 0) + todo.duration;
    }
  });
  return Object.entries(subjectDuration).map(([name, value]) => ({
    name,
    value: Math.floor(value / 60),
  }));
}

const TodoBarChart = ({ todos }) => {
  const data = getChartData(todos);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis unit="분" />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="공부시간(분)">
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TodoBarChart;
