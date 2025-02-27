import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const metricColors = {
    // Router Metrics
    "Bandwidth": "#FF5733",
    "Latency": "#1E90FF",
    "Packet Loss": "#32CD32",

    // Switch Metrics
    "Port Utilization": "#FFD700",
    "Throughput": "#8A2BE2",
    "Error Rate": "#FF1493",

    // Firewall Metrics
    "Blocked Requests": "#00CED1",
    "Intrusion Attempts": "#DC143C",
    "CPU Load": "#8B0000",

    // Default Color
    "Default": "#8884d8"
};

export default function LiveGraph({ values, label, timestamp }) {
    const color = metricColors[label] || metricColors["Default"];

    const [dataState, setDataState] = useState([]);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            let date = new Date();
            let timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            setDataState(prev => {
                const temp = [...prev, values.reduce((sum, val) => sum + val, 0) / values.length];
                return temp.slice(-10);
            });

            setLabels(prev => {
                const temp = [...prev, timestamp];
                return temp.slice(-10);
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [values]);

    const data = {
        labels,
        datasets: [
            {
                label: label,
                data: dataState,
                fill: false,
                borderColor: color,
                backgroundColor: `${color}20`, // Transparent version of the color
                tension: 0.1,
            },
        ],
    };

    return <Line data={data} />;
}
