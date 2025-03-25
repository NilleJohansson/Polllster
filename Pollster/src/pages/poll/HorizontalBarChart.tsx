import React from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from 'recharts';

function HorizontalBarChart({votingOptions}) {
    // const data = [
    //     { name: 'Category 1', value: 10 },
    //     { name: 'Category 2', value: 20 },
    //     { name: 'Category 3', value: 15 },
    //     { name: 'Category 4', value: 25 },
    //   ];

    const totalVoteAmount: number = votingOptions?.reduce((total, item) => total + item['voteAmount'], 0);

    const data = votingOptions?.map(option => {
      const voteAmount = option.voteAmount || 0;
      const votePercentage = totalVoteAmount > 0 ? (voteAmount / totalVoteAmount) * 100 : 0;

      return {
        name: option.option,
        value: Math.trunc(votePercentage),
        totalAmountOfVotes: `${Math.trunc(votePercentage)}% (${voteAmount} votes)`,
        totalAmount: 100,
        voteAmount: voteAmount,
        option: option.option,
      };
    });
    
      return (
        <BarChart
          width={600}
          height={400}
          data={data}
          key={Math.random()}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap={0}
          barGap={-10}
        >
        <CartesianGrid display="none" />
          <XAxis type="number" tick={false} xAxisId={0}/>
          <XAxis type="number" tick={false} xAxisId={1} hide />
          <YAxis dataKey="name" type="category" tick={false} />
          <Bar dataKey="value" fill="green" xAxisId={1} barSize={10}/>
          <Bar dataKey="totalAmount" fill="gray" xAxisId={0} barSize={10} fillOpacity={0.7}>
          <LabelList
            dataKey="totalAmountOfVotes"
            position="top"
            content={({ x = 0, y = 0, width = 0, value }) => {
              const xValue = typeof x === 'number' ? x : 0; 
              const yValue = typeof y === 'number' ? y : 0; 
              const widthValue = typeof width === 'number' ? width : 0; 
              return (
              <text x={xValue + widthValue - 100} y={yValue - 6} fill="white" textAnchor="start">
                {value}
              </text>
            );
          }}
          />    
             <LabelList
            dataKey="option"
            position="top"
            content={({ x, y, value }) => {
              const xValue = typeof x === 'number' ? x : 0; 
              const yValue = typeof y === 'number' ? y : 0; 
              return (
              <text x={xValue + 5} y={yValue - 3} fill="white" textAnchor="start">
                {value}
              </text>
            );
          }}
        
          />          
          </Bar>
        </BarChart>
      );
}

export default HorizontalBarChart