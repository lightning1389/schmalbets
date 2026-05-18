import { dbRead, dbWrite, dbUpdate, dbDelete, signInWithEmail } from '@/lib/firebase';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Firebase RTDB REST API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('dbRead', () => {
    it('fetches data from correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 'trade-1': { id: 'trade-1', symbol: 'NVDA' } }),
      });

      const result = await dbRead('trades');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/trades.json')
      );
      expect(result).toEqual({ 'trade-1': { id: 'trade-1', symbol: 'NVDA' } });
    });

    it('returns null on failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const result = await dbRead('trades');
      expect(result).toBeNull();
    });
  });

  describe('dbWrite', () => {
    it('sends PUT with auth token', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const result = await dbWrite('trades/test-1', { id: 'test-1' }, 'token123');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('auth=token123'),
        expect.objectContaining({ method: 'PUT' })
      );
      expect(result).toBe(true);
    });

    it('returns false on failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const result = await dbWrite('trades/test-1', {}, 'token');
      expect(result).toBe(false);
    });
  });

  describe('dbUpdate', () => {
    it('sends PATCH with auth token', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const result = await dbUpdate('trades/test-1', { currentPrice: 200 }, 'token123');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('auth=token123'),
        expect.objectContaining({ method: 'PATCH' })
      );
      expect(result).toBe(true);
    });
  });

  describe('dbDelete', () => {
    it('sends DELETE with auth token', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      const result = await dbDelete('trades/test-1', 'token123');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('auth=token123'),
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(result).toBe(true);
    });
  });

  describe('signInWithEmail', () => {
    it('calls Firebase Auth REST API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          idToken: 'id-token-123',
          email: 'admin@test.com',
          expiresIn: '3600',
          localId: 'uid-123',
        }),
      });

      const result = await signInWithEmail('admin@test.com', 'password');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('identitytoolkit.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('admin@test.com'),
        })
      );
      expect(result.idToken).toBe('id-token-123');
    });

    it('throws on auth failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: { message: 'INVALID_PASSWORD' } }),
      });

      await expect(signInWithEmail('bad@test.com', 'wrong')).rejects.toThrow('INVALID_PASSWORD');
    });
  });
});
