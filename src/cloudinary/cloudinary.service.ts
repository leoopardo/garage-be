import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { cloudinary } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  // Método para upload de imagem para o Cloudinary
  async uploadImage(
    filePath: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'service_orders',
        resource_type: 'auto',
      });
      return result;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  // Método para compilar o template com Handlebars
  async compileTemplate(data: any): Promise<string> {
    try {
      const templatePath = path.join('template', 'serviceOrder.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      return template(data);
    } catch (error) {
      console.error('Error compiling template', error);
      throw new Error('Failed to compile template.');
    }
  }

  // Método para gerar o PDF a partir do HTML
  async generatePdf(html: string): Promise<Buffer> {
    if (!html || html.trim() === '') {
      throw new Error('HTML content is empty or invalid.');
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 120000,
      });

      const pdfBuffer = await page.pdf({ format: 'A4', timeout: 120000 });

      // Verifica se o buffer é válido
      // if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
      //   throw new Error('Generated PDF buffer is empty or invalid.');
      // }
      return pdfBuffer as any;
    } catch (error) {
      console.error('Error generating PDF', error);
      throw new Error('Failed to generate PDF.');
    } finally {
      await browser.close();
    }
  }

  // Método para upload do PDF para o Cloudinary
  async uploadToCloudinary(pdfBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'orders',
          type: 'upload',
          format: 'pdf',
          flags: ['attachment'],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error('Failed to upload PDF to Cloudinary.'));
          }
          resolve(result.secure_url);
        },
      );
      uploadStream.end(pdfBuffer);
    });
  }

  // Método para criar e fazer upload do PDF
  async createAndUploadPdf(data: any): Promise<string> {
    try {
      const html = await this.compileTemplate(data);
      const pdfBuffer = await this.generatePdf(html);
      fs.writeFileSync('generated.pdf', pdfBuffer); // Salva PDF localmente para verificação
      const cloudinaryUrl = await this.uploadToCloudinary(pdfBuffer);
      return cloudinaryUrl;
    } catch (error) {
      console.error('Error creating and uploading PDF', error);
      throw new Error('Failed to create and upload PDF.');
    }
  }
}
