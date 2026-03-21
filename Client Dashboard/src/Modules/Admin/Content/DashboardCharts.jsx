import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2bc155", "#ff7f50", "#3b82f6"];

export default function DashboardCharts() {

  const [data,setData] = useState([]);

  useEffect(()=>{

    axios.get("http://localhost:5555/auth/navics/auth/getRevenueByRegion")
    .then(res=>{
      setData(res.data)
    })
    .catch(err=>{
      console.log(err)
    })

  },[])

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        Revenue by Region
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="revenue"
            nameKey="region_name"
            outerRadius={120}
            label
          >

            {data.map((entry,index)=>(
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}

          </Pie>

          <Tooltip/>
          <Legend/>

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}