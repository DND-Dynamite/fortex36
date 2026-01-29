// report.controller.ts
import { Controller, Get, Param, Res, Post } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Post('seed')
    async seed() {
        return this.reportService.seedDummyData();
    }

    @Get('inpatient/:id/pdf')
    async downloadPdf(@Param('id') id: string, @Res() res: Response) {
        const buffer = await this.reportService.generateInpatientPdf(id);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=report-${id}.pdf`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}