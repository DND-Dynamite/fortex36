// report.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inpatient } from './inpatient.schema';
import PDFDocument from 'pdfkit-table';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Inpatient.name) private inpatientModel: Model<Inpatient>,
    ) { }

    // 1. MongoDB Query
    async getInpatientData(id: string): Promise<Inpatient> {
        const data = await this.inpatientModel.findById(id).exec();
        if (!data) throw new NotFoundException('Inpatient record not found');
        return data;
    }

    // 2. PDF Generation Logic
    async generateInpatientPdf(id: string): Promise<Buffer> {
        const patient = await this.getInpatientData(id);
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const buffer: Buffer[] = [];

        return new Promise((resolve) => {
            doc.on('data', (chunk) => buffer.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffer)));

            // PDF Header
            doc.fontSize(20).text('INPATIENT MEDICAL REPORT', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.moveDown();

            // Patient Info Section
            doc.fontSize(14).text('Patient Information', { underline: true });
            doc.fontSize(11).text(`Name: ${patient.patientName}`);
            doc.text(`Age/Gender: ${patient.age} / ${patient.gender}`);
            doc.text(`Room: ${patient.roomNumber}`);
            doc.text(`Admission Date: ${patient.admissionDate.toDateString()}`);
            doc.moveDown();

            doc.fontSize(14).text('Diagnosis', { underline: true });
            doc.fontSize(11).text(patient.diagnosis);
            doc.moveDown();

            // Medicine Table using pdfkit-table
            const table = {
                title: "Medication List",
                headers: ["Medicine Name", "Dosage", "Frequency", "Duration"],
                rows: patient.medications.map(m => [m.name, m.dosage, m.frequency, m.duration])
            };

            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10),
            });

            doc.end();
        });
    }

    // 3. Seed Dummy Data Method
    async seedDummyData() {
        const dummy = {
            patientName: "John Doe",
            age: 45,
            gender: "Male",
            roomNumber: "402-B",
            admissionDate: new Date(),
            diagnosis: "Post-operative recovery following appendectomy. No complications observed.",
            medications: [
                { name: "Amoxicillin", dosage: "500mg", frequency: "Twice a day", duration: "7 Days" },
                { name: "Paracetamol", dosage: "1g", frequency: "Every 6 hours", duration: "3 Days" },
                { name: "Omeprazole", dosage: "20mg", frequency: "Once daily", duration: "10 Days" }
            ]
        };
        return new this.inpatientModel(dummy).save();
    }
}