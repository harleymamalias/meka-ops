import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  paginationOptions,
} from '../../common/utils/pagination.util';
import { InvoiceStatus } from '../../shared/enums/invoice-status.enum';
import { ServiceRequestStatus } from '../../shared/enums/service-request-status.enum';
import { InventoryService } from '../inventory/inventory.service';
import { ServiceRequestsService } from '../service-requests/service-requests.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    private readonly serviceRequestsService: ServiceRequestsService,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const existing = await this.invoicesRepository.findOne({
      where: { serviceRequestId: dto.serviceRequestId },
    });

    if (existing) {
      throw new ConflictException(
        'Invoice already exists for this service request.',
      );
    }

    const request = await this.serviceRequestsService.findById(
      dto.serviceRequestId,
    );
    if (request.status !== ServiceRequestStatus.COMPLETED) {
      throw new UnprocessableEntityException(
        'Invoice can only be created for completed service requests.',
      );
    }

    const parts = await this.inventoryService.findPartsForServiceRequest(
      dto.serviceRequestId,
    );
    const partsCostCents = parts.reduce(
      (total, part) =>
        total + part.quantityUsed * this.moneyToCents(part.unitPriceAtUse),
      0,
    );
    const laborCostCents = this.moneyToCents(dto.laborCost);

    return this.invoicesRepository.save(
      this.invoicesRepository.create({
        serviceRequestId: dto.serviceRequestId,
        laborCost: this.centsToMoney(laborCostCents),
        partsCost: this.centsToMoney(partsCostCents),
        totalAmount: this.centsToMoney(laborCostCents + partsCostCents),
        status: InvoiceStatus.UNPAID,
      }),
    );
  }

  async findAll(query: InvoiceQueryDto) {
    const { page, limit, skip, take } = paginationOptions(query);
    const qb = this.invoicesRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.serviceRequest', 'serviceRequest');

    if (query.status) {
      qb.andWhere('invoice.status = :status', { status: query.status });
    }

    if (query.serviceRequestId) {
      qb.andWhere('invoice.serviceRequestId = :serviceRequestId', {
        serviceRequestId: query.serviceRequestId,
      });
    }

    const [invoices, total] = await qb
      .orderBy('invoice.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginate(invoices, total, page, limit);
  }

  async findById(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: { serviceRequest: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found.');
    }

    return invoice;
  }

  async findByServiceRequest(serviceRequestId: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { serviceRequestId },
      relations: { serviceRequest: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found.');
    }

    return invoice;
  }

  async markPaid(id: string, dto: MarkPaidDto): Promise<Invoice> {
    const invoice = await this.findById(id);

    if (invoice.status === InvoiceStatus.VOIDED) {
      throw new UnprocessableEntityException('Voided invoices cannot be paid.');
    }

    invoice.status = InvoiceStatus.PAID;
    invoice.paymentProofUrl = dto.paymentProofUrl;
    return this.invoicesRepository.save(invoice);
  }

  async void(id: string): Promise<Invoice> {
    const invoice = await this.findById(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new UnprocessableEntityException('Paid invoices cannot be voided.');
    }

    invoice.status = InvoiceStatus.VOIDED;
    return this.invoicesRepository.save(invoice);
  }

  private moneyToCents(value: string): number {
    const [whole, fraction = ''] = value.split('.');
    return Number(whole) * 100 + Number(fraction.padEnd(2, '0').slice(0, 2));
  }

  private centsToMoney(value: number): string {
    const sign = value < 0 ? '-' : '';
    const absolute = Math.abs(value);
    return `${sign}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, '0')}`;
  }
}
