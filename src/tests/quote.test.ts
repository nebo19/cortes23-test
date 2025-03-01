import { quote } from '../api/quote';
import Quote from 'database/models/Quote';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utils/response', () => ({
  response: vi.fn((statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
  })),
}));

describe('Quote API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return rates when valid product ID and valid payload is provided', async () => {
    vi.spyOn(Quote, 'findOne').mockResolvedValue({
      rates: [
        {
          rate_class: 'preferredPlus',
          rate_options: { term10: 4474 },
        },
      ],
    } as any);

    const payload = JSON.stringify({
      productId: 'test-product-id',
      state: 'PA',
      sex: 'M',
    });

    const result = await quote(payload);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).rates).toEqual([
      { rate_class: 'preferredPlus', term10: 4474 },
    ]);
    expect(Quote.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { product_id: 'test-product-id' },
      })
    );
  });

  it('should return 404 when no rates are found', async () => {
    vi.spyOn(Quote, 'findOne').mockResolvedValue({
      rates: [],
    } as any);

    const payload = JSON.stringify({
      productId: 'test-product-id',
    });

    const result = await quote(payload);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('Rates not found');
  });

  it('should return 400 if some fields are invalid', async () => {
    const payload = JSON.stringify({
      productId: 'test-product-id',
      invalidField: 'invalid-value',
    });

    const result = await quote(payload);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Validation error');
  });
});
