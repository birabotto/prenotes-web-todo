"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axiosConfig from "../../shared/axiosConfig";

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

type ArticleType = {
  bts: boolean;
  name: string;
};

export default function Charts() {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosConfig.get("v1/api/charts/bts");
      const data = await response.data.data;

      const filteredData = data.filter(
        (article: ArticleType) => article.bts === true
      );
      const aggregatedData = filteredData.reduce(
        (acc: { [key: string]: number }, article: ArticleType) => {
          acc[article.name] = (acc[article.name] || 0) + 1;
          return acc;
        },
        {}
      );

      const labels = Object.keys(aggregatedData);
      const counts = Object.values(aggregatedData).map(Number);

      setChartData({
        labels,
        datasets: [
          {
            label: "Number of BTS Articles",
            data: counts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Articles with Most BTS (Last 7 Days)
        </h1>
        {chartData ? (
          <div className="w-full max-w-4xl">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 14,
                      },
                    },
                  },
                  title: {
                    display: true,
                    text: "Articles with Most BTS (Last 7 Days)",
                    font: {
                      size: 16,
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: {
                        size: 12,
                      },
                    },
                  },
                  y: {
                    ticks: {
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
              }}
              height={400}
            />
          </div>
        ) : (
          <p className="text-center">No data available</p>
        )}
      </div>
    </>
  );
}
