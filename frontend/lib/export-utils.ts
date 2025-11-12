import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export interface ExportData {
  totalRevenue: number
  totalTicketsSold: number
  totalEvents: number
  totalViews: number
  revenueByDay?: Array<{ date: string; revenue: number; tickets: number }>
  eventPerformance?: Array<{ name: string; revenue: number; tickets: number; views: number; conversion: number }>
  ticketsByCategory?: Array<{ category: string; tickets: number; revenue: number }>
  customerDemographics?: Array<{ ageGroup: string; percentage: number; count: number }>
  userInteractions?: Array<{ action: string; user: string; event: string; time: string; status: string }>
}

// Export analytics data to PDF
export const exportToPDF = (data: ExportData, organizerName: string = "Event Organizer") => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("Analytics Report", pageWidth / 2, 20, { align: "center" })
  
  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: "center" })
  doc.text(`Organizer: ${organizerName}`, pageWidth / 2, 34, { align: "center" })
  
  // Summary Section
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Performance Summary", 14, 45)
  
  const summaryData = [
    ["Metric", "Value"],
    ["Total Revenue", `$${data.totalRevenue.toLocaleString()}`],
    ["Total Tickets Sold", data.totalTicketsSold.toLocaleString()],
    ["Active Events", data.totalEvents.toString()],
    ["Total Views", data.totalViews.toLocaleString()],
  ]
  
  autoTable(doc, {
    startY: 50,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
  })
  
  // Event Performance Section
  if (data.eventPerformance && data.eventPerformance.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 90
    
    doc.setFontSize(14)
    doc.text("Top Event Performance", 14, finalY + 10)
    
    const eventData = [
      ["Event Name", "Revenue", "Tickets", "Views", "Conv. %"],
      ...data.eventPerformance.map(e => [
        e.name,
        `$${e.revenue.toLocaleString()}`,
        e.tickets.toString(),
        e.views.toLocaleString(),
        `${e.conversion}%`,
      ]),
    ]
    
    autoTable(doc, {
      startY: finalY + 15,
      head: [eventData[0]],
      body: eventData.slice(1),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    })
  }
  
  // Category Distribution
  if (data.ticketsByCategory && data.ticketsByCategory.length > 0) {
    doc.addPage()
    
    doc.setFontSize(14)
    doc.text("Revenue by Category", 14, 20)
    
    const categoryData = [
      ["Category", "Tickets", "Revenue"],
      ...data.ticketsByCategory.map(c => [
        c.category,
        c.tickets.toString(),
        `$${c.revenue.toLocaleString()}`,
      ]),
    ]
    
    autoTable(doc, {
      startY: 25,
      head: [categoryData[0]],
      body: categoryData.slice(1),
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
    })
  }
  
  // Customer Demographics
  if (data.customerDemographics && data.customerDemographics.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 80
    
    doc.setFontSize(14)
    doc.text("Customer Demographics", 14, finalY + 10)
    
    const demoData = [
      ["Age Group", "Percentage", "Count"],
      ...data.customerDemographics.map(d => [
        d.ageGroup,
        `${d.percentage}%`,
        d.count.toString(),
      ]),
    ]
    
    autoTable(doc, {
      startY: finalY + 15,
      head: [demoData[0]],
      body: demoData.slice(1),
      theme: "striped",
      headStyles: { fillColor: [139, 92, 246] },
    })
  }
  
  // Recent Activity
  if (data.userInteractions && data.userInteractions.length > 0) {
    doc.addPage()
    
    doc.setFontSize(14)
    doc.text("Recent User Interactions", 14, 20)
    
    const interactionData = [
      ["User", "Action", "Event", "Status"],
      ...data.userInteractions.slice(0, 15).map(i => [
        i.user,
        i.action,
        i.event.substring(0, 25) + (i.event.length > 25 ? "..." : ""),
        i.status,
      ]),
    ]
    
    autoTable(doc, {
      startY: 25,
      head: [interactionData[0]],
      body: interactionData.slice(1),
      theme: "grid",
      headStyles: { fillColor: [245, 158, 11] },
      styles: { fontSize: 9 },
    })
  }
  
  // Footer
  const pageCount = doc.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} of ${pageCount} | MyTikiti Analytics Report`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    )
  }
  
  // Save PDF
  doc.save(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`)
}

// Export analytics data to Excel
export const exportToExcel = (data: ExportData, organizerName: string = "Event Organizer") => {
  const workbook = XLSX.utils.book_new()
  
  // Summary Sheet
  const summaryData = [
    ["MyTikiti Analytics Report"],
    ["Generated:", new Date().toLocaleDateString()],
    ["Organizer:", organizerName],
    [],
    ["Metric", "Value"],
    ["Total Revenue", `$${data.totalRevenue.toLocaleString()}`],
    ["Total Tickets Sold", data.totalTicketsSold],
    ["Active Events", data.totalEvents],
    ["Total Views", data.totalViews],
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
  
  // Revenue Trend Sheet
  if (data.revenueByDay && data.revenueByDay.length > 0) {
    const revenueData = [
      ["Date", "Revenue", "Tickets"],
      ...data.revenueByDay.map(r => [r.date, r.revenue, r.tickets]),
    ]
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData)
    XLSX.utils.book_append_sheet(workbook, revenueSheet, "Revenue Trend")
  }
  
  // Event Performance Sheet
  if (data.eventPerformance && data.eventPerformance.length > 0) {
    const eventData = [
      ["Event Name", "Revenue", "Tickets Sold", "Views", "Conversion %"],
      ...data.eventPerformance.map(e => [e.name, e.revenue, e.tickets, e.views, e.conversion]),
    ]
    const eventSheet = XLSX.utils.aoa_to_sheet(eventData)
    XLSX.utils.book_append_sheet(workbook, eventSheet, "Event Performance")
  }
  
  // Category Distribution Sheet
  if (data.ticketsByCategory && data.ticketsByCategory.length > 0) {
    const categoryData = [
      ["Category", "Tickets", "Revenue"],
      ...data.ticketsByCategory.map(c => [c.category, c.tickets, c.revenue]),
    ]
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData)
    XLSX.utils.book_append_sheet(workbook, categorySheet, "Categories")
  }
  
  // Customer Demographics Sheet
  if (data.customerDemographics && data.customerDemographics.length > 0) {
    const demoData = [
      ["Age Group", "Percentage", "Count"],
      ...data.customerDemographics.map(d => [d.ageGroup, d.percentage, d.count]),
    ]
    const demoSheet = XLSX.utils.aoa_to_sheet(demoData)
    XLSX.utils.book_append_sheet(workbook, demoSheet, "Demographics")
  }
  
  // User Interactions Sheet
  if (data.userInteractions && data.userInteractions.length > 0) {
    const interactionData = [
      ["User", "Action", "Event", "Time", "Status"],
      ...data.userInteractions.map(i => [i.user, i.action, i.event, i.time, i.status]),
    ]
    const interactionSheet = XLSX.utils.aoa_to_sheet(interactionData)
    XLSX.utils.book_append_sheet(workbook, interactionSheet, "User Activity")
  }
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  saveAs(blob, `analytics-report-${new Date().toISOString().split('T')[0]}.xlsx`)
}

// Export to CSV (simplified version)
export const exportToCSV = (data: ExportData) => {
  let csvContent = "MyTikiti Analytics Report\n"
  csvContent += `Generated: ${new Date().toLocaleDateString()}\n\n`
  
  csvContent += "Performance Summary\n"
  csvContent += "Metric,Value\n"
  csvContent += `Total Revenue,$${data.totalRevenue.toLocaleString()}\n`
  csvContent += `Total Tickets Sold,${data.totalTicketsSold}\n`
  csvContent += `Active Events,${data.totalEvents}\n`
  csvContent += `Total Views,${data.totalViews}\n\n`
  
  if (data.eventPerformance && data.eventPerformance.length > 0) {
    csvContent += "Event Performance\n"
    csvContent += "Event Name,Revenue,Tickets,Views,Conversion %\n"
    data.eventPerformance.forEach(e => {
      csvContent += `"${e.name}",${e.revenue},${e.tickets},${e.views},${e.conversion}\n`
    })
    csvContent += "\n"
  }
  
  if (data.ticketsByCategory && data.ticketsByCategory.length > 0) {
    csvContent += "Categories\n"
    csvContent += "Category,Tickets,Revenue\n"
    data.ticketsByCategory.forEach(c => {
      csvContent += `${c.category},${c.tickets},${c.revenue}\n`
    })
  }
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  saveAs(blob, `analytics-report-${new Date().toISOString().split('T')[0]}.csv`)
}
