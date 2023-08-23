class NetworkService {
  async getPing() {
    const startTime = Date.now();
    const response = await fetch(
      `https://www.google.com/?qlped=${Date.now()}`,
      {
        method: 'HEAD',
      },
    );
    const endTime = Date.now();
    const duration = endTime - startTime;
    const status = response.status;
    return {duration, status};
  }
}

export default new NetworkService();
