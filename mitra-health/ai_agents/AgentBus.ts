
type Handler<T> = (payload: T) => void;

class AgentBus {
  private handlers = new Map<string, Handler<any>[]>();

  subscribe<T>(event: string, handler: Handler<T>) {
    const list = this.handlers.get(event) || [];
    this.handlers.set(event, [...list, handler]);
    return () => {
      const current = this.handlers.get(event) || [];
      this.handlers.set(event, current.filter(h => h !== handler));
    };
  }

  emit<T>(event: string, payload: T) {
    (this.handlers.get(event) || []).forEach(h => h(payload));
  }
}

export const agentBus = new AgentBus();
