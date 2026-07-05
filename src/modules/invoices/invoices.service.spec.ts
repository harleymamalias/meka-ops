import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InvoiceStatus } from '../../shared/enums/invoice-status.enum';
import { ServiceRequestStatus } from '../../shared/enums/service-request-status.enum';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  const repository = {
    findOne: jest.fn(),
    create: <T>(value: T): T => value,
    save: <T>(value: T): Promise<T> => Promise.resolve(value),
    createQueryBuilder: jest.fn(),
  };
  const serviceRequestsService = {
    findById: jest.fn(),
  };
  const inventoryService = {
    findPartsForServiceRequest: jest.fn(),
  };

  const service = new InvoicesService(
    repository as never,
    serviceRequestsService as never,
    inventoryService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an invoice from labor and price snapshots', async () => {
    repository.findOne.mockResolvedValue(null);
    serviceRequestsService.findById.mockResolvedValue({
      id: 'request-1',
      status: ServiceRequestStatus.COMPLETED,
    });
    inventoryService.findPartsForServiceRequest.mockResolvedValue([
      { quantityUsed: 2, unitPriceAtUse: '125.50' },
      { quantityUsed: 1, unitPriceAtUse: '80.00' },
    ]);

    await expect(
      service.create({ serviceRequestId: 'request-1', laborCost: '500.00' }),
    ).resolves.toMatchObject({
      serviceRequestId: 'request-1',
      laborCost: '500.00',
      partsCost: '331.00',
      totalAmount: '831.00',
      status: InvoiceStatus.UNPAID,
    });
  });

  it('rejects duplicate invoice creation', async () => {
    repository.findOne.mockResolvedValue({ id: 'invoice-1' });

    await expect(
      service.create({ serviceRequestId: 'request-1', laborCost: '500.00' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects invoices for incomplete service requests', async () => {
    repository.findOne.mockResolvedValue(null);
    serviceRequestsService.findById.mockResolvedValue({
      id: 'request-1',
      status: ServiceRequestStatus.IN_PROGRESS,
    });

    await expect(
      service.create({ serviceRequestId: 'request-1', laborCost: '500.00' }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });
});
