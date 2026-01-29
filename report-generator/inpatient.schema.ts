// inpatient.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Medicine {
    @Prop() name: string;
    @Prop() dosage: string;
    @Prop() frequency: string;
    @Prop() duration: string;
}

@Schema({ timestamps: true })
export class Inpatient extends Document {
    @Prop({ required: true }) patientName: string;
    @Prop() age: number;
    @Prop() gender: string;
    @Prop() roomNumber: string;
    @Prop() admissionDate: Date;
    @Prop() diagnosis: string;
    @Prop({ type: [Medicine] }) medications: Medicine[];
}

export const InpatientSchema = SchemaFactory.createForClass(Inpatient);