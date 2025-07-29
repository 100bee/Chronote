import { Bar, BarChart, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
        <XAxis
          dataKey="name"
          tick={{ fill: '#232323', fontWeight: 600 }}
        />
        <YAxis
          unit="분"
          tick={{ fill: '#232323', fontWeight: 600 }}
          label={{ value: '분', angle: -90, position: 'insideLeft', fill: '#232323', fontWeight: 600 }}
        />
        <Tooltip
          contentStyle={{ color: '#232323', fontWeight: 600 }}
          labelStyle={{ color: '#232323', fontWeight: 600 }}
          itemStyle={{ color: '#232323', fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ color: '#232323', fontWeight: 600 }} />
        <Bar dataKey="value" name="공부시간(분)">
          <LabelList dataKey="value" position="top" fill="#232323" fontWeight={700} />
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TodoBarChart;
