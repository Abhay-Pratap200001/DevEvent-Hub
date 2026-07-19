export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const connectDB = (await import('@/lib/mongodb')).default;
    try {
      await connectDB();
    } catch (error) {
      // Don't crash the server on a boot-time warm-up failure; the first
      // real request will retry the connection via connectDB().
      console.error('[instrumentation] DB warm-up failed, will retry on first request:', error);
    }
  }
}
