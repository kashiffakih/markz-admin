<template>
  <section>
    <GChart
      type="ColumnChart"
      :data="chartData"
      :options="chartOptions"
    />
    <GChart
      type="PieChart"
      :data="pieChartData"
      :options="pieChartOptions"
    />
    <GChart
      type="BubbleChart"
      :data="bubbleChartData"
      :options="bubbleChartOptions"
    />
    <GChart
      type="BarChart"
      :data="barChartData"
      :options="chartOptions"
    />
  </section>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
      ],
      chartOptions: {
        title: 'Company Performance',
        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      pieChartData: [
        ['Task', 'Hours per Day'],
        ['Work',     11],
        ['Eat',      2],
        ['Commute',  2],
        ['Watch TV', 2],
        ['Sleep',    7]
      ],
      pieChartOptions: {
        title: 'My Daily Activities',
        is3D: true,
        width: 600,
        height: 400,
      },
      bubbleChartData: [
        ['ID', 'X', 'Y', 'Temperature'],
          ['',   80,  167,      120],
          ['',   79,  136,      130],
          ['',   78,  184,      50],
          ['',   72,  278,      230],
          ['',   81,  200,      210],
          ['',   72,  170,      100],
          ['',   68,  477,      80]
      ],
      bubbleChartOptions: {
        title: 'Company Performance',
        colorAxis: {colors: ['yellow', 'red']},
        vAxis: {gridlines: {color: 'transparent'}},
        hAxis: {gridlines: {color: 'transparent'}},
      },
      barChartData: [
        ['Element', 'Density', { role: 'style' }],
        ['Copper', 8.94, '#b87333'],            // RGB value
        ['Silver', 10.49, 'silver'],            // English color name
        ['Gold', 19.30, 'gold'],
        ['Platinum', 21.45, 'color: #e5e4e2' ], // CSS-style declaration
      ]
    }
  }
}
</script>