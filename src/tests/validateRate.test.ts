import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateRate } from '../api/validateRate';
import Rate from 'database/models/Rate';

vi.mock('../utils/response', () => ({
  response: vi.fn((statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
  })),
}));

describe('ValidateRate API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return success when rate is valid', async () => {
    vi.spyOn(Rate, 'findOne').mockResolvedValue({
      rate_id: 'test-rate-id',
      rate_class: 'preferredPlus',
      rate_options: { term10: 4474 },
    } as any);

    const payload = JSON.stringify({
      rateClass: 'preferredPlus',
      coveragePeriod: 'term10',
      selectedPremium: 4474,
    });

    const result = await validateRate(payload);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Success');
  });

  it('should return 400 when rate is not valid', async () => {
    vi.spyOn(Rate, 'findOne').mockResolvedValue(null);

    const payload = JSON.stringify({
      rateClass: 'preferredPlus',
      coveragePeriod: 'term10',
      selectedPremium: 999.99,
    });

    const result = await validateRate(payload);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Rate not valid');
  });

  it('should return validation error for invalid payload', async () => {
    const payload = JSON.stringify({
      rateClass: 'preferredPlus',
      invalidField: 'invalid-value',
    });

    const result = await validateRate(payload);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Validation error');
  });
});
