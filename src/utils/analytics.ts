type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

class AnalyticsClient {
  private enabled: boolean;
  constructor() {
    this.enabled = true;
  }
  track(event: AnalyticsEvent): void {
    if (!this.enabled || typeof window === 'undefined') return;
    // Placeholder: replace with real analytics SDK
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event.name, event.properties ?? {});
  }
}

export const analytics = new AnalyticsClient();
