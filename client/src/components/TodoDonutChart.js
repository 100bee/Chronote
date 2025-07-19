import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#AA00FF'];

const TodoDonutChart = ({ tasksByDate, selectedDate }) => {
  const dateKey = selectedDate.toISOString().split('T')[0];
  const todos = tasksByDate[dateKey] || [];

  const subjectDuration = {};

  todos.forEach(todo => {
    if (todo.start_time && todo.end_time && todo.content) {
      const start = new Date(`1970-01-01T${todo.start_time}`);
      const end = new Date(`1970-01-01T${todo.end_time}`);
      const duration = (end - start) / (1000 * 60); // 분 단위

      if (duration > 0) {
        subjectDuration[todo.content] = (subjectDuration[todo.content] || 0) + duration;
      }
    }
  });

  const data = Object.entries(subjectDuration).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default TodoDonutChart;
