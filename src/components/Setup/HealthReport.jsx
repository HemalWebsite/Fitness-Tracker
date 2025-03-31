import React, { useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fakeProgressData = [
  { week: "Week 1", weight: 80, bodyFat: 25 },
  { week: "Week 2", weight: 79, bodyFat: 24.5 },
  { week: "Week 3", weight: 78.5, bodyFat: 24 },
  { week: "Week 4", weight: 77.8, bodyFat: 23.5 },
  { week: "Week 5", weight: 77.2, bodyFat: 23 },
  { week: "Week 6", weight: 76.5, bodyFat: 22.5 },
  { week: "Week 7", weight: 76, bodyFat: 22 },
  { week: "Week 8", weight: 75.5, bodyFat: 21.8 },
];

const HealthReport = ({ userData }) => {
  const weightChartRef = useRef(null);
  const bodyFatChartRef = useRef(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Health Report", 105, 15, { align: "center" });

    // Personal Information Table
    doc.setFontSize(14);
    doc.text("Personal Information", 20, 30);

    const personalInfoData = [
      ["Age", userData.age],
      ["Gender", userData.gender],
      ["Activity Level", userData.activityLevel],
      ["Height", `${userData.height} cm`],
    ];

    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: personalInfoData,
      startY: 35,
      margin: { left: 20 },
      theme: "grid",
      headStyles: { fillColor: [71, 71, 71] },
    });

    // Convert charts to images
    const weightCanvas = weightChartRef.current?.querySelector("canvas");
    const bodyFatCanvas = bodyFatChartRef.current?.querySelector("canvas");

    if (weightCanvas && bodyFatCanvas) {
      const weightImg = weightCanvas.toDataURL("image/png");
      const bodyFatImg = bodyFatCanvas.toDataURL("image/png");

      doc.text("Weight Progress", 20, doc.lastAutoTable.finalY + 15);
      doc.addImage(weightImg, "PNG", 20, doc.lastAutoTable.finalY + 20, 160, 90);

      doc.text("Body Fat Progress", 20, doc.lastAutoTable.finalY + 110);
      doc.addImage(bodyFatImg, "PNG", 20, doc.lastAutoTable.finalY + 115, 160, 90);
    }

    doc.save("health_report.pdf");
  };

  return (
    <div>
      <h2>Progress Charts</h2>
      <div ref={weightChartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fakeProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div ref={bodyFatChartRef} style={{ marginTop: "20px" }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fakeProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis label={{ value: "Body Fat (%)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button onClick={generatePDF} style={{ marginTop: "20px" }}>Generate PDF</button>
    </div>
  );
};

export default HealthReport;
