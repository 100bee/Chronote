import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

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
        label={({ name, percent }) =>
          <tspan style={{ fill: '#232323', fontWeight: 700 }}>
            {`${name} ${(percent * 100).toFixed(0)}%`}
          </tspan>
        }
      >
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{ color: '#232323', fontWeight: 600 }}
        labelStyle={{ color: '#232323', fontWeight: 600 }}
        itemStyle={{ color: '#232323', fontWeight: 600 }}
      />
      <Legend wrapperStyle={{ color: '#232323', fontWeight: 600 }} />
    </PieChart>
  );
};

export default TodoDonutChart;
