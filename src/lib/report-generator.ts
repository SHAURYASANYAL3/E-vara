// jspdf and autoTable are imported dynamically to prevent chunking issues
import type { jsPDF } from "jspdf";

export interface ReportIdentity {
  fullName: string;
  email?: string;
  username?: string;
}

export interface ReportScanResults {
  summary: {
    totalBreaches: number;
    sourcesChecked: number;
    highSeverity: number;
    mediumSeverity: number;
    lowSeverity: number;
  };
  results: {
    breachName: string;
    source: string;
    severity: string;
    dataTypes: string[];
    description: string;
    breachDate: string;
  }[];
}

export const generateExecutiveReport = async (
  identity: ReportIdentity,
  scanResults: ReportScanResults,
) => {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // --- Cover Page ---
  doc.setFillColor(5, 8, 16);
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor(0, 255, 255); // Cyan primary
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("E-VARA", 105, 100, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("EXECUTIVE THREAT AUDIT", 105, 120, { align: "center" });

  doc.setDrawColor(0, 255, 255);
  doc.setLineWidth(1);
  doc.line(40, 130, 170, 130);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Subject: ${identity?.fullName || "Classified Identity"}`,
    105,
    150,
    { align: "center" },
  );
  doc.text(
    `Report ID: EV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    105,
    160,
    { align: "center" },
  );
  doc.text(`Generated: ${timestamp}`, 105, 170, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("CONFIDENTIAL - FOR AUTHORIZED USE ONLY", 105, 280, {
    align: "center",
  });

  // --- Page 2: Summary ---
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.text("Intelligence Summary", 20, 30);

  doc.setFontSize(12);
  doc.text(
    "This document outlines the findings of the automated E-Vara threat surface analysis.",
    20,
    45,
  );

  const summaryData = [
    ["Metric", "Value"],
    [
      "Total Breaches Identified",
      scanResults?.summary?.totalBreaches?.toString() || "0",
    ],
    [
      "High Severity Risks",
      scanResults?.summary?.highSeverity?.toString() || "0",
    ],
    [
      "Data Sources Audited",
      scanResults?.summary?.sourcesChecked?.toString() || "5",
    ],
    ["Last Scan Timestamp", timestamp],
  ];

  autoTable(doc, {
    startY: 55,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: "striped",
    headStyles: {
      fillStyle: "F",
      fillColor: [5, 8, 16],
      textColor: [255, 255, 255],
    },
  });

  // --- Breach Details ---
  if (scanResults?.results && scanResults.results.length > 0) {
    doc.setFontSize(18);
    doc.text(
      "Vulnerability Log",
      20,
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 20,
    );

    const breachBody = scanResults.results.map(
      (r: ReportScanResults["results"][0]) => [
        r.breachName,
        r.severity.toUpperCase(),
        r.source,
        r.dataTypes.join(", "),
        r.breachDate,
      ],
    );

    autoTable(doc, {
      startY:
        (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 30,
      head: [["Breach", "Severity", "Source", "Exposed Data", "Date"]],
      body: breachBody,
      headStyles: { fillColor: [5, 8, 16] },
      columnStyles: {
        1: { fontStyle: "bold" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          const val = data.cell.raw as string;
          if (val === "HIGH") data.cell.styles.textColor = [220, 38, 38];
          if (val === "MEDIUM") data.cell.styles.textColor = [217, 119, 6];
          if (val === "LOW") data.cell.styles.textColor = [5, 150, 105];
        }
      },
    });
  } else {
    doc.setFontSize(14);
    doc.setTextColor(5, 150, 105);
    doc.text(
      "No critical exposure found in active databases.",
      20,
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 20,
    );
  }

  // --- Footnote ---
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Recommended Action: Enable 2FA on all identified platforms and rotate compromised credentials immediately.",
    20,
    280,
  );

  doc.save(
    `EVARA_Report_${identity?.fullName?.replace(/\s/g, "_") || "Audit"}.pdf`,
  );
};
