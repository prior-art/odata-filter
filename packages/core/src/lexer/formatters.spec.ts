import { dateFormatter, timeFormatter, datetimeFormatter, durationFormatter } from './formatters';
import { Temporal } from '@js-temporal/polyfill';

vi.mock('@js-temporal/polyfill');

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

describe('formatters', () => {
  describe('#dateFormatter', () => {
    it('should catch unexpected errors', () => {
      expect.assertions(2);

      const invalidDate = 'invalid-date';
      Temporal.PlainDate.from = vi.fn().mockImplementation(() => {
        throw new Error('date error');
      });

      try {
        dateFormatter(invalidDate);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('date error');
      }
    });
  });

  describe('#datetimeFormatter', () => {
    it('should catch unexpected errors', () => {
      expect.assertions(2);

      const invalidDatetime = 'invalid-datetime';
      Temporal.Instant.from = vi.fn().mockImplementation(() => {
        throw new Error('datetime error');
      });

      try {
        datetimeFormatter(invalidDatetime);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('datetime error');
      }
    });
  });

  describe('#timeFormatter', () => {
    it('should catch unexpected errors', () => {
      expect.assertions(2);

      const invalidTime = 'invalid-time';
      Temporal.PlainTime.from = vi.fn().mockImplementation(() => {
        throw new Error('time error');
      });

      try {
        timeFormatter(invalidTime);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('time error');
      }
    });
  });

  describe('#durationFormatter', () => {
    it('should catch unexpected errors', () => {
      expect.assertions(2);

      const invalidDuration = 'invalid-duration';
      Temporal.Duration.from = vi.fn().mockImplementation(() => {
        throw new Error('duration error');
      });

      try {
        durationFormatter(invalidDuration);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('duration error');
      }
    });
  });
});
