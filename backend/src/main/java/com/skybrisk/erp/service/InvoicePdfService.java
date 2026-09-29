package com.skybrisk.erp.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.skybrisk.erp.entity.Invoice;
import com.skybrisk.erp.entity.InvoiceItem;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class InvoicePdfService {

    public byte[] generateInvoicePdf(Invoice invoice) {

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        PdfWriter writer =
                new PdfWriter(outputStream);

        PdfDocument pdfDocument =
                new PdfDocument(writer);

        Document document =
                new Document(pdfDocument);

        // Title
        document.add(
                new Paragraph("INVOICE")
                        .setBold()
                        .setFontSize(20)
        );

        document.add(
                new Paragraph(
                        "Invoice ID: " + invoice.getId()
                )
        );

        document.add(
                new Paragraph(
                        "Invoice Date: " + invoice.getInvoiceDate()
                )
        );

        // Customer details
        document.add(
                new Paragraph("Customer Details")
                        .setBold()
                        .setFontSize(14)
        );

        document.add(
                new Paragraph(
                        "Name: " +
                                invoice.getCustomer().getName()
                )
        );

        document.add(
                new Paragraph(
                        "Email: " +
                                invoice.getCustomer().getEmail()
                )
        );

        document.add(
                new Paragraph(
                        "Phone: " +
                                invoice.getCustomer().getPhone()
                )
        );

        document.add(
                new Paragraph(
                        "Address: " +
                                invoice.getCustomer().getAddress()
                )
        );

        // Items table
        Table table = new Table(
                UnitValue.createPercentArray(
                        new float[]{3, 1, 2, 2}
                )
        );

        table.setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell("Product");
        table.addHeaderCell("Quantity");
        table.addHeaderCell("Unit Price");
        table.addHeaderCell("Total");

        for (InvoiceItem item : invoice.getItems()) {

            table.addCell(
                    item.getProduct().getProductName()
            );

            table.addCell(
                    String.valueOf(item.getQuantity())
            );

            table.addCell(
                    "₹" + item.getUnitPrice()
            );

            table.addCell(
                    "₹" + item.getTotalPrice()
            );
        }

        document.add(table);

        // Financial summary
        document.add(
                new Paragraph(
                        "Tax: " + invoice.getTax() + "%"
                )
        );

        document.add(
                new Paragraph(
                        "Total Payable: ₹" +
                                invoice.getTotalPayable()
                )
                        .setBold()
                        .setFontSize(14)
        );

        document.add(
                new Paragraph(
                        "Status: " +
                                invoice.getStatus()
                )
        );

        document.close();

        return outputStream.toByteArray();
    }
}